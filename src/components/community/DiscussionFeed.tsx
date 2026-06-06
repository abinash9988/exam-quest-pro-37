import { useMemo, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { MESSAGES_PER_PAGE, type Message } from "@/lib/communityMock";

function dayKey(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
}

interface Props {
  messages: Message[];
  myAuthor: string;
}

export function DiscussionFeed({ messages, myAuthor }: Props) {
  const [pages, setPages] = useState(1);

  const visible = useMemo(() => {
    const sorted = [...messages].sort((a, b) => +new Date(a.sentAt) - +new Date(b.sentAt));
    const start = Math.max(0, sorted.length - pages * MESSAGES_PER_PAGE);
    return sorted.slice(start);
  }, [messages, pages]);

  const grouped = useMemo(() => {
    const out: { day: string; items: Message[] }[] = [];
    for (const m of visible) {
      const key = dayKey(m.sentAt);
      const last = out[out.length - 1];
      if (last && last.day === key) last.items.push(m);
      else out.push({ day: key, items: [m] });
    }
    return out;
  }, [visible]);

  const canLoadMore = visible.length < messages.length;

  return (
    <div className="space-y-4">
      {canLoadMore && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setPages((p) => p + 1)}
            className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            Load earlier messages
          </button>
        </div>
      )}
      {grouped.map((g) => (
        <div key={g.day} className="space-y-2">
          <div className="sticky top-14 z-10 flex items-center gap-2 py-1">
            <span className="rounded-full border border-border/60 bg-background/85 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur">
              {g.day}
            </span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          {g.items.map((m) => (
            <MessageBubble key={m.id} message={m} mine={m.authorName === myAuthor} />
          ))}
        </div>
      ))}
    </div>
  );
}
