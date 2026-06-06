import type { Message } from "@/lib/communityMock";

function formatTime(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 60_000;
  if (diff < 1) return "now";
  if (diff < 60) return `${Math.floor(diff)}m`;
  if (diff < 60 * 24) return `${Math.floor(diff / 60)}h`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function MessageBubble({ message, mine }: { message: Message; mine?: boolean }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/70 px-4 py-2.5 transition hover:border-border">
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-sm font-semibold ${mine ? "text-primary" : "text-foreground"}`}>
          {message.authorName}
          {mine && <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">YOU</span>}
        </span>
        <span className="shrink-0 text-[11px] text-muted-foreground">{formatTime(message.sentAt)}</span>
      </div>
      <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{message.text}</p>
    </div>
  );
}
