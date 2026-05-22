import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileSpreadsheet, Search, Trash2, Download } from "lucide-react";
import { importJobs, type ImportJobStatus } from "@/lib/adminMock";
import { JobStatusBadge } from "@/components/admin/JobStatusBadge";

export const Route = createFileRoute("/admin/import/history")({
  head: () => ({ meta: [{ title: "Import history · Admin" }] }),
  component: HistoryPage,
});

const STATUSES: (ImportJobStatus | "all")[] = ["all", "Uploaded", "Parsing", "Review", "Approved", "Published", "Failed"];

function HistoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ImportJobStatus | "all">("all");

  const rows = useMemo(() => importJobs.filter((j) => {
    if (status !== "all" && j.status !== status) return false;
    if (search && !j.fileName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, status]);

  const totals = useMemo(() => {
    const imported = importJobs.reduce((a, j) => a + j.valid, 0);
    const failed = importJobs.reduce((a, j) => a + j.invalid, 0);
    return {
      jobs: importJobs.length,
      imported,
      failed,
      last: importJobs[0] ? new Date(importJobs[0].uploadedAt).toLocaleDateString() : "—",
    };
  }, []);

  const stats = [
    { label: "Total jobs", value: totals.jobs },
    { label: "Rows imported", value: totals.imported, tone: "text-[var(--success)]" },
    { label: "Rows failed", value: totals.failed, tone: "text-[var(--destructive)]" },
    { label: "Last upload", value: totals.last },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/admin/import" className="text-xs text-muted-foreground hover:text-foreground">← Imports</Link>
          <h1 className="text-xl font-bold tracking-tight">Import history</h1>
          <p className="text-xs text-muted-foreground">All past CSV / Excel uploads.</p>
        </div>
        <Link to="/admin/import" className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
          New import
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="text-[10px] font-bold uppercase text-muted-foreground">{s.label}</div>
            <div className={`mt-1 text-xl font-bold tabular-nums sm:text-2xl ${s.tone ?? ""}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-[var(--shadow-card)]">
        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search file name…"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ImportJobStatus | "all")}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-medium"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All status" : s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[10px] uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">File</th>
              <th className="px-2 py-3 text-left">Uploaded by</th>
              <th className="px-2 py-3 text-left">Uploaded</th>
              <th className="px-2 py-3 text-right">Total</th>
              <th className="px-2 py-3 text-right">Valid</th>
              <th className="px-2 py-3 text-right">Failed</th>
              <th className="px-2 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No jobs match the filters.</td></tr>
            )}
            {rows.map((j) => (
              <tr key={j.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" /> {j.fileName}
                  </div>
                  <div className="ml-6 font-mono text-[10px] text-muted-foreground">{j.id}</div>
                </td>
                <td className="px-2 py-3 text-xs">{j.uploadedBy}</td>
                <td className="px-2 py-3 text-xs text-muted-foreground">{new Date(j.uploadedAt).toLocaleString()}</td>
                <td className="px-2 py-3 text-right tabular-nums">{j.total}</td>
                <td className="px-2 py-3 text-right tabular-nums text-[var(--success)]">{j.valid}</td>
                <td className="px-2 py-3 text-right tabular-nums text-[var(--destructive)]">{j.invalid}</td>
                <td className="px-2 py-3"><JobStatusBadge status={j.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to="/admin/import/review/$jobId" params={{ jobId: j.id }} className="rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-muted">Review</Link>
                    <button title="Download original" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><Download className="h-3.5 w-3.5" /></button>
                    <button title="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-[var(--destructive)]"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
