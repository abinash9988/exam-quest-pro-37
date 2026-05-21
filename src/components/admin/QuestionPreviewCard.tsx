import type { AdminQuestion } from "@/lib/adminMock";

export function QuestionPreviewCard({ q }: { q: AdminQuestion }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-primary">{q.subject}</span>
        <span className="text-muted-foreground">
          +{q.marks} / -{q.negativeMarks}
        </span>
      </div>
      <div className="mb-1 text-xs font-semibold text-muted-foreground">Q1.</div>
      <div
        className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed text-foreground"
        dangerouslySetInnerHTML={{ __html: q.question || "<p class='text-muted-foreground'>Your question will appear here…</p>" }}
      />

      <div className="mt-4 space-y-2">
        {q.type === "INTEGER" ? (
          <input
            disabled
            placeholder="Enter answer"
            className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm"
          />
        ) : (
          q.options.map((o, i) => (
            <div
              key={o.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-background p-3 transition hover:border-primary/40"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-[11px] font-bold text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              <div className="flex-1">
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: o.html || `<span class='text-muted-foreground'>Option ${String.fromCharCode(65 + i)}</span>` }}
                />
                {o.imageUrl && <img src={o.imageUrl} alt="" className="mt-2 max-h-28 rounded-md" />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-3 text-[11px] text-muted-foreground">
        <span>{q.difficulty}</span>
        <span className="font-mono">{q.type}</span>
      </div>
    </div>
  );
}
