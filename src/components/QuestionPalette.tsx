import { X } from "lucide-react";

export type QStatus = "answered" | "current" | "review" | "not-visited" | "answered-review";

export function QuestionPalette({
  open,
  onClose,
  statuses,
  current,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  statuses: QStatus[];
  current: number;
  onJump: (i: number) => void;
}) {
  if (!open) return null;
  const counts = {
    answered: statuses.filter((s) => s === "answered").length,
    review: statuses.filter((s) => s === "review" || s === "answered-review").length,
    notVisited: statuses.filter((s) => s === "not-visited").length,
  };
  const colorOf = (s: QStatus, idx: number) => {
    if (idx === current) return "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2";
    switch (s) {
      case "answered": return "bg-[var(--success)] text-white";
      case "review": return "bg-[var(--review)] text-white";
      case "answered-review": return "bg-[var(--review)] text-white ring-2 ring-[var(--success)]";
      default: return "bg-muted text-muted-foreground";
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-background p-5 shadow-2xl animate-in slide-in-from-bottom md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-96 md:rounded-l-3xl md:rounded-tr-none md:slide-in-from-right">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold">Question Palette</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-[var(--success)]/10 p-2">
            <div className="text-lg font-bold text-[var(--success)]">{counts.answered}</div>
            <div className="text-muted-foreground">Answered</div>
          </div>
          <div className="rounded-xl bg-[var(--review)]/10 p-2">
            <div className="text-lg font-bold text-[var(--review)]">{counts.review}</div>
            <div className="text-muted-foreground">Review</div>
          </div>
          <div className="rounded-xl bg-muted p-2">
            <div className="text-lg font-bold">{counts.notVisited}</div>
            <div className="text-muted-foreground">Pending</div>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {statuses.map((s, i) => (
            <button
              key={i}
              onClick={() => { onJump(i); onClose(); }}
              className={`grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold transition ${colorOf(s, i)}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="mt-5 space-y-2 text-xs text-muted-foreground">
          <Legend dot="bg-[var(--success)]" label="Answered" />
          <Legend dot="bg-primary" label="Current" />
          <Legend dot="bg-[var(--review)]" label="Marked for Review" />
          <Legend dot="bg-muted border border-border" label="Not Visited" />
        </div>
      </div>
    </>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded ${dot}`} />
      <span>{label}</span>
    </div>
  );
}
