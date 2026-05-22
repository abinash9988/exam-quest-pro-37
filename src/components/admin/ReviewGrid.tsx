import { useMemo, useReducer, useState } from "react";
import { Check, X, Eye, Trash2, AlertTriangle, CheckCircle2, Search, Filter, ChevronDown } from "lucide-react";
import type { ImportJob, ImportRow, Difficulty } from "@/lib/adminMock";
import { subjects, updateImportRow, bulkUpdateRows, deleteRows } from "@/lib/adminMock";
import { PreviewModal } from "./PreviewModal";

type State = {
  rows: ImportRow[];
  selected: Set<number>;
  search: string;
  statusFilter: "all" | "valid" | "warning" | "invalid" | "duplicate";
  subjectFilter: string;
  page: number;
  pageSize: number;
};

type Action =
  | { type: "patch"; rowNo: number; patch: Partial<ImportRow> }
  | { type: "bulkPatch"; patch: Partial<ImportRow> }
  | { type: "delete" }
  | { type: "toggleSelect"; rowNo: number }
  | { type: "toggleAll"; rowNos: number[] }
  | { type: "clearSelect" }
  | { type: "set"; key: keyof State; value: unknown };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "patch": {
      const rows = state.rows.map((r) => (r.rowNo === action.rowNo ? { ...r, ...action.patch } : r));
      return { ...state, rows };
    }
    case "bulkPatch": {
      const rows = state.rows.map((r) => (state.selected.has(r.rowNo) ? { ...r, ...action.patch } : r));
      return { ...state, rows };
    }
    case "delete": {
      const rows = state.rows.filter((r) => !state.selected.has(r.rowNo));
      return { ...state, rows, selected: new Set() };
    }
    case "toggleSelect": {
      const s = new Set(state.selected);
      s.has(action.rowNo) ? s.delete(action.rowNo) : s.add(action.rowNo);
      return { ...state, selected: s };
    }
    case "toggleAll": {
      const allSelected = action.rowNos.every((n) => state.selected.has(n));
      const s = new Set(state.selected);
      action.rowNos.forEach((n) => (allSelected ? s.delete(n) : s.add(n)));
      return { ...state, selected: s };
    }
    case "clearSelect":
      return { ...state, selected: new Set() };
    case "set":
      return { ...state, [action.key]: action.value } as State;
  }
}

const statusPill = (s: ImportRow["status"]) => {
  if (s === "valid") return "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)]";
  if (s === "warning") return "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[var(--warning)]";
  if (s === "duplicate") return "bg-[color-mix(in_oklab,var(--review)_18%,transparent)] text-[var(--review)]";
  return "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[var(--destructive)]";
};

const workflowPill = (w: ImportRow["workflow"]) => {
  if (w === "approved") return "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)]";
  if (w === "rejected") return "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[var(--destructive)]";
  if (w === "published") return "bg-primary-soft text-primary";
  return "bg-muted text-muted-foreground";
};

export function ReviewGrid({ job }: { job: ImportJob }) {
  const [state, dispatch] = useReducer(reducer, {
    rows: job.rows,
    selected: new Set<number>(),
    search: "",
    statusFilter: "all",
    subjectFilter: "all",
    page: 1,
    pageSize: 25,
  });
  const [previewRow, setPreviewRow] = useState<ImportRow | null>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    question: 320, subject: 130, chapter: 140, difficulty: 110, type: 130, status: 130, errors: 200,
  });
  const [bulkMenu, setBulkMenu] = useState(false);

  const filtered = useMemo(() => {
    return state.rows.filter((r) => {
      if (state.search && !r.question.toLowerCase().includes(state.search.toLowerCase())) return false;
      if (state.statusFilter !== "all" && r.status !== state.statusFilter) return false;
      if (state.subjectFilter !== "all" && r.subject !== state.subjectFilter) return false;
      return true;
    });
  }, [state.rows, state.search, state.statusFilter, state.subjectFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  const page = Math.min(state.page, totalPages);
  const pageRows = filtered.slice((page - 1) * state.pageSize, page * state.pageSize);
  const allSelectedOnPage = pageRows.length > 0 && pageRows.every((r) => state.selected.has(r.rowNo));
  const selectedCount = state.selected.size;

  const patch = (rowNo: number, p: Partial<ImportRow>) => {
    dispatch({ type: "patch", rowNo, patch: p });
    updateImportRow(job.id, rowNo, p);
  };
  const bulk = (p: Partial<ImportRow>) => {
    dispatch({ type: "bulkPatch", patch: p });
    bulkUpdateRows(job.id, Array.from(state.selected), p);
    setBulkMenu(false);
  };
  const removeSelected = () => {
    deleteRows(job.id, Array.from(state.selected));
    dispatch({ type: "delete" });
    setBulkMenu(false);
  };

  const startResize = (key: string, startX: number, startW: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      const w = Math.max(80, startW + (ev.clientX - startX));
      setColWidths((c) => ({ ...c, [key]: w }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const Th = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <th
      className="relative whitespace-nowrap px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
      style={{ width: colWidths[k] }}
    >
      {children}
      <span
        onPointerDown={(e) => startResize(k, e.clientX, colWidths[k])(e)}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/40"
      />
    </th>
  );

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="sticky top-14 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/95 p-2.5 shadow-[var(--shadow-card)] backdrop-blur">
        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={state.search}
            onChange={(e) => dispatch({ type: "set", key: "search", value: e.target.value })}
            placeholder="Search question text…"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <select
          value={state.statusFilter}
          onChange={(e) => dispatch({ type: "set", key: "statusFilter", value: e.target.value })}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-medium"
        >
          <option value="all">All status</option>
          <option value="valid">Valid</option>
          <option value="warning">Warning</option>
          <option value="invalid">Invalid</option>
          <option value="duplicate">Duplicate</option>
        </select>
        <select
          value={state.subjectFilter}
          onChange={(e) => dispatch({ type: "set", key: "subjectFilter", value: e.target.value })}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-medium"
        >
          <option value="all">All subjects</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-[11px] text-muted-foreground"><Filter className="mr-1 inline h-3 w-3" />{filtered.length} rows</span>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {selectedCount > 0 && (
            <>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">{selectedCount} selected</span>
              <div className="relative">
                <button onClick={() => setBulkMenu((v) => !v)} className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold">
                  Bulk <ChevronDown className="h-3 w-3" />
                </button>
                {bulkMenu && (
                  <div className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-border bg-card text-xs shadow-[var(--shadow-elevated)]">
                    <button onClick={() => bulk({ workflow: "approved" })} className="block w-full px-3 py-2 text-left hover:bg-muted">Approve selected</button>
                    <button onClick={() => bulk({ workflow: "published" })} className="block w-full px-3 py-2 text-left hover:bg-muted">Publish selected</button>
                    <button onClick={() => bulk({ workflow: "rejected" })} className="block w-full px-3 py-2 text-left hover:bg-muted">Reject selected</button>
                    <div className="border-t border-border" />
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-muted-foreground">Change difficulty</div>
                    {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
                      <button key={d} onClick={() => bulk({ difficulty: d })} className="block w-full px-3 py-1.5 text-left hover:bg-muted">→ {d}</button>
                    ))}
                    <div className="border-t border-border" />
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-muted-foreground">Change subject</div>
                    {subjects.slice(0, 4).map((s) => (
                      <button key={s} onClick={() => bulk({ subject: s })} className="block w-full px-3 py-1.5 text-left hover:bg-muted">→ {s}</button>
                    ))}
                    <div className="border-t border-border" />
                    <button onClick={removeSelected} className="block w-full px-3 py-2 text-left text-[var(--destructive)] hover:bg-muted">Delete selected</button>
                  </div>
                )}
              </div>
            </>
          )}
          <button
            onClick={() => bulkUpdateRows(job.id, filtered.filter((r) => r.status !== "invalid").map((r) => r.rowNo), { workflow: "published" })}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
          >
            Publish all valid
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <tr>
              <th className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={() => dispatch({ type: "toggleAll", rowNos: pageRows.map((r) => r.rowNo) })}
                />
              </th>
              <th className="w-12 px-2 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
              <Th k="question">Question</Th>
              <Th k="subject">Subject</Th>
              <Th k="chapter">Chapter</Th>
              <Th k="difficulty">Difficulty</Th>
              <Th k="type">Type</Th>
              <Th k="status">Status</Th>
              <Th k="errors">Errors / Warnings</Th>
              <th className="w-40 px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">No rows match the filters.</td></tr>
            )}
            {pageRows.map((r) => {
              const isSelected = state.selected.has(r.rowNo);
              return (
                <tr key={r.rowNo} className={`border-t border-border ${isSelected ? "bg-primary-soft/40" : ""}`}>
                  <td className="border-t border-border px-3 py-2">
                    <input type="checkbox" checked={isSelected} onChange={() => dispatch({ type: "toggleSelect", rowNo: r.rowNo })} />
                  </td>
                  <td className="border-t border-border px-2 py-2 font-mono text-[11px] text-muted-foreground">{r.rowNo}</td>
                  <td className="border-t border-border px-3 py-2">
                    <input
                      value={r.question}
                      onChange={(e) => patch(r.rowNo, { question: e.target.value })}
                      className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-sm hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                    />
                  </td>
                  <td className="border-t border-border px-3 py-2">
                    <select
                      value={r.subject}
                      onChange={(e) => patch(r.rowNo, { subject: e.target.value })}
                      className="w-full rounded-md bg-transparent px-1 py-1 text-xs hover:bg-muted focus:bg-background focus:outline-none"
                    >
                      {subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="border-t border-border px-3 py-2">
                    <input
                      value={r.chapter}
                      onChange={(e) => patch(r.rowNo, { chapter: e.target.value })}
                      className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-xs hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                    />
                  </td>
                  <td className="border-t border-border px-3 py-2">
                    <select
                      value={r.difficulty}
                      onChange={(e) => patch(r.rowNo, { difficulty: e.target.value as Difficulty })}
                      className="w-full rounded-md bg-transparent px-1 py-1 text-xs hover:bg-muted focus:bg-background focus:outline-none"
                    >
                      {(["Easy", "Medium", "Hard"] as const).map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="border-t border-border px-3 py-2">
                    <select
                      value={r.type}
                      onChange={(e) => patch(r.rowNo, { type: e.target.value as ImportRow["type"] })}
                      className="w-full rounded-md bg-transparent px-1 py-1 text-xs hover:bg-muted focus:bg-background focus:outline-none"
                    >
                      <option value="MCQ_SINGLE">MCQ Single</option>
                      <option value="MCQ_MULTI">MCQ Multi</option>
                      <option value="INTEGER">Integer</option>
                      <option value="TRUE_FALSE">True/False</option>
                    </select>
                  </td>
                  <td className="border-t border-border px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusPill(r.status)}`}>
                        {r.status === "valid" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {r.status}
                      </span>
                      <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${workflowPill(r.workflow)}`}>
                        {r.workflow}
                      </span>
                    </div>
                  </td>
                  <td className="border-t border-border px-3 py-2">
                    {r.errors.length === 0 && r.warnings.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    ) : (
                      <ul className="space-y-0.5">
                        {r.errors.map((e, i) => <li key={`e${i}`} className="text-[11px] text-[var(--destructive)]">• {e}</li>)}
                        {r.warnings.map((w, i) => <li key={`w${i}`} className="text-[11px] text-[var(--warning)]">• {w}</li>)}
                      </ul>
                    )}
                  </td>
                  <td className="border-t border-border px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreviewRow(r)} title="Preview" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
                      <button onClick={() => patch(r.rowNo, { workflow: "approved" })} title="Approve" className="rounded-md p-1.5 text-[var(--success)] hover:bg-muted"><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={() => patch(r.rowNo, { workflow: "rejected" })} title="Reject" className="rounded-md p-1.5 text-[var(--destructive)] hover:bg-muted"><X className="h-3.5 w-3.5" /></button>
                      <button onClick={() => { deleteRows(job.id, [r.rowNo]); dispatch({ type: "patch", rowNo: r.rowNo, patch: {} }); dispatch({ type: "set", key: "rows", value: state.rows.filter((x) => x.rowNo !== r.rowNo) }); }} title="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-[var(--destructive)]"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <select
            value={state.pageSize}
            onChange={(e) => dispatch({ type: "set", key: "pageSize", value: Number(e.target.value) })}
            className="rounded-md border border-border bg-background px-1.5 py-1 text-xs"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Page {page} of {totalPages}</span>
          <button disabled={page <= 1} onClick={() => dispatch({ type: "set", key: "page", value: page - 1 })} className="rounded-md border border-border px-2 py-1 disabled:opacity-40">Prev</button>
          <button disabled={page >= totalPages} onClick={() => dispatch({ type: "set", key: "page", value: page + 1 })} className="rounded-md border border-border px-2 py-1 disabled:opacity-40">Next</button>
        </div>
      </div>

      <PreviewModal row={previewRow} onClose={() => setPreviewRow(null)} />
    </div>
  );
}
