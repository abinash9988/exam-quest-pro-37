import { Link } from "@tanstack/react-router";
import { Lock, ShoppingBag, Sparkles } from "lucide-react";
import type { Community } from "@/lib/communityMock";

export function LockedCommunityCard({ community, full }: { community: Community; full?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 ${full ? "p-6 md:p-10" : "p-5"}`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${community.gradient}`} />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${community.gradient} text-white shadow`}>
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Locked</p>
            <h3 className={`font-extrabold tracking-tight ${full ? "text-2xl md:text-3xl" : "text-base"}`}>{community.name}</h3>
          </div>
        </div>
        <p className={`mt-3 text-sm text-muted-foreground ${full ? "max-w-md" : ""}`}>
          Purchase any {community.name.split(" ")[0]} mock test or activate a category subscription to unlock this community and start discussing with peers.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/dashboard/mock-tests"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Buy a mock test
          </Link>
          <Link
            to="/dashboard/subscriptions"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-muted"
          >
            <Sparkles className="h-3.5 w-3.5" />
            See plans
          </Link>
        </div>
      </div>
    </div>
  );
}
