import { createFileRoute } from "@tanstack/react-router";
import { joinedCommunities, lockedCommunities } from "@/lib/communityMock";
import { CommunityBanner } from "@/components/community/CommunityBanner";
import { CommunityCard } from "@/components/community/CommunityCard";
import { LockedCommunityCard } from "@/components/community/LockedCommunityCard";
import { EngagementStrip } from "@/components/community/EngagementStrip";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Your Communities · MockArena" },
      { name: "description", content: "Your joined and locked exam communities — discover discussions and connect with peers." },
    ],
  }),
  component: CommunityOverview,
});

function CommunityOverview() {
  const joined = joinedCommunities();
  const locked = lockedCommunities();
  const featured = joined[0] ?? locked[0];

  return (
    <div className="space-y-6">
      {featured && <CommunityBanner community={featured} />}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Your communities</h2>
          <span className="text-xs text-muted-foreground">{joined.length} joined</span>
        </div>
        {joined.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-muted-foreground">
            You haven't unlocked any community yet. Purchase a mock test to get started.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {joined.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        )}
      </section>

      {locked.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Locked communities</h2>
            <span className="text-xs text-muted-foreground">{locked.length} locked</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {locked.map((c) => (
              <LockedCommunityCard key={c.id} community={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold tracking-tight">Stay engaged</h2>
        <EngagementStrip />
      </section>
    </div>
  );
}
