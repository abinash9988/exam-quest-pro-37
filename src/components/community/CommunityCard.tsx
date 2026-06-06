import { Link } from "@tanstack/react-router";
import { Lock, Users, MessageSquare } from "lucide-react";
import type { Community } from "@/lib/communityMock";

interface Props {
  community: Community;
  locked?: boolean;
  active?: boolean;
  compact?: boolean;
}

export function CommunityCard({ community, locked, active, compact }: Props) {
  const inner = (
    <div
      className={`group relative flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 transition hover:border-primary/50 hover:bg-card ${
        active ? "border-primary/70 ring-1 ring-primary/30" : ""
      }`}
    >
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${community.gradient} text-sm font-bold text-white shadow`}
      >
        {community.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{community.name}</p>
          {locked && <Lock className="h-3 w-3 shrink-0 text-muted-foreground" />}
        </div>
        {!compact && (
          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{community.activeMembers.toLocaleString()}</span>
            <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" />{community.dailyMessages}/day</span>
          </div>
        )}
      </div>
      {!locked && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--success)]" />}
    </div>
  );

  if (locked) {
    return <div className="opacity-70">{inner}</div>;
  }
  return (
    <Link to="/community/$slug" params={{ slug: community.slug }} className="block">
      {inner}
    </Link>
  );
}
