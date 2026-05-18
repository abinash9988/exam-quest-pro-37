import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { mockTests } from "@/lib/mockData";
import { Flame, TrendingUp, Trophy, Target, ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · MockArena" }] }),
  component: Dashboard,
});

const trend = [
  { d: "Mon", score: 62 }, { d: "Tue", score: 68 }, { d: "Wed", score: 71 },
  { d: "Thu", score: 65 }, { d: "Fri", score: 78 }, { d: "Sat", score: 82 }, { d: "Sun", score: 85 },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/20 pb-24 md:pb-12">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Welcome back,</div>
            <h1 className="text-2xl font-bold">Aspirant 👋</h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--warning)]/10 px-3 py-1.5 text-xs font-bold text-[var(--warning)]">
            <Flame className="h-4 w-4" /> 7 day streak
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Widget icon={Trophy} label="Tests taken" value="24" tone="primary" />
          <Widget icon={Target} label="Avg accuracy" value="76%" tone="success" />
          <Widget icon={TrendingUp} label="Best rank" value="#2,103" tone="review" />
          <Widget icon={Flame} label="Hours studied" value="48h" tone="warning" />
        </div>

        {/* Trend */}
        <section className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Performance trend</h2>
            <span className="text-[11px] text-muted-foreground">Last 7 days</span>
          </div>
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.52 0.20 268)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.20 295)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="url(#g1)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.52 0.20 268)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent + weak */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 text-sm font-bold">Recent tests</h2>
            <div className="space-y-2">
              {mockTests.slice(0, 4).map((t, i) => (
                <Link key={t.id} to="/result/$resultId" params={{ resultId: "demo-result" }} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 hover:bg-muted">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.title}</div>
                    <div className="text-[11px] text-muted-foreground">2 days ago · {t.difficulty}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-bold tabular-nums">{72 + i * 3}%</div>
                    <div className="text-[10px] text-muted-foreground">score</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="mb-3 text-sm font-bold">Weak subjects</h2>
            <div className="space-y-3">
              {[{ s: "Maths", v: 58 }, { s: "Reasoning", v: 64 }, { s: "Organic Chem", v: 51 }].map((w) => (
                <div key={w.s}>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">{w.s}</span>
                    <span className="tabular-nums text-muted-foreground">{w.v}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-destructive transition-all" style={{ width: `${w.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/mock-test" className="mt-4 flex items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
              Practice weak areas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </div>

        {/* Recommended */}
        <section className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-3 text-sm font-bold">Recommended for you</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {mockTests.slice(2, 6).map((t) => (
              <Link key={t.id} to="/exam/$examId" params={{ examId: t.id }} className="flex items-center justify-between rounded-xl border border-border p-3 hover:border-primary">
                <div>
                  <div className="text-sm font-semibold">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground">{t.duration}m · {t.questions} Qs</div>
                </div>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  );
}

function Widget({ icon: Icon, label, value, tone }: { icon: typeof Flame; label: string; value: string; tone: "primary" | "success" | "warning" | "review" }) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-[var(--success)]/10 text-[var(--success)]",
    warning: "bg-[var(--warning)]/10 text-[var(--warning)]",
    review: "bg-[var(--review)]/10 text-[var(--review)]",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></div>
      <div className="mt-3 text-xl font-bold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
