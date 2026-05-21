import type { QuestionStatus } from "@/lib/adminMock";

const map: Record<QuestionStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Review: "bg-[color-mix(in_oklab,var(--review)_18%,transparent)] text-[var(--review)]",
  Approved: "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)]",
  Published: "bg-primary-soft text-primary",
  Rejected: "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[var(--destructive)]",
  Archived: "bg-muted text-muted-foreground line-through opacity-70",
};

export function StatusBadge({ status }: { status: QuestionStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[status]}`}>
      {status}
    </span>
  );
}
