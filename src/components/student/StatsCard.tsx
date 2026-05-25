import type { LucideIcon } from "lucide-react";

type Tone = "primary" | "success" | "warning" | "review" | "accent";

const toneMap: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-[var(--success)]/10 text-[var(--success)]",
  warning: "bg-[var(--warning)]/15 text-[var(--warning)]",
  review: "bg-[var(--review)]/10 text-[var(--review)]",
  accent: "bg-accent/15 text-accent",
};

export function StatsCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="group rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {hint && <span className="text-[10px] font-medium text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-3 text-xl font-bold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
