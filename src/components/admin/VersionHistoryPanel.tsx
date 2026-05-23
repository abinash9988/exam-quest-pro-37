import { useState } from "react";
import { Clock, RotateCcw, GitCompare, X } from "lucide-react";
import type { AdminQuestion, QuestionVersion } from "@/lib/adminMock";

interface Props {
  versions: QuestionVersion[];
  current: AdminQuestion;
  onRestore: (v: QuestionVersion) => void;
}

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export function VersionHistoryPanel({ versions, current, onRestore }: Props) {
  const [compare, setCompare] = useState<QuestionVersion | null>(null);

  if (!versions.length) {
    return <div className="text-xs text-muted-foreground">No previous versions yet. Edits will appear here.</div>;
  }

  return (
    <>
      <ul className="space-y-2">
        {versions.slice().reverse().map((v) => (
          <li key={v.id} className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-soft text-[11px] font-bold text-primary">v{v.version}</span>
                <div>
                  <div className="text-xs font-semibold">{v.changeSummary}</div>
                  <div className="text-[10px] text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" />
                    {new Date(v.editedAt).toLocaleString()} · {v.editedBy}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCompare(v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" title="Compare">
                  <GitCompare className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => onRestore(v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" title="Restore">
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {compare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-sm" onClick={() => setCompare(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl border border-border bg-background p-4 shadow-[var(--shadow-elevated)] sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Compare</div>
                <h3 className="text-base font-bold">v{compare.version} vs current</h3>
              </div>
              <button onClick={() => setCompare(null)} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Side title={`v${compare.version} · ${new Date(compare.editedAt).toLocaleDateString()}`} q={compare.snapshot} other={current} />
              <Side title="Current" q={current} other={compare.snapshot} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setCompare(null)} className="rounded-xl border border-border px-3 py-2 text-xs font-semibold">Close</button>
              <button onClick={() => { onRestore(compare); setCompare(null); }} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                <RotateCcw className="h-3.5 w-3.5" /> Restore this version
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Side({ title, q, other }: { title: string; q: AdminQuestion; other: AdminQuestion }) {
  const diff = (a: string, b: string) =>
    stripHtml(a) === stripHtml(b)
      ? "border-border bg-background"
      : "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)]";
  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className={`rounded-lg border p-2 text-xs ${diff(q.question, other.question)}`}>
        <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Question</div>
        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: q.question }} />
      </div>
      <div className="space-y-1">
        {q.options.map((o, i) => (
          <div key={o.id} className={`rounded-md border p-1.5 text-xs ${diff(o.html, other.options[i]?.html ?? "")}`}>
            <span className="font-mono text-[10px] text-muted-foreground">{String.fromCharCode(65 + i)}{o.isCorrect ? " ✓" : ""}</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: o.html }} />
          </div>
        ))}
      </div>
      <div className={`rounded-lg border p-2 text-xs ${diff(q.explanation, other.explanation)}`}>
        <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Explanation</div>
        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: q.explanation }} />
      </div>
    </div>
  );
}
