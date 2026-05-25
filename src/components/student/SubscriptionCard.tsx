import { Check, Settings2 } from "lucide-react";
import { type Subscription, getCategoryById, formatDate } from "@/lib/studentMock";
import { CountdownBadge } from "./CountdownBadge";

export function SubscriptionCard({ sub }: { sub: Subscription }) {
  const cat = getCategoryById(sub.categoryId);
  const isActive = sub.status === "active";
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 shadow-[var(--shadow-card)] transition ${
      isActive ? "border-primary/30 bg-card" : "border-border/60 bg-muted/30"
    }`}>
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${cat.gradient} opacity-20 blur-2xl`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${cat.gradient} text-base`}>
              {cat.icon}
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{cat.name}</div>
              <div className="text-sm font-bold leading-tight">{sub.planName}</div>
            </div>
          </div>
          <CountdownBadge validUntil={sub.expiresAt} />
        </div>

        <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {sub.benefits.map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-[var(--success)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <div className="text-[11px] text-muted-foreground">
            {isActive ? `Renews ${formatDate(sub.expiresAt)}` : `Expired ${formatDate(sub.expiresAt)}`}
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-semibold hover:bg-muted">
            <Settings2 className="h-3 w-3" /> Manage
          </button>
        </div>
      </div>
    </div>
  );
}
