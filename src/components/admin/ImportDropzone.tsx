import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Download } from "lucide-react";

const ACCEPT = [".csv", ".xlsx"];
const MAX_MB = 10;

const CSV_TEMPLATE =
  "question,subject,chapter,difficulty,type,optionA,optionB,optionC,optionD,correct,explanation\n" +
  "Sample question?,Physics,Kinematics,Easy,MCQ_SINGLE,2,4,6,8,B,Worked solution here.\n";

function downloadBlob(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export function downloadTemplate(kind: "csv" | "xlsx") {
  if (kind === "csv") downloadBlob("question-template.csv", CSV_TEMPLATE, "text/csv");
  else downloadBlob("question-template.xlsx", CSV_TEMPLATE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}

export function ImportDropzone({ onFile }: { onFile: (file: File) => void }) {
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (f: File) => {
    const ext = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ACCEPT.includes(ext)) return `Only ${ACCEPT.join(", ")} files are supported`;
    if (f.size > MAX_MB * 1024 * 1024) return `File must be under ${MAX_MB}MB`;
    return null;
  };

  const handle = (f: File) => {
    const e = validate(f);
    if (e) { setErr(e); return; }
    setErr(null);
    setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 12 + Math.random() * 18;
      if (p >= 100) {
        clearInterval(t);
        setProgress(100);
        setTimeout(() => { setProgress(null); onFile(f); }, 250);
      } else setProgress(p);
    }, 120);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          const f = e.dataTransfer.files?.[0]; if (f) handle(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed bg-card p-8 text-center shadow-[var(--shadow-card)] transition sm:p-10 ${
          drag ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50"
        }`}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Upload className="h-7 w-7" />
        </div>
        <div className="mt-3 text-base font-bold">Drop CSV or Excel file</div>
        <div className="mt-1 text-xs text-muted-foreground">.csv or .xlsx · up to {MAX_MB}MB</div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          <FileSpreadsheet className="h-4 w-4" /> Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ""; }}
        />
      </div>

      {progress !== null && (
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="font-semibold">Uploading…</span>
            <span className="tabular-nums text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {err && <div className="rounded-xl border border-[var(--destructive)]/30 bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-3 py-2 text-xs text-[var(--destructive)]">{err}</div>}

      <div className="flex flex-wrap gap-2 text-xs">
        <button onClick={() => downloadTemplate("csv")} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-semibold hover:bg-muted">
          <Download className="h-3.5 w-3.5" /> CSV template
        </button>
        <button onClick={() => downloadTemplate("xlsx")} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-semibold hover:bg-muted">
          <Download className="h-3.5 w-3.5" /> Excel template
        </button>
      </div>
    </div>
  );
}
