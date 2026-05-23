import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { findDuplicates, type AdminQuestion } from "@/lib/adminMock";
import { StatusBadge } from "./StatusBadge";

export function DuplicateWarningPanel({ question }: { question: AdminQuestion }) {
  const matches = findDuplicates(question);
  const [open, setOpen] = useState<AdminQuestion | null>(null);

  if (!matches.length) {
    return <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">No similar questions detected. ✓</div>;
  }

  return (
    <>
      <div className="space-y-2">
        {matches.map(({ question: m, similarity }) => {
          const pct = Math.round(similarity * 100);
          const tone = pct >= 70 ? "var(--destructive)" : "var(--warning)";
          return (
            <div
              key={m.id}
              className="rounded-xl border p-3"
              style={{
                borderColor: tone,
                backgroundColor: `color-mix(in oklab, ${tone} 8%, transparent)`,
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: tone }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold" style={{ color: tone }}>{pct}% similar</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{m.id}</span>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: m.question }} />
                  <button onClick={() => setOpen(m)} className="mt-2 text-[11px] font-semibold text-primary hover:underline">
                    Compare side-by-side →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl border border-border bg-background p-4 shadow-[var(--shadow-elevated)] sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Duplicate compare</div>
                <h3 className="text-base font-bold">Current vs {open.id}</h3>
              </div>
              <button onClick={() => setOpen(null)} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Side title="Current draft" q={question} />
              <Side title={`Existing · ${open.id}`} q={open} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Side({ title, q }: { title: string; q: AdminQuestion }) {
  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="rounded-lg border border-border bg-background p-2 text-xs">
        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: q.question }} />
      </div>
      <div className="space-y-1">
        {q.options.map((o, i) => (
          <div key={o.id} className="rounded-md border border-border bg-background p-1.5 text-xs">
            <span className="font-mono text-[10px] text-muted-foreground">{String.fromCharCode(65 + i)}{o.isCorrect ? " ✓" : ""}</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: o.html }} />
          </div>
        ))}
      </div>
    </div>
  );
}
