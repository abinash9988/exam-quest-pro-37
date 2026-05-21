import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Copy } from "lucide-react";
import { getImportJob, type ImportJob } from "@/lib/adminMock";

export const Route = createFileRoute("/admin/import/review/$jobId")({
  head: ({ params }) => ({ meta: [{ title: `Review ${params.jobId} · Admin` }] }),
  loader: ({ params }): ImportJob => {
    const j = getImportJob(params.jobId);
    if (!j) throw notFound();
    return j;
  },
  component: ReviewJob,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="text-lg font-bold">Job not found</h2>
      <Link to="/admin/import" className="mt-4 inline-block rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Back to imports</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="text-lg font-bold">Couldn't load job</h2>
      <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Retry</button>
    </div>
  ),
});

function ReviewJob() {
  const job = Route.useLoaderData() as ImportJob;
  const [tab, setTab] = useState<"all" | "errors" | "duplicates">("all");
  const rows = job.rows.filter((r) =>
    tab === "all" ? true : tab === "errors" ? r.status === "invalid" : r.status === "duplicate"
  );

  const stats = [
    { label: "Total", value: job.total, icon: Copy, tone: "" },
    { label: "Valid", value: job.valid, icon: CheckCircle2, tone: "text-[var(--success)]" },
    { label: "Invalid", value: job.invalid, icon: AlertTriangle, tone: "text-[var(--destructive)]" },
    { label: "Duplicates", value: job.duplicates, icon: Copy, tone: "text-[var(--warning)]" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/admin/import" className="text-xs text-muted-foreground hover:text-foreground">← Imports</Link>
          <h1 className="text-xl font-bold tracking-tight">{job.fileName}</h1>
          <p className="text-xs text-muted-foreground">Job <span className="font-mono">{job.id}</span> · {new Date(job.uploadedAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold">Discard invalid</button>
          <button className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">Approve {job.valid} valid</button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </div>
            <div className={`mt-1 text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex gap-1 border-b border-border p-2">
          {([
            ["all", "All"],
            ["errors", `Errors (${job.invalid})`],
            ["duplicates", `Duplicates (${job.duplicates})`],
          ] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{lbl}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3 text-left">Row</th><th className="text-left">Subject</th><th className="text-left">Question</th><th className="text-left">Status</th><th /></tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No rows here.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.rowNo} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs">{r.rowNo}</td>
                  <td>{r.subject}</td>
                  <td className="max-w-md truncate text-muted-foreground">{r.question}</td>
                  <td>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.status === "valid" ? "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]"
                      : r.status === "invalid" ? "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-[var(--destructive)]"
                      : "bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-[var(--warning)]"
                    }`}>{r.status}</span>
                    {r.error && <div className="mt-1 text-[10px] text-[var(--destructive)]">{r.error}</div>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-semibold text-primary">Fix</button>
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
