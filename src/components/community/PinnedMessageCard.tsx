import { Pin, Megaphone, Sparkles, Calendar, AlertTriangle } from "lucide-react";
import type { PinnedItem, PinnedKind } from "@/lib/communityMock";

const kindMeta: Record<PinnedKind, { label: string; icon: typeof Pin; tone: string }> = {
  daily: { label: "Daily", icon: Calendar, tone: "bg-primary/15 text-primary" },
  alert: { label: "Alert", icon: AlertTriangle, tone: "bg-destructive/15 text-destructive" },
  motivation: { label: "Motivation", icon: Sparkles, tone: "bg-[var(--warning)]/15 text-[var(--warning)]" },
  announcement: { label: "Announcement", icon: Megaphone, tone: "bg-[var(--success)]/15 text-[var(--success)]" },
};

export function PinnedMessageCard({ item }: { item: PinnedItem }) {
  const meta = kindMeta[item.kind];
  const Icon = meta.icon;
  return (
    <div className="relative shrink-0 rounded-2xl border border-border/60 bg-card/70 p-4 transition hover:border-primary/40 md:w-80">
      <div className="mb-2 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.tone}`}>
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
        <Pin className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold leading-snug">{item.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
    </div>
  );
}
