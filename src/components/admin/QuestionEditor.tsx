import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  type AdminQuestion,
  type QuestionType,
  type Difficulty,
  type QuestionStatus,
  getVersions,
  pushVersion,
  getModeration,
  addModeration,
  getWorkflow,
  transitionStatus,
  getAnalytics,
} from "@/lib/adminMock";
import { History, AlertTriangle, MessageSquare, BarChart3, Eye, Activity } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { OptionEditor } from "./OptionEditor";
import { QuestionPreviewCard } from "./QuestionPreviewCard";
import { DevicePreviewFrame } from "./DevicePreviewFrame";
import { TagInput } from "./TagInput";
import { WorkflowBar } from "./WorkflowBar";
import { WorkflowTimeline } from "./WorkflowTimeline";
import { VersionHistoryPanel } from "./VersionHistoryPanel";
import { DuplicateWarningPanel } from "./DuplicateWarningPanel";
import { ModerationPanel } from "./ModerationPanel";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { ExamChromeMock } from "./ExamChromeMock";
import { useAutosave } from "@/hooks/useAutosave";

const types: QuestionType[] = ["MCQ_SINGLE", "MCQ_MULTI", "INTEGER", "TRUE_FALSE"];
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

type Tab = "preview" | "versions" | "duplicates" | "moderation" | "analytics" | "workflow";

interface Props {
  initial: AdminQuestion;
  mode: "create" | "edit";
}

export function QuestionEditor({ initial, mode }: Props) {
  const [q, setQ] = useState<AdminQuestion>(initial);
  const [tab, setTab] = useState<Tab>("preview");
  const [errors, setErrors] = useState<string[]>([]);
  const [mobileView, setMobileView] = useState<"editor" | "side">("editor");
  const [, force] = useState(0);
  const navigate = useNavigate();
  const { status: saveStatus, lastSavedAt } = useAutosave(q.id, q);

  const set = <K extends keyof AdminQuestion>(k: K, v: AdminQuestion[K]) =>
    setQ((s) => ({ ...s, [k]: v, updatedAt: new Date().toISOString() }));

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

  const transition = (to: QuestionStatus) => {
    if (to !== "Draft" && to !== "Archived") {
      const e = validate();
      setErrors(e);
      if (e.length) return;
    }
    transitionStatus(q.id, to, undefined, "You");
    pushVersion(q, `Status → ${to}`);
    setQ((s) => ({ ...s, status: to }));
    if (to === "Published" || to === "Archived") {
      setTimeout(() => navigate({ to: "/admin/questions" }), 400);
    }
  };

  const versions = useMemo(() => getVersions(q.id), [q.id]);
  const comments = useMemo(() => getModeration(q.id), [q.id]);
  const events = useMemo(() => getWorkflow(q.id), [q.id]);
  const analytics = useMemo(() => getAnalytics(q.id), [q.id]);

  const tabs: { id: Tab; label: string; icon: typeof Eye; count?: number }[] = [
    { id: "preview", label: "Preview", icon: Eye },
    { id: "versions", label: "Versions", icon: History, count: versions.length },
    { id: "duplicates", label: "Duplicates", icon: AlertTriangle },
    { id: "moderation", label: "Review", icon: MessageSquare, count: comments.length },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "workflow", label: "Workflow", icon: Activity, count: events.length },
  ];

  return (
    <div className="pb-28">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{mode === "create" ? "Create Question" : `Edit ${q.id}`}</h1>
          <p className="text-xs text-muted-foreground">Workflow-driven authoring with versioning, moderation and analytics.</p>
        </div>
      </div>

      {/* Mobile tab switch */}
      <div className="mb-4 flex gap-1 rounded-xl border border-border bg-background p-1 text-sm lg:hidden">
        <button onClick={() => setMobileView("editor")} className={`flex-1 rounded-lg py-1.5 font-semibold ${mobileView === "editor" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Editor</button>
        <button onClick={() => setMobileView("side")} className={`flex-1 rounded-lg py-1.5 font-semibold ${mobileView === "side" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Tools</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Editor */}
        <div className={`space-y-4 ${mobileView === "side" ? "hidden lg:block" : ""}`}>
          {errors.length > 0 && (
            <div className="rounded-xl border border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] p-3 text-xs">
              <div className="mb-1 font-semibold text-[var(--destructive)]">Please fix before transitioning:</div>
              <ul className="ml-4 list-disc text-[var(--destructive)]">
                {errors.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          )}

          <Section title="Metadata">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Exam"><Input value={q.examId} onChange={(v) => set("examId", v)} placeholder="e.g. JEE Mains" /></Field>
              <Field label="Subject"><Input value={q.subject} onChange={(v) => set("subject", v)} placeholder="e.g. Physics" /></Field>
              <Field label="Chapter"><Input value={q.chapter} onChange={(v) => set("chapter", v)} placeholder="e.g. Kinematics" /></Field>
              <Field label="Topic"><Input value={q.topic} onChange={(v) => set("topic", v)} placeholder="e.g. 1D Motion" /></Field>
              <Field label="Difficulty"><Select value={q.difficulty} onChange={(v) => set("difficulty", v as Difficulty)} options={difficulties} /></Field>
              <Field label="Type"><Select value={q.type} onChange={(v) => set("type", v as QuestionType)} options={types} /></Field>
              <Field label="Marks"><NumInput value={q.marks} onChange={(v) => set("marks", v)} /></Field>
              <Field label="Negative"><NumInput value={q.negativeMarks} onChange={(v) => set("negativeMarks", v)} /></Field>
              <div className="sm:col-span-2 lg:col-span-3">
                <Field label="Tags"><TagInput tags={q.tags} onChange={(t) => set("tags", t)} /></Field>
              </div>
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

        {/* Right rail */}
        <aside className={`lg:sticky lg:top-20 lg:self-start ${mobileView === "editor" ? "hidden lg:block" : ""}`}>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 text-[11px] shadow-[var(--shadow-card)]">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 font-semibold transition ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{t.label}</span>
                    {t.count !== undefined && <span className="ml-0.5 rounded-full bg-foreground/10 px-1 text-[9px]">{t.count}</span>}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
              {tab === "preview" && (
                <DevicePreviewFrame>
                  <ExamChromeMock q={q} />
                </DevicePreviewFrame>
              )}
              {tab === "versions" && (
                <VersionHistoryPanel
                  versions={versions}
                  current={q}
                  onRestore={(v) => {
                    setQ({ ...v.snapshot, id: q.id, status: q.status });
                    pushVersion({ ...v.snapshot, id: q.id }, `Restored v${v.version}`);
                    force((n) => n + 1);
                  }}
                />
              )}
              {tab === "duplicates" && <DuplicateWarningPanel question={q} />}
              {tab === "moderation" && (
                <ModerationPanel
                  comments={comments}
                  onAdd={(c) => {
                    addModeration(q.id, { ...c, author: "You", role: "Reviewer" });
                    if (c.type === "approve") transition("Approved");
                    else if (c.type === "reject") transition("Rejected");
                    else force((n) => n + 1);
                  }}
                />
              )}
              {tab === "analytics" && <AnalyticsPanel a={analytics} />}
              {tab === "workflow" && <WorkflowTimeline events={events} />}
            </div>

            <details className="rounded-2xl border border-border bg-card p-3 text-xs shadow-[var(--shadow-card)]">
              <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Static card preview</summary>
              <div className="mt-3">
                <QuestionPreviewCard q={q} />
              </div>
            </details>
          </div>
        </aside>
      </div>

      <WorkflowBar
        status={q.status}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        onTransition={transition}
        onCancel={() => navigate({ to: "/admin/questions" })}
      />
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
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-primary" />
  );
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-primary">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function NumInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-primary" />
  );
}
