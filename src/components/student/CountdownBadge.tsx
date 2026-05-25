import { Clock } from "lucide-react";
import { daysRemaining } from "@/lib/studentMock";

export function CountdownBadge({ validUntil }: { validUntil: string }) {
  const days = daysRemaining(validUntil);
  let tone = "bg-[var(--success)]/15 text-[var(--success)]";
  let label = `${days}d left`;
  if (days < 0) {
    tone = "bg-destructive/15 text-destructive";
    label = "Expired";
  } else if (days === 0) {
    tone = "bg-[var(--warning)]/20 text-[var(--warning)]";
    label = "Expires today";
  } else if (days <= 3) {
    tone = "bg-[var(--warning)]/15 text-[var(--warning)]";
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
      <Clock className="h-3 w-3" /> {label}
    </span>
  );
}
