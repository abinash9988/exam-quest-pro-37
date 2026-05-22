import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, Copy } from "lucide-react";
import { getImportJob, type ImportJob } from "@/lib/adminMock";
import { ReviewGrid } from "@/components/admin/ReviewGrid";
import { JobStatusBadge } from "@/components/admin/JobStatusBadge";

export const Route = createFileRoute("/admin/import/review/$jobId")({
  head: ({ params }) => ({ meta: [{ title: `Review ${params.jobId} · Admin` }] }),
  loader: ({ params }): ImportJob => {
    const j = getImportJob(params.jobId);
    if (!j) throw notFound();
    return j;
  },
  component: ReviewJob,
  notFoundComponent: () => {
    const { jobId } = Route.useParams();
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-bold">Job {jobId} not found</h2>
        <Link to="/admin/import" className="mt-4 inline-block rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Back to imports</Link>
      </div>
    );
  },
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-bold">Couldn't load job</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { reset(); router.invalidate(); }}
          className="mt-4 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >Retry</button>
      </div>
    );
  },
});

function ReviewJob() {
  const job = Route.useLoaderData();
  const stats = [
    { label: "Total", value: job.total, icon: Copy, tone: "" },
    { label: "Valid", value: job.valid, icon: CheckCircle2, tone: "text-[var(--success)]" },
    { label: "Warnings", value: job.warnings, icon: AlertTriangle, tone: "text-[var(--warning)]" },
    { label: "Invalid", value: job.invalid, icon: AlertTriangle, tone: "text-[var(--destructive)]" },
    { label: "Duplicates", value: job.duplicates, icon: Copy, tone: "text-[var(--review)]" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/admin/import" className="text-xs text-muted-foreground hover:text-foreground">← Imports</Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{job.fileName}</h1>
            <JobStatusBadge status={job.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            Job <span className="font-mono">{job.id}</span> · uploaded by {job.uploadedBy} · {new Date(job.uploadedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{s.label}</span>
              <s.icon className={`h-3.5 w-3.5 ${s.tone}`} />
            </div>
            <div className={`mt-1 text-xl font-bold tabular-nums sm:text-2xl ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <ReviewGrid job={job} />
    </div>
  );
}
