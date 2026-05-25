import { Check, Sparkles } from "lucide-react";
import { type Plan } from "@/lib/studentMock";

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 ${
        plan.highlight
          ? "border-primary bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elevated)]"
          : "border-border/60 bg-card"
      }`}
    >
      {plan.badge && (
        <span
          className={`absolute -top-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            plan.highlight ? "bg-white text-primary" : "bg-primary text-primary-foreground"
          }`}
        >
          <Sparkles className="h-3 w-3" /> {plan.badge}
        </span>
      )}

      <div className="text-sm font-semibold opacity-80">{plan.name}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums">₹{plan.price.toLocaleString("en-IN")}</span>
        <span className="text-xs opacity-70">/ {plan.period}</span>
      </div>

      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs">
            <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${plan.highlight ? "text-white" : "text-[var(--success)]"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        className={`mt-5 rounded-xl py-2.5 text-sm font-semibold transition hover:scale-[1.02] ${
          plan.highlight
            ? "bg-white text-primary"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {plan.highlight ? "Upgrade now" : "Choose plan"}
      </button>
    </div>
  );
}
