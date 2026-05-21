import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { importJobs } from "@/lib/adminMock";

export const Route = createFileRoute("/admin/import/")({
  head: () => ({ meta: [{ title: "Import · Admin" }] }),
  component: ImportPage,
});

function ImportPage() {
  const [drag, setDrag] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Bulk Import</h1>
        <p className="text-xs text-muted-foreground">Upload a CSV to seed the question bank. We'll validate before publishing.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); }}
          className={`rounded-2xl border-2 border-dashed bg-card p-10 text-center shadow-[var(--shadow-card)] transition ${drag ? "border-primary bg-primary-soft" : "border-border"}`}
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
          <div className="mt-3 text-base font-bold">Drop CSV here or click to browse</div>
          <div className="mt-1 text-xs text-muted-foreground">Max 5MB · UTF-8 encoded</div>
          <label className="mt-4 inline-block cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
            Choose file
            <input type="file" accept=".csv" className="hidden" />
          </label>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-bold">CSV format</h3>
          <p className="mt-1 text-xs text-muted-foreground">Required columns:</p>
          <ul className="mt-2 space-y-1 text-xs">
            {["id", "subject", "chapter", "type", "question", "opt1..opt4", "correct", "explanation"].map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-md bg-muted/40 px-2 py-1 font-mono">
                <CheckCircle2 className="h-3 w-3 text-[var(--success)]" /> {c}
              </li>
            ))}
          </ul>
          <a className="mt-3 inline-block text-xs font-semibold text-primary">Download sample.csv →</a>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-sm font-bold">Recent jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr><th className="px-5 py-3 text-left">File</th><th className="text-left">Uploaded</th><th className="text-left">Status</th><th className="text-right">Total</th><th className="text-right">Valid</th><th className="text-right">Issues</th><th /></tr>
            </thead>
            <tbody>
              {importJobs.map((j) => (
                <tr key={j.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 font-medium"><FileSpreadsheet className="h-4 w-4 text-muted-foreground" /> {j.fileName}</div>
                  </td>
                  <td>{new Date(j.uploadedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${j.status === "Failed" ? "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-[var(--destructive)]" : "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]"}`}>
                      {j.status === "Failed" ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      {j.status}
                    </span>
                  </td>
                  <td className="text-right tabular-nums">{j.total}</td>
                  <td className="text-right tabular-nums">{j.valid}</td>
                  <td className="text-right tabular-nums text-[var(--destructive)]">{j.invalid + j.duplicates}</td>
                  <td className="px-5 py-3 text-right">
                    <Link to="/admin/import/review/$jobId" params={{ jobId: j.id }} className="text-xs font-semibold text-primary">Review →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
