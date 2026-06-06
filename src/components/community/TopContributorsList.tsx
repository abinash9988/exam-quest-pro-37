import { Trophy } from "lucide-react";
import type { TopContributor } from "@/lib/communityMock";

export function TopContributorsList({ contributors }: { contributors: TopContributor[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-[var(--warning)]" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top contributors</p>
      </div>
      <ul className="mt-3 space-y-2">
        {contributors.map((c, i) => (
          <li key={c.name} className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-[10px] font-bold">{i + 1}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--gradient-hero)] text-[10px] font-bold text-primary-foreground">
              {c.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">{c.messages} msgs · {c.badges} badges</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
