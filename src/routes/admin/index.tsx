import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, FilePlus, CheckCircle2, Upload, ArrowUpRight } from "lucide-react";
import { adminQuestions, importJobs, recentActivity } from "@/lib/adminMock";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard · MockArena" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const total = adminQuestions.length;
  const drafts = adminQuestions.filter((q) => q.status === "Draft").length;
  const published = adminQuestions.filter((q) => q.status === "Published").length;
  const stats = [
    { label: "Total Questions", value: total.toLocaleString(), icon: FileText, delta: "+12 this week" },
    { label: "Draft Questions", value: drafts.toLocaleString(), icon: FilePlus, delta: "Needs review" },
    { label: "Published", value: published.toLocaleString(), icon: CheckCircle2, delta: "Live now" },
    { label: "Import Jobs", value: importJobs.length.toLocaleString(), icon: Upload, delta: "Last 30 days" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Question bank health and recent activity.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/questions/create" className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">New Question</Link>
          <Link to="/admin/import" className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold">Import CSV</Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between text-muted-foreground">
              <s.icon className="h-4 w-4" />
              <span className="text-[10px] font-semibold uppercase">{s.label}</span>
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold">Recent uploads</h3>
            <Link to="/admin/import" className="flex items-center gap-1 text-xs font-semibold text-primary">All jobs <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="py-2 text-left">File</th><th className="text-left">Status</th><th className="text-right">Valid</th><th className="text-right">Errors</th><th /></tr>
              </thead>
              <tbody>
                {importJobs.map((j) => (
                  <tr key={j.id} className="border-t border-border">
                    <td className="py-2.5 font-medium">{j.fileName}</td>
                    <td><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${j.status === "Failed" ? "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-[var(--destructive)]" : "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]"}`}>{j.status}</span></td>
                    <td className="text-right tabular-nums">{j.valid}</td>
                    <td className="text-right tabular-nums text-[var(--destructive)]">{j.invalid}</td>
                    <td className="py-2.5 text-right">
                      <Link to="/admin/import/review/$jobId" params={{ jobId: j.id }} className="text-xs font-semibold text-primary">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-sm font-bold">Recent activity</h3>
          <ul className="space-y-2">
            {recentActivity.map((a) => (
              <li key={a.id} className="rounded-xl bg-muted/40 p-3 text-sm">
                <div className="font-medium">{a.text}</div>
                <div className="text-[11px] text-muted-foreground">{a.user} · {a.at}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
