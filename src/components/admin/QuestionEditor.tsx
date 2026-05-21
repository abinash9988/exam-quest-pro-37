import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Save, Send, CheckCircle2, X, Plus, AlertTriangle, Loader2 } from "lucide-react";
import {
  type AdminQuestion,
  type QuestionType,
  type Difficulty,
  type QuestionStatus,
  exams,
  subjects,
  chaptersBySubject,
  topicsByChapter,
  adminQuestions,
} from "@/lib/adminMock";
import { RichTextEditor } from "./RichTextEditor";
import { OptionEditor } from "./OptionEditor";
import { QuestionPreviewCard } from "./QuestionPreviewCard";
import { DevicePreviewFrame } from "./DevicePreviewFrame";

const types: QuestionType[] = ["MCQ_SINGLE", "MCQ_MULTI", "INTEGER", "TRUE_FALSE"];
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

interface Props {
  initial: AdminQuestion;
  mode: "create" | "edit";
}

export function QuestionEditor({ initial, mode }: Props) {
  const [q, setQ] = useState<AdminQuestion>(initial);
  const [tagInput, setTagInput] = useState("");
  const [tab, setTab] = useState<"editor" | "preview">("editor");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save simulation
  useEffect(() => {
    setSaveState("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSaveState("saved"), 800);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [q]);

  const set = <K extends keyof AdminQuestion>(k: K, v: AdminQuestion[K]) => setQ((s) => ({ ...s, [k]: v }));

  // Adjust options when type changes
  useEffect(() => {
    if (q.type === "TRUE_FALSE" && q.options.length !== 2) {
      setQ((s) => ({
        ...s,
        options: [
          { id: "o1", html: "True", isCorrect: false },
          { id: "o2", html: "False", isCorrect: false },
        ],
      }));
    }
    if (q.type === "MCQ_SINGLE") {
      const firstCorrect = q.options.findIndex((o) => o.isCorrect);
      if (q.options.filter((o) => o.isCorrect).length > 1) {
        setQ((s) => ({
          ...s,
          options: s.options.map((o, i) => ({ ...o, isCorrect: i === firstCorrect })),
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.type]);

  const chapters = chaptersBySubject[q.subject] ?? [];
  const topics = topicsByChapter[q.chapter] ?? ["General"];

  const duplicate = useMemo(() => {
    const stripped = q.question.replace(/<[^>]+>/g, "").trim().toLowerCase();
    if (stripped.length < 10) return null;
    return adminQuestions.find((x) => x.id !== q.id && x.question.replace(/<[^>]+>/g, "").trim().toLowerCase() === stripped);
  }, [q.question, q.id]);

  const validate = (): string[] => {
    const e: string[] = [];
    if (!q.question.replace(/<[^>]+>/g, "").trim()) e.push("Question text is required");
    if (q.type === "INTEGER") {
      if (q.correctInteger === undefined || Number.isNaN(q.correctInteger)) e.push("Integer answer is required");
    } else if (!q.options.some((o) => o.isCorrect)) {
      e.push("Mark at least one correct option");
    } else if (q.options.some((o) => !o.html.replace(/<[^>]+>/g, "").trim())) {
      e.push("All options must have text");
    }
    return e;
  };

  const submit = (status: QuestionStatus) => {
    const e = validate();
    setErrors(e);
    if (e.length) return;
    set("status", status);
    setSaveState("saved");
    setTimeout(() => navigate({ to: "/admin/questions" }), 400);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !q.tags.includes(t)) set("tags", [...q.tags, t]);
    setTagInput("");
  };

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{mode === "create" ? "Create Question" : `Edit ${q.id}`}</h1>
          <p className="text-xs text-muted-foreground">Author rich content and preview the student experience live.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saveState === "saving" && <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>}
          {saveState === "saved" && <><CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" /> Saved</>}
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="mb-4 flex gap-1 rounded-xl border border-border bg-background p-1 text-sm lg:hidden">
        <button onClick={() => setTab("editor")} className={`flex-1 rounded-lg py-1.5 font-semibold ${tab === "editor" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Editor</button>
        <button onClick={() => setTab("preview")} className={`flex-1 rounded-lg py-1.5 font-semibold ${tab === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Preview</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Editor */}
        <div className={`space-y-4 ${tab === "preview" ? "hidden lg:block" : ""}`}>
          {duplicate && (
            <div className="flex items-start gap-2 rounded-xl border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)] p-3 text-xs">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-[var(--warning)]" />
              <div>
                <div className="font-semibold">Possible duplicate</div>
                <div className="text-muted-foreground">Matches existing question <span className="font-mono">{duplicate.id}</span>.</div>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="rounded-xl border border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] p-3 text-xs">
              <div className="mb-1 font-semibold text-[var(--destructive)]">Please fix:</div>
              <ul className="ml-4 list-disc text-[var(--destructive)]">
                {errors.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          )}

          {/* Meta */}
          <Section title="Metadata">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Exam">
                <Select value={q.examId} onChange={(v) => set("examId", v)} options={exams} />
              </Field>
              <Field label="Subject">
                <Select value={q.subject} onChange={(v) => { set("subject", v); set("chapter", chaptersBySubject[v][0]); }} options={subjects} />
              </Field>
              <Field label="Chapter">
                <Select value={q.chapter} onChange={(v) => { set("chapter", v); set("topic", (topicsByChapter[v] ?? ["General"])[0]); }} options={chapters} />
              </Field>
              <Field label="Topic">
                <Select value={q.topic} onChange={(v) => set("topic", v)} options={topics} />
              </Field>
              <Field label="Difficulty">
                <Select value={q.difficulty} onChange={(v) => set("difficulty", v as Difficulty)} options={difficulties} />
              </Field>
              <Field label="Type">
                <Select value={q.type} onChange={(v) => set("type", v as QuestionType)} options={types} />
              </Field>
              <Field label="Marks">
                <NumInput value={q.marks} onChange={(v) => set("marks", v)} />
              </Field>
              <Field label="Negative">
                <NumInput value={q.negativeMarks} onChange={(v) => set("negativeMarks", v)} />
              </Field>
              <Field label="Tags">
                <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5">
                  {q.tags.map((t) => (
                    <span key={t} className="flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {t}
                      <button onClick={() => set("tags", q.tags.filter((x) => x !== t))}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag…"
                    className="flex-1 min-w-[80px] bg-transparent text-xs outline-none"
                  />
                  <button onClick={addTag} className="text-muted-foreground"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Question">
            <RichTextEditor value={q.question} onChange={(v) => set("question", v)} placeholder="Type your question, paste images, insert formulas…" minHeight={160} />
          </Section>

          <Section title={q.type === "INTEGER" ? "Correct answer" : "Options"}>
            {q.type === "INTEGER" ? (
              <input
                type="number"
                value={q.correctInteger ?? ""}
                onChange={(e) => set("correctInteger", Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="e.g. 12"
              />
            ) : (
              <OptionEditor options={q.options} type={q.type} onChange={(opts) => set("options", opts)} />
            )}
          </Section>

          <Section title="Explanation">
            <RichTextEditor value={q.explanation} onChange={(v) => set("explanation", v)} placeholder="Step-by-step solution…" minHeight={120} />
          </Section>
        </div>

        {/* Preview */}
        <div className={`lg:sticky lg:top-20 lg:self-start ${tab === "editor" ? "hidden lg:block" : ""}`}>
          <DevicePreviewFrame>
            <QuestionPreviewCard q={q} />
          </DevicePreviewFrame>
        </div>
      </div>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur-md md:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <Link to="/admin/questions" className="text-xs font-semibold text-muted-foreground hover:text-foreground">Cancel</Link>
          <div className="flex items-center gap-2">
            <button onClick={() => submit("Draft")} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">
              <Save className="h-3.5 w-3.5" /> Save Draft
            </button>
            <button onClick={() => submit("Review")} className="flex items-center gap-1.5 rounded-xl bg-[var(--review)] px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
              <Send className="h-3.5 w-3.5" /> Submit Review
            </button>
            <button onClick={() => submit("Published")} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
              <CheckCircle2 className="h-3.5 w-3.5" /> Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-primary"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function NumInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-primary"
    />
  );
}
