import { Mail, Phone, Calendar } from "lucide-react";
import { student, getCategoryById, formatDate } from "@/lib/studentMock";

export function ProfileCard() {
  const cat = getCategoryById(student.preferredCategoryId);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="absolute inset-x-0 top-0 h-24 bg-[var(--gradient-hero)]" />
      <div className="relative flex flex-col items-center gap-3 pt-6 text-center sm:flex-row sm:items-end sm:gap-5 sm:text-left">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 border-card bg-[var(--gradient-hero)] text-2xl font-bold text-primary-foreground shadow-[var(--shadow-elevated)]">
          {student.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">{student.name}</h2>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:justify-start">
            <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{student.email}</span>
            <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{student.mobile}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {formatDate(student.joinedAt)}</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary">
            <span>{cat.icon}</span> Preferred: {cat.name}
          </div>
        </div>
      </div>
    </div>
  );
}
