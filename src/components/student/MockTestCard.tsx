import { Play, RotateCcw, ArrowRight, Clock4, ListChecks } from "lucide-react";
import { type UnlockedTest, getCategoryById } from "@/lib/studentMock";
import { CountdownBadge } from "./CountdownBadge";

const diffTone: Record<UnlockedTest["difficulty"], string> = {
  Easy: "bg-[var(--success)]/15 text-[var(--success)]",
  Medium: "bg-[var(--warning)]/15 text-[var(--warning)]",
  Hard: "bg-destructive/15 text-destructive",
};

export function MockTestCard({ test }: { test: UnlockedTest }) {
  const cat = getCategoryById(test.categoryId);
  const cta =
    test.status === "completed"
      ? { label: "Reattempt", Icon: RotateCcw }
      : test.status === "in-progress"
      ? { label: "Continue", Icon: ArrowRight }
      : { label: "Start", Icon: Play };

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${cat.gradient} text-sm`}>
            {cat.icon}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{cat.name}</span>
        </div>
        <CountdownBadge validUntil={test.validUntil} />
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug">{test.name}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span className={`rounded-md px-1.5 py-0.5 font-semibold ${diffTone[test.difficulty]}`}>{test.difficulty}</span>
        <span className="inline-flex items-center gap-1"><ListChecks className="h-3 w-3" />{test.questions} Qs</span>
        <span className="inline-flex items-center gap-1"><Clock4 className="h-3 w-3" />{test.durationMin}m</span>
      </div>

      {test.status === "in-progress" && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Progress</span>
            <span className="tabular-nums">{test.progressPct}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[var(--gradient-hero)] transition-all" style={{ width: `${test.progressPct}%` }} />
          </div>
        </div>
      )}

      <div className="mt-auto pt-4">
        <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground transition hover:scale-[1.02]">
          <cta.Icon className="h-3.5 w-3.5" /> {cta.label}
        </button>
      </div>
    </div>
  );
}
