import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Pencil, Send, Archive, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  adminQuestions,
  subjects,
  type QuestionStatus,
  type Difficulty,
  type QuestionType,
} from "@/lib/adminMock";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/admin/questions/")({
  head: () => ({ meta: [{ title: "Questions · Admin" }] }),
  component: QuestionList,
});

const allStatuses: QuestionStatus[] = ["Draft", "Review", "Approved", "Published", "Rejected", "Archived"];
const allDiff: Difficulty[] = ["Easy", "Medium", "Hard"];
const allTypes: QuestionType[] = ["MCQ_SINGLE", "MCQ_MULTI", "INTEGER", "TRUE_FALSE"];

function QuestionList() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [diff, setDiff] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let r = adminQuestions.filter((q) => {
      if (subject && q.subject !== subject) return false;
      if (diff && q.difficulty !== diff) return false;
      if (type && q.type !== type) return false;
      if (status && q.status !== status) return false;
      if (search && !(q.question.toLowerCase().includes(search.toLowerCase()) || q.tags.some((t) => t.includes(search.toLowerCase())))) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      if (sort === "oldest") return +new Date(a.updatedAt) - +new Date(b.updatedAt);
      if (sort === "difficulty") return allDiff.indexOf(a.difficulty) - allDiff.indexOf(b.difficulty);
      return +new Date(b.updatedAt) - +new Date(a.updatedAt);
    });
    return r;
  }, [search, subject, diff, type, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleAll = () => setSelected(selected.length === paged.length ? [] : paged.map((q) => q.id));
  const toggleOne = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Questions</h1>
          <p className="text-xs text-muted-foreground">{filtered.length.toLocaleString()} questions in the bank.</p>
        </div>
        <Link to="/admin/questions/create" className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
          <Plus className="h-3.5 w-3.5" /> New Question
        </Link>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by text or tag…" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-2 text-xs font-semibold sm:hidden">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-border bg-background px-2.5 py-2 text-xs">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="difficulty">By difficulty</option>
          </select>
        </div>
        <div className={`mt-2 grid gap-2 sm:grid-cols-4 ${showFilters ? "grid" : "hidden sm:grid"}`}>
          <FilterSelect label="Subject" value={subject} onChange={setSubject} options={subjects} />
          <FilterSelect label="Difficulty" value={diff} onChange={setDiff} options={allDiff} />
          <FilterSelect label="Type" value={type} onChange={setType} options={allTypes} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={allStatuses} />
        </div>
      </div>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-primary bg-primary-soft px-4 py-2.5 text-sm shadow-[var(--shadow-soft)]">
          <span className="font-semibold text-primary">{selected.length} selected</span>
          <div className="flex gap-2">
            <BulkBtn icon={Send} label="Publish" />
            <BulkBtn icon={Archive} label="Archive" />
            <BulkBtn icon={Trash2} label="Delete" danger />
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Question</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((q) => (
                <tr key={q.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleOne(q.id)} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{q.id}</td>
                  <td className="max-w-md px-4 py-3">
                    <div className="truncate" dangerouslySetInnerHTML={{ __html: q.question.replace(/<[^>]+>/g, " ").slice(0, 80) }} />
                  </td>
                  <td className="px-4 py-3">{q.subject}</td>
                  <td className="px-4 py-3 font-mono text-[11px]">{q.type}</td>
                  <td className="px-4 py-3">{q.difficulty}</td>
                  <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/admin/questions/edit/$id" params={{ id: q.id }} className="inline-flex items-center gap-1 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {paged.map((q) => (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-2">
              <input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleOne(q.id)} className="mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{q.id}</span>
                  <StatusBadge status={q.status} />
                </div>
                <div className="mt-1 line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: q.question }} />
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{q.subject} · {q.difficulty}</span>
                  <Link to="/admin/questions/edit/$id" params={{ id: q.id }} className="font-semibold text-primary">Edit →</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          Rows per page
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="rounded-md border border-border bg-background px-2 py-1">
            {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Page {page} of {pageCount}</span>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="grid h-7 w-7 place-items-center rounded-md border border-border disabled:opacity-40" disabled={page === 1}><ChevronLeft className="h-3.5 w-3.5" /></button>
          <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="grid h-7 w-7 place-items-center rounded-md border border-border disabled:opacity-40" disabled={page === pageCount}><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-border bg-background px-2.5 py-2 text-xs">
      <option value="">All {label}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function BulkBtn({ icon: Icon, label, danger }: { icon: typeof Send; label: string; danger?: boolean }) {
  return (
    <button className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${danger ? "bg-[var(--destructive)] text-white" : "bg-background"}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
