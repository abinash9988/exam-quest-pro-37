import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { mockTests, sampleQuestions } from "@/lib/mockData";
import { Timer } from "@/components/Timer";
import { QuestionPalette, type QStatus } from "@/components/QuestionPalette";
import { LayoutGrid, Bookmark, ChevronLeft, ChevronRight, Flag } from "lucide-react";

export const Route = createFileRoute("/exam/$examId")({
  component: ExamPage,
});

function ExamPage() {
  const { examId } = Route.useParams();
  const navigate = useNavigate();
  const test = useMemo(() => mockTests.find((t) => t.id === examId) ?? mockTests[0], [examId]);

  // build N questions by cycling sample data
  const questions = useMemo(() => {
    const n = Math.min(test.questions, 20);
    return Array.from({ length: n }, (_, i) => ({ ...sampleQuestions[i % sampleQuestions.length], id: i + 1 }));
  }, [test]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [marked, setMarked] = useState<boolean[]>(() => questions.map(() => false));
  const [visited, setVisited] = useState<boolean[]>(() => questions.map((_, i) => i === 0));
  const [paletteOpen, setPaletteOpen] = useState(false);

  const statuses: QStatus[] = questions.map((_, i) => {
    if (!visited[i]) return "not-visited";
    const ans = answers[i] != null;
    if (ans && marked[i]) return "answered-review";
    if (marked[i]) return "review";
    if (ans) return "answered";
    return "not-visited";
  });

  const goTo = (i: number) => {
    setCurrent(i);
    setVisited((v) => { const n = [...v]; n[i] = true; return n; });
  };
  const select = (oi: number) => setAnswers((a) => { const n = [...a]; n[current] = oi; return n; });
  const toggleMark = () => setMarked((m) => { const n = [...m]; n[current] = !n[current]; return n; });
  const next = () => current < questions.length - 1 && goTo(current + 1);
  const prev = () => current > 0 && goTo(current - 1);

  const submit = () => navigate({ to: "/result/$resultId", params: { resultId: "demo-result" } });

  const q = questions[current];

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-2.5">
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold">{test.title}</div>
            <div className="text-[10px] text-muted-foreground">Q {current + 1} of {questions.length} · {q.subject}</div>
          </div>
          <div className="flex items-center gap-2">
            <Timer initialSeconds={test.duration * 60} onExpire={submit} />
            <button onClick={submit} className="rounded-full bg-destructive px-3 py-1.5 text-xs font-bold text-destructive-foreground">
              Submit
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div className="h-full bg-[var(--gradient-hero)] transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </header>

      {/* Question area */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-36 pt-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              Question {current + 1}
            </span>
            {marked[current] && <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--review)]"><Flag className="h-3 w-3" />Marked</span>}
          </div>
          <p className="mt-4 text-base font-medium leading-relaxed">{q.text}</p>
        </div>

        <div className="mt-4 space-y-2.5">
          {q.options.map((opt, i) => {
            const selected = answers[current] === i;
            return (
              <button
                key={i}
                onClick={() => select(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  selected ? "border-primary bg-primary-soft shadow-[var(--shadow-soft)]" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next inline */}
        <div className="mt-5 flex items-center justify-between">
          <button onClick={prev} disabled={current === 0} className="flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <button onClick={next} disabled={current === questions.length - 1} className="flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold disabled:opacity-40">
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>

      {/* Bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2 p-3">
          <button onClick={() => setPaletteOpen(true)} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-2.5 text-[10px] font-semibold">
            <LayoutGrid className="h-4 w-4 text-primary" />
            Palette
          </button>
          <button onClick={toggleMark} className={`flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-[10px] font-semibold ${marked[current] ? "border-[var(--review)] bg-[var(--review)]/10 text-[var(--review)]" : "border-border bg-card"}`}>
            <Bookmark className={`h-4 w-4 ${marked[current] ? "fill-current" : ""}`} />
            {marked[current] ? "Unmark" : "Mark Review"}
          </button>
          <button onClick={next} className="flex flex-col items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-[11px] font-bold text-primary-foreground shadow-[var(--shadow-soft)]">
            Save & Next
          </button>
        </div>
      </div>

      <QuestionPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} statuses={statuses} current={current} onJump={goTo} />
    </div>
  );
}
