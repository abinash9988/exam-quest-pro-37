import { Users, MessageSquare, Activity } from "lucide-react";
import type { Community } from "@/lib/communityMock";

export function CommunityStatsCard({ community }: { community: Community }) {
  const items = [
    { label: "Active students", value: community.activeMembers.toLocaleString(), icon: Users },
    { label: "Total discussions", value: community.totalDiscussions.toLocaleString(), icon: MessageSquare },
    { label: "Daily messages", value: community.dailyMessages.toLocaleString(), icon: Activity },
  ];
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-md">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live stats</p>
      <div className="mt-3 space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
              <it.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold leading-none">{it.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{it.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
