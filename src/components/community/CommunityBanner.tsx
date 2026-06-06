import { Users, MessageSquare, Activity } from "lucide-react";
import type { Community } from "@/lib/communityMock";

export function CommunityBanner({ community }: { community: Community }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${community.gradient} p-5 text-white shadow-[var(--shadow-elevated)] md:p-7`}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-black/20 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Community</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">{community.name}</h1>
        <p className="mt-1 max-w-xl text-sm text-white/85">{community.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold backdrop-blur"><Users className="h-3 w-3" />{community.activeMembers.toLocaleString()} members</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold backdrop-blur"><MessageSquare className="h-3 w-3" />{community.totalDiscussions.toLocaleString()} discussions</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold backdrop-blur"><Activity className="h-3 w-3" />{community.dailyMessages}/day</span>
        </div>
      </div>
    </div>
  );
}
