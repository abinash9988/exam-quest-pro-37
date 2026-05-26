import { ArrowRight, BookOpen, Flame, Target } from "lucide-react";
import type { Recommendation } from "@/lib/studentMock";
import { getCategoryById } from "@/lib/studentMock";

const TYPE_META = {
  test: { Icon: BookOpen, label: "Mock test" },
  topic: { Icon: Target, label: "Topic" },
  challenge: { Icon: Flame, label: "Challenge" },
} as const;

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const cat = getCategoryById(rec.categoryId);
  const meta = TYPE_META[rec.type];
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${cat.gradient} text-sm`}>
          {cat.icon}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          <meta.Icon className="h-3 w-3" /> {meta.label}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold leading-snug">{rec.title}</h3>
      <p className="mt-1 text-[11px] text-muted-foreground">{rec.reason}</p>
      <button className="mt-auto inline-flex items-center justify-between gap-1 pt-3 text-xs font-semibold text-primary">
        Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
