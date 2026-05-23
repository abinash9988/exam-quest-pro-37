import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Pencil, Send, Archive, Trash2, Plus, ChevronLeft, ChevronRight, X, MoreVertical } from "lucide-react";
import {
  adminQuestions,
  subjects,
  tagCatalog,
  tagColor,
  transitionStatus,
  allowedTransitions,
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
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [diff, setDiff] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [createdFrom, setCreatedFrom] = useState("");
  const [updatedFrom, setUpdatedFrom] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [, force] = useState(0);

  const filtered = useMemo(() => {
    let r = adminQuestions.filter((q) => {
      if (subject && q.subject !== subject) return false;
      if (chapter && !q.chapter.toLowerCase().includes(chapter.toLowerCase())) return false;
      if (topic && !q.topic.toLowerCase().includes(topic.toLowerCase())) return false;
      if (diff && q.difficulty !== diff) return false;
      if (type && q.type !== type) return false;
      if (status && q.status !== status) return false;
      if (tagsFilter.length && !tagsFilter.every((t) => q.tags.includes(t))) return false;
      if (createdFrom && new Date(q.createdAt) < new Date(createdFrom)) return false;
      if (updatedFrom && new Date(q.updatedAt) < new Date(updatedFrom)) return false;
      if (search && !(q.question.toLowerCase().includes(search.toLowerCase()) || q.tags.some((t) => t.includes(search.toLowerCase())))) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      if (sort === "oldest") return +new Date(a.updatedAt) - +new Date(b.updatedAt);
      if (sort === "difficulty") return allDiff.indexOf(a.difficulty) - allDiff.indexOf(b.difficulty);
      return +new Date(b.updatedAt) - +new Date(a.updatedAt);
    });
    return r;
  }, [search, subject, chapter, topic, diff, type, status, tagsFilter, createdFrom, updatedFrom, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleAll = () => setSelected(selected.length === paged.length ? [] : paged.map((q) => q.id));
  const toggleOne = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const activeChips: { label: string; clear: () => void }[] = [];
  if (subject) activeChips.push({ label: `Subject: ${subject}`, clear: () => setSubject("") });
  if (chapter) activeChips.push({ label: `Chapter: ${chapter}`, clear: () => setChapter("") });
  if (topic) activeChips.push({ label: `Topic: ${topic}`, clear: () => setTopic("") });
  if (diff) activeChips.push({ label: `Difficulty: ${diff}`, clear: () => setDiff("") });
  if (type) activeChips.push({ label: `Type: ${type}`, clear: () => setType("") });
  if (status) activeChips.push({ label: `Status: ${status}`, clear: () => setStatus("") });
  if (createdFrom) activeChips.push({ label: `Created ≥ ${createdFrom}`, clear: () => setCreatedFrom("") });
  if (updatedFrom) activeChips.push({ label: `Updated ≥ ${updatedFrom}`, clear: () => setUpdatedFrom("") });
  tagsFilter.forEach((t) => activeChips.push({ label: `#${t}`, clear: () => setTagsFilter((s) => s.filter((x) => x !== t)) }));

  const clearAll = () => {
    setSubject(""); setChapter(""); setTopic(""); setDiff(""); setType(""); setStatus("");
    setTagsFilter([]); setCreatedFrom(""); setUpdatedFrom("");
  };

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

      <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by text or tag…" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-2 text-xs font-semibold">
            <Filter className="h-3.5 w-3.5" /> Filters{activeChips.length ? ` · ${activeChips.length}` : ""}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-border bg-background px-2.5 py-2 text-xs">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="difficulty">By difficulty</option>
          </select>
        </div>

        {showFilters && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Subject" value={subject} onChange={setSubject} options={subjects} />
            <FilterInput label="Chapter" value={chapter} onChange={setChapter} placeholder="Any chapter" />
            <FilterInput label="Topic" value={topic} onChange={setTopic} placeholder="Any topic" />
            <FilterSelect label="Difficulty" value={diff} onChange={setDiff} options={allDiff} />
            <FilterSelect label="Type" value={type} onChange={setType} options={allTypes} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={allStatuses} />
            <FilterDate label="Created from" value={createdFrom} onChange={setCreatedFrom} />
            <FilterDate label="Updated from" value={updatedFrom} onChange={setUpdatedFrom} />
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {tagCatalog.map((t) => {
                  const on = tagsFilter.includes(t.slug);
                  return (
                    <button
                      key={t.slug}
                      onClick={() => setTagsFilter((s) => (on ? s.filter((x) => x !== t.slug) : [...s, t.slug]))}
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold transition ${on ? "border-transparent text-white" : "border-border bg-background text-muted-foreground"}`}
                      style={on ? { backgroundColor: t.color } : undefined}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {activeChips.map((c) => (
              <span key={c.label} className="flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                {c.label}
                <button onClick={c.clear}><X className="h-3 w-3" /></button>
              </span>
            ))}
            <button onClick={clearAll} className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">Clear all</button>
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-primary bg-primary-soft px-4 py-2.5 text-sm shadow-[var(--shadow-soft)]">
          <span className="font-semibold text-primary">{selected.length} selected</span>
          <div className="flex gap-2">
            <BulkBtn icon={Send} label="Publish" onClick={() => { selected.forEach((id) => transitionStatus(id, "Published")); setSelected([]); force((n) => n + 1); }} />
            <BulkBtn icon={Archive} label="Archive" onClick={() => { selected.forEach((id) => transitionStatus(id, "Archived")); setSelected([]); force((n) => n + 1); }} />
            <BulkBtn icon={Trash2} label="Delete" danger onClick={() => setSelected([])} />
          </div>
        </div>
      )}

      <div className="hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Question</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Tags</th>
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
                    <div className="truncate">{q.question.replace(/<[^>]+>/g, " ").slice(0, 80)}</div>
                  </td>
                  <td className="px-4 py-3">{q.subject}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {q.tags.slice(0, 3).map((t) => {
                        const c = tagColor(t);
                        return (
                          <span key={t} className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: `color-mix(in oklab, ${c} 16%, transparent)`, color: c }}>
                            {t}
                          </span>
                        );
                      })}
                      {q.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{q.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">{q.difficulty}</td>
                  <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                  <td className="relative px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to="/admin/questions/edit/$id" params={{ id: q.id }} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button onClick={() => setOpenMenu((m) => m === q.id ? null : q.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {openMenu === q.id && (
                      <div className="absolute right-4 top-12 z-10 w-44 rounded-lg border border-border bg-popover p-1 text-left text-xs shadow-[var(--shadow-elevated)]">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">Transition to</div>
                        {allowedTransitions[q.status].map((s) => (
                          <button key={s} onClick={() => { transitionStatus(q.id, s); setOpenMenu(null); force((n) => n + 1); }}
                            className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-muted">
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <div className="mt-1 line-clamp-2 text-sm">{q.question.replace(/<[^>]+>/g, " ")}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {q.tags.slice(0, 3).map((t) => {
                    const c = tagColor(t);
                    return <span key={t} className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `color-mix(in oklab, ${c} 16%, transparent)`, color: c }}>{t}</span>;
                  })}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{q.subject} · {q.difficulty}</span>
                  <Link to="/admin/questions/edit/$id" params={{ id: q.id }} className="font-semibold text-primary">Edit →</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
    <label className="block">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs">
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function FilterInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs outline-none focus:border-primary" />
    </label>
  );
}
function FilterDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs" />
    </label>
  );
}
function BulkBtn({ icon: Icon, label, danger, onClick }: { icon: typeof Send; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${danger ? "bg-[var(--destructive)] text-white" : "bg-background"}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
