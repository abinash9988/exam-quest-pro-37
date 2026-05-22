import { X } from "lucide-react";
import { DevicePreviewFrame } from "./DevicePreviewFrame";
import { QuestionPreviewCard } from "./QuestionPreviewCard";
import type { ImportRow, AdminQuestion } from "@/lib/adminMock";

function toQuestion(r: ImportRow): AdminQuestion {
  return {
    id: `preview-${r.rowNo}`,
    examId: "Preview",
    subject: r.subject,
    chapter: r.chapter,
    topic: "",
    difficulty: r.difficulty,
    type: r.type,
    marks: 4,
    negativeMarks: 1,
    tags: [],
    status: "Draft",
    question: `<p>${r.question}</p>`,
    options: r.options.map((o, i) => ({ id: `o${i}`, html: o.html, isCorrect: o.isCorrect })),
    explanation: `<p>${r.explanation || "<em>No explanation provided.</em>"}</p>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "Import",
  };
}

export function PreviewModal({ row, onClose }: { row: ImportRow | null; onClose: () => void }) {
  if (!row) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl border border-border bg-background p-4 shadow-[var(--shadow-elevated)] sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Row #{row.rowNo} preview</div>
            <h3 className="text-base font-bold">Student view</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <DevicePreviewFrame>
          <QuestionPreviewCard q={toQuestion(row)} />
        </DevicePreviewFrame>
      </div>
    </div>
  );
}
