import { useState } from "react";
import { MessageSquare, CheckCircle2, X, Send } from "lucide-react";
import type { ModerationComment } from "@/lib/adminMock";

interface Props {
  comments: ModerationComment[];
  onAdd: (c: { type: "note" | "approve" | "reject"; message: string }) => void;
}

export function ModerationPanel({ comments, onAdd }: Props) {
  const [msg, setMsg] = useState("");
  const [kind, setKind] = useState<"note" | "approve" | "reject">("note");

  const submit = () => {
    if (!msg.trim()) return;
    onAdd({ type: kind, message: msg.trim() });
    setMsg("");
    setKind("note");
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {comments.length === 0 && <div className="text-xs text-muted-foreground">No moderation comments yet.</div>}
        {comments.slice().reverse().map((c) => {
          const tone = c.type === "approve" ? "var(--success)" : c.type === "reject" ? "var(--destructive)" : "var(--review)";
          const Icon = c.type === "approve" ? CheckCircle2 : c.type === "reject" ? X : MessageSquare;
          return (
            <div key={c.id} className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ backgroundColor: tone }}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold">{c.author}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{c.role}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-2 text-xs text-foreground">{c.message}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-background p-3">
        <div className="mb-2 flex items-center gap-1 text-xs">
          {(["note", "approve", "reject"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-md px-2 py-1 font-semibold capitalize ${kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              {k}
            </button>
          ))}
        </div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={2}
          placeholder="Add a moderation comment…"
          className="w-full resize-none rounded-lg border border-border bg-background px-2.5 py-2 text-xs outline-none focus:border-primary"
        />
        <div className="mt-2 flex justify-end">
          <button onClick={submit} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Send className="h-3 w-3" /> Post
          </button>
        </div>
      </div>
    </div>
  );
}
