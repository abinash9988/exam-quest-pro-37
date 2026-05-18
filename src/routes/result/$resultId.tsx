import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { AuthModal } from "@/components/AuthModal";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar } from "recharts";
import { Trophy, Target, Clock, TrendingUp, ChevronDown, Lock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { mockTests } from "@/lib/mockData";

export const Route = createFileRoute("/result/$resultId")({
  component: ResultPage,
});

const subjectData = [
  { subject: "Physics", score: 72, total: 100, correct: 18, wrong: 5, accuracy: 78, time: 42 },
  { subject: "Chemistry", score: 85, total: 100, correct: 22, wrong: 3, accuracy: 88, time: 35 },
  { subject: "Maths", score: 58, total: 100, correct: 14, wrong: 8, accuracy: 64, time: 55 },
];
const COLORS = ["oklch(0.52 0.20 268)", "oklch(0.72 0.16 165)", "oklch(0.62 0.20 295)"];

function ResultPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const totalCorrect = subjectData.reduce((a, b) => a + b.correct, 0);
  const totalWrong = subjectData.reduce((a, b) => a + b.wrong, 0);
  const accuracy = Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100);

  return (
    <div className="min-h-screen bg-muted/20 pb-24 md:pb-12">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/mock-test" className="text-xs text-muted-foreground hover:text-primary">← Back to tests</Link>

        {/* Hero score */}
        <div className="mt-3 overflow-hidden rounded-3xl bg-[var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">JEE Mains Full Test 01</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-bold tabular-nums">215</span>
            <span className="pb-1 text-sm opacity-80">/ 300</span>
          </div>
          <div className="mt-1 text-sm opacity-90">Great job! You're in the top 12%.</div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { l: "Correct", v: totalCorrect, c: "text-emerald-200" },
              { l: "Wrong", v: totalWrong, c: "text-rose-200" },
              { l: "Accuracy", v: `${accuracy}%`, c: "text-amber-200" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 p-2.5 backdrop-blur">
                <div className={`text-xl font-bold tabular-nums ${s.c}`}>{s.v}</div>
                <div className="text-[10px] opacity-80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={Trophy} label="Rank Predicted" value="#4,231" tone="primary" />
          <StatCard icon={Target} label="Percentile" value="91.4%" tone="success" />
          <StatCard icon={Clock} label="Time Used" value="2h 38m" tone="warning" />
          <StatCard icon={TrendingUp} label="Improvement" value="+12%" tone="review" />
        </div>

        {/* Charts row */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Card title="Accuracy by subject">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subjectData} dataKey="accuracy" nameKey="subject" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 grid grid-cols-3 gap-2 text-center text-[10px]">
              {subjectData.map((s, i) => (
                <div key={s.subject}>
                  <div className="flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="font-semibold">{s.subject}</span>
                  </div>
                  <div className="text-muted-foreground">{s.accuracy}%</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Time spent (minutes)">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="subject" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="time" radius={[8, 8, 0, 0]} fill="oklch(0.52 0.20 268)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Subject-wise */}
        <Card title="Subject-wise analysis" className="mt-4">
          <div className="space-y-3">
            {subjectData.map((s, i) => (
              <div key={s.subject} className="rounded-2xl bg-muted/40 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{s.subject}</span>
                  <span className="tabular-nums">{s.score}/{s.total}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.score}%`, background: COLORS[i] }} />
                </div>
                <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-[var(--success)]" />{s.correct}</span>
                  <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-destructive" />{s.wrong}</span>
                  <span>· {s.accuracy}% accuracy</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rank prediction with radial */}
        <Card title="Rank prediction" className="mt-4">
          <div className="flex items-center gap-4">
            <div className="h-32 w-32 shrink-0">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: "P", value: 91.4, fill: "oklch(0.52 0.20 268)" }]} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-3xl font-bold">#4,231</div>
              <div className="text-xs text-muted-foreground">out of 1.2M aspirants</div>
              <div className="mt-2 inline-flex rounded-full bg-[var(--success)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--success)]">91.4 Percentile</div>
            </div>
          </div>
        </Card>

        {/* Weak topics — locked */}
        <Card title="Weak topics & question review" className="mt-4">
          <div className="relative">
            <div className={`space-y-2 ${unlocked ? "" : "blur-sm select-none"}`}>
              {["Rotational Mechanics — 42% accuracy", "Organic Reactions — 51% accuracy", "Integration — 48% accuracy"].map((t) => (
                <div key={t} className="flex items-center justify-between rounded-xl bg-destructive/5 p-3 text-sm">
                  <span>{t}</span>
                  <Link to="/mock-test" className="text-xs font-semibold text-primary">Practice →</Link>
                </div>
              ))}
              <ReviewAccordion />
            </div>
            {!unlocked && (
              <div className="absolute inset-0 grid place-items-center">
                <button onClick={() => setAuthOpen(true)} className="flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[var(--shadow-elevated)]">
                  <Lock className="h-4 w-4" /> Login to unlock full analysis
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Recommended */}
        <Card title="Recommended next tests" className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {mockTests.slice(0, 4).map((t) => (
              <Link key={t.id} to="/exam/$examId" params={{ examId: t.id }} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm hover:bg-muted">
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground">{t.duration}m · {t.difficulty}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={() => { setAuthOpen(false); setUnlocked(true); }} />
      <BottomNav />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Trophy; label: string; value: string | number; tone: "primary" | "success" | "warning" | "review" }) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-[var(--success)]/10 text-[var(--success)]",
    warning: "bg-[var(--warning)]/10 text-[var(--warning)]",
    review: "bg-[var(--review)]/10 text-[var(--review)]",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></div>
      <div className="mt-2 text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] ${className}`}>
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}

function ReviewAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between p-3 text-sm font-semibold">
        Question-by-question review (25)
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-border p-3 text-sm text-muted-foreground">
          See every question, your answer, the correct one and explanations.
        </div>
      )}
    </div>
  );
}
