import { useEffect, useState } from "react";
import { Clock, Flag, ChevronRight } from "lucide-react";
import type { AdminQuestion } from "@/lib/adminMock";
import { QuestionPreviewCard } from "./QuestionPreviewCard";

export function ExamChromeMock({ q, paletteIndex = 7, paletteTotal = 30 }: { q: AdminQuestion; paletteIndex?: number; paletteTotal?: number }) {
  const [sec, setSec] = useState(57 * 60 + 23);
  useEffect(() => {
    const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between rounded-lg bg-foreground/5 px-2.5 py-1.5 text-[11px]">
        <span className="font-semibold">Section 1 · {paletteIndex} / {paletteTotal}</span>
        <span className="flex items-center gap-1 font-mono font-bold text-[var(--destructive)]">
          <Clock className="h-3 w-3" /> {mm}:{ss}
        </span>
      </div>
      <QuestionPreviewCard q={q} />
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: paletteTotal }).map((_, i) => {
          const cls =
            i + 1 === paletteIndex
              ? "bg-primary text-primary-foreground"
              : i < paletteIndex - 1
              ? "bg-[var(--success)] text-white"
              : i % 5 === 0
              ? "bg-[var(--warning)] text-white"
              : "bg-muted text-muted-foreground";
          return <span key={i} className={`grid aspect-square place-items-center rounded text-[9px] font-bold ${cls}`}>{i + 1}</span>;
        })}
      </div>
      <div className="flex items-center justify-between gap-2">
        <button className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
          <Flag className="h-3 w-3" /> Mark
        </button>
        <button className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">
          Save & Next <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
