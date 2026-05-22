import type { ImportJobStatus } from "@/lib/adminMock";

const tone: Record<ImportJobStatus, string> = {
  Uploaded: "bg-muted text-muted-foreground",
  Parsing: "bg-[color-mix(in_oklab,var(--review)_18%,transparent)] text-[var(--review)]",
  Review: "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[var(--warning)]",
  Approved: "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)]",
  Published: "bg-primary-soft text-primary",
  Failed: "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[var(--destructive)]",
  Processed: "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)]",
  Processing: "bg-[color-mix(in_oklab,var(--review)_18%,transparent)] text-[var(--review)]",
};

export function JobStatusBadge({ status }: { status: ImportJobStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone[status]}`}>
      {status}
    </span>
  );
}
