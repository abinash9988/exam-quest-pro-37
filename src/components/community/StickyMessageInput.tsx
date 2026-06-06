import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { MAX_MESSAGE_LEN } from "@/lib/communityMock";

interface Props {
  onSend: (text: string) => void;
}

export function StickyMessageInput({ onSend }: Props) {
  const [value, setValue] = useState("");
  const overLimit = value.length > MAX_MESSAGE_LEN;
  const disabled = value.trim().length === 0 || overLimit;

  const send = () => {
    if (disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+64px)] z-20 mt-4 lg:bottom-4">
      <div className="rounded-2xl border border-border/70 bg-background/90 p-2 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
        <div className="flex items-end gap-2">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            placeholder="Share a study tip, doubt, or question…"
            rows={1}
            className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl bg-muted/40 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:bg-muted/60"
          />
          <button
            type="button"
            onClick={send}
            disabled={disabled}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)] transition disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
          <span>Enter to send · Shift+Enter for newline</span>
          <span className={overLimit ? "font-semibold text-destructive" : ""}>
            {value.length} / {MAX_MESSAGE_LEN}
          </span>
        </div>
      </div>
    </div>
  );
}
