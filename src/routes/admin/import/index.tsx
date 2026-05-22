import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Copy, History, ArrowRight, FileSpreadsheet } from "lucide-react";
import { importJobs, createImportJob, type ImportJob } from "@/lib/adminMock";
import { ImportDropzone } from "@/components/admin/ImportDropzone";
import { JobStatusBadge } from "@/components/admin/JobStatusBadge";

export const Route = createFileRoute("/admin/import/")({
  head: () => ({ meta: [{ title: "Import · Admin" }] }),
  component: ImportPage,
});

function ImportPage() {
  const navigate = useNavigate();
  const [job, setJob] = useState<ImportJob | null>(null);

  const handleFile = (file: File) => {
    const j = createImportJob({ name: file.name, size: file.size });
    setJob(j);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Bulk Import</h1>
          <p className="text-xs text-muted-foreground">Upload → Parse → Review → Approve → Publish</p>
        </div>
        <Link to="/admin/import/history" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted">
          <History className="h-3.5 w-3.5" /> Import history
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <ImportDropzone onFile={handleFile} />

          {job && <ImportSummary job={job} onReview={() => navigate({ to: "/admin/import/review/$jobId", params: { jobId: job.id } })} />}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-bold">Expected columns</h3>
            <ul className="mt-2 space-y-1 text-xs">
              {["question", "subject", "chapter", "difficulty", "type", "optionA..D", "correct", "explanation"].map((c) => (
                <li key={c} className="flex items-center gap-2 rounded-md bg-muted/40 px-2 py-1 font-mono">
                  <CheckCircle2 className="h-3 w-3 text-[var(--success)]" /> {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold">Recent jobs</h3>
              <Link to="/admin/import/history" className="text-[11px] font-semibold text-primary">All →</Link>
            </div>
            <ul className="space-y-2">
              {importJobs.slice(0, 4).map((j) => (
                <li key={j.id}>
                  <Link to="/admin/import/review/$jobId" params={{ jobId: j.id }} className="flex items-center gap-2 rounded-lg p-2 text-xs hover:bg-muted">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{j.fileName}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(j.uploadedAt).toLocaleDateString()} · {j.total} rows</div>
                    </div>
                    <JobStatusBadge status={j.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ImportSummary({ job, onReview }: { job: ImportJob; onReview: () => void }) {
  const stats = [
    { label: "Total", value: job.total, tone: "", icon: Copy },
    { label: "Valid", value: job.valid, tone: "text-[var(--success)]", icon: CheckCircle2 },
    { label: "Warnings", value: job.warnings, tone: "text-[var(--warning)]", icon: AlertTriangle },
    { label: "Invalid", value: job.invalid, tone: "text-[var(--destructive)]", icon: AlertTriangle },
    { label: "Duplicates", value: job.duplicates, tone: "text-[var(--review)]", icon: Copy },
  ];
  return (
    <div className="rounded-2xl border border-border bg-[var(--gradient-card)] p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Import summary</div>
          <h3 className="text-base font-bold">{job.fileName}</h3>
        </div>
        <JobStatusBadge status={job.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{s.label}</span>
              <s.icon className={`h-3.5 w-3.5 ${s.tone}`} />
            </div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <button onClick={onReview} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
        Review now <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
