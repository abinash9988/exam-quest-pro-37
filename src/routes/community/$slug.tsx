import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getCommunityBySlug,
  hasCommunityAccess,
  incomingMessagePool,
  messagesByCommunity,
  pinnedByCommunity,
  POLL_INTERVAL_MS,
  topContributorsByCommunity,
  weeklyActivityByCommunity,
  type Community,
  type Message,
} from "@/lib/communityMock";
import { student } from "@/lib/studentMock";
import { CommunityBanner } from "@/components/community/CommunityBanner";
import { LockedCommunityCard } from "@/components/community/LockedCommunityCard";
import { PinnedMessageCard } from "@/components/community/PinnedMessageCard";
import { DiscussionFeed } from "@/components/community/DiscussionFeed";
import { StickyMessageInput } from "@/components/community/StickyMessageInput";
import { CommunityStatsCard } from "@/components/community/CommunityStatsCard";
import { ActivityGraph } from "@/components/community/ActivityGraph";
import { TopContributorsList } from "@/components/community/TopContributorsList";

export const Route = createFileRoute("/community/$slug")({
  loader: ({ params }) => {
    const community = getCommunityBySlug(params.slug);
    if (!community) throw notFound();
    return { community };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.community.name ?? "Community"} · MockArena` },
      { name: "description", content: loaderData?.community.tagline ?? "Exam-focused student community." },
      { property: "og:title", content: `${loaderData?.community.name ?? "Community"} · MockArena` },
      { property: "og:description", content: loaderData?.community.tagline ?? "Discuss with fellow aspirants." },
    ],
  }),
  component: CommunityFeedPage,
});

function CommunityFeedPage() {
  const { community } = Route.useLoaderData();
  const unlocked = hasCommunityAccess(community.categoryId);

  if (!unlocked) {
    return (
      <div className="space-y-5">
        <CommunityBanner community={community} />
        <LockedCommunityCard community={community} full />
      </div>
    );
  }

  return <UnlockedCommunity community={community} />;
}

function UnlockedCommunity({ community }: { community: Community }) {
  const seed = useMemo(() => messagesByCommunity[community.id] ?? [], [community.id]);
  const [messages, setMessages] = useState<Message[]>(seed);
  const pinned = pinnedByCommunity[community.id] ?? [];
  const contributors = topContributorsByCommunity[community.id] ?? [];
  const activity = weeklyActivityByCommunity[community.id] ?? [];

  // Simulated "live" polling
  useEffect(() => {
    setMessages(seed);
    const id = window.setInterval(() => {
      if (Math.random() > 0.5) {
        const pick = incomingMessagePool[Math.floor(Math.random() * incomingMessagePool.length)];
        setMessages((prev) => [
          ...prev,
          {
            id: `${community.id}-live-${Date.now()}`,
            communityId: community.id,
            authorName: pick.name,
            authorInitials: pick.initials,
            text: pick.text,
            sentAt: new Date().toISOString(),
          },
        ]);
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [community.id, seed]);

  const onSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${community.id}-me-${Date.now()}`,
        communityId: community.id,
        authorName: student.name,
        authorInitials: student.avatar,
        text,
        sentAt: new Date().toISOString(),
      },
    ]);
    toast.success("Message sent");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 space-y-4">
        <CommunityBanner community={community} />

        {pinned.length > 0 && (
          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
              {pinned.map((p) => (
                <PinnedMessageCard key={p.id} item={p} />
              ))}
            </div>
          </div>
        )}

        <DiscussionFeed messages={messages} myAuthor={student.name} />

        <StickyMessageInput onSend={onSend} />
      </div>

      <aside className="hidden space-y-4 lg:block">
        <CommunityStatsCard community={community} />
        <ActivityGraph data={activity} />
        <TopContributorsList contributors={contributors} />
      </aside>
    </div>
  );
}
