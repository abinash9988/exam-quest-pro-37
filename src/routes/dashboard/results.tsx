import { createFileRoute } from "@tanstack/react-router";
import { StatsCard } from "@/components/student/StatsCard";
import { SectionHeader } from "@/components/student/SectionHeader";
import { AnalyticsChart } from "@/components/student/AnalyticsChart";
import {
  results, subjectStats, weeklyPerformance, student, dashboardStats, getCategoryById, formatDate,
} from "@/lib/studentMock";
import { Trophy, Flame, Award, ListChecks, TrendingUp, TrendingDown, Crown } from "lucide-react";

export const Route = createFileRoute("/dashboard/results")({
  head: () => ({
    meta: [
      { title: "Results & Analytics · MockArena" },
      { name: "description", content: "Score trends, subject analytics, weak/strong areas and rank prediction." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const scoreSeries = results.map((r, i) => ({ x: `T${i + 1}`, y: r.scorePct }));
  const subjectBars = subjectStats.map((s) => ({ x: s.subject, y: s.avgScore }));
  const donut = subjectStats.map((s) => ({ name: s.subject, value: s.attempts }));
  const weekly = weeklyPerformance.map((w) => ({ x: w.day, y: w.score }));

  const weak = subjectStats.filter((s) => s.strength === "weak");
  const strong = subjectStats.filter((s) => s.strength === "strong");
  const best = Math.max(...results.map((r) => r.scorePct));
  const avgTime = Math.round(results.reduce((s, r) => s + r.timeTakenMin, 0) / results.length);
  const cat = getCategoryById(student.preferredCategoryId);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Results & analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights from your last {results.length} attempts.</p>
      </header>

      {/* top stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatsCard icon={Trophy} label="Best score" value={`${best}%`} tone="success" />
        <StatsCard icon={Flame} label="Current streak" value={student.streakDays} tone="warning" />
        <StatsCard icon={Award} label="Golden badges" value={student.goldenBadges} tone="primary" />
        <StatsCard icon={ListChecks} label="Total attempts" value={dashboardStats.totalAttempts} tone="review" />
      </div>

      {/* score trend + donut */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <SectionHeader title="Score trend" subtitle={`Last ${results.length} mock attempts`} />
          <AnalyticsChart variant="area" data={scoreSeries} height={240} />
        </div>
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
          <SectionHeader title="Subject split" subtitle="Where you spend time" />
          <AnalyticsChart variant="donut" data={donut} height={240} />
        </div>
      </section>

      {/* subject bar + weekly */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
          <SectionHeader title="Subject comparison" subtitle="Average score per subject" />
          <AnalyticsChart variant="bar" data={subjectBars} height={240} />
        </div>
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
          <SectionHeader title="Weekly performance" subtitle="Score across the last 7 days" />
          <AnalyticsChart variant="line" data={weekly} height={240} />
        </div>
      </section>

      {/* weak / strong */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5">
          <div className="flex items-center gap-2 text-[var(--success)]">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wide">Strong subjects</span>
          </div>
          <ul className="mt-3 space-y-2">
            {strong.map((s) => (
              <li key={s.subject} className="flex items-center justify-between rounded-xl bg-background/60 p-3">
                <div className="text-sm font-semibold">{s.subject}</div>
                <div className="text-xs font-bold text-[var(--success)]">{s.avgScore}% avg</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-center gap-2 text-destructive">
            <TrendingDown className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wide">Needs attention</span>
          </div>
          <ul className="mt-3 space-y-2">
            {weak.map((s) => (
              <li key={s.subject} className="flex items-center justify-between rounded-xl bg-background/60 p-3">
                <div className="text-sm font-semibold">{s.subject}</div>
                <div className="text-xs font-bold text-destructive">{s.avgScore}% avg</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* rank prediction + completion time */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur">
              <Crown className="h-3 w-3" /> Rank prediction
            </div>
            <h3 className="mt-3 text-3xl font-extrabold">{cat.name} · Top {(100 - student.rankPercentile).toFixed(1)}%</h3>
            <p className="mt-1 text-sm text-white/85">Predicted percentile based on current attempts vs. peer cohort.</p>
          </div>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
          <SectionHeader title="Average completion time" />
          <div className="text-4xl font-extrabold tabular-nums">{avgTime}<span className="ml-1 text-base text-muted-foreground">min</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Across your last {results.length} attempts.</p>
        </div>
      </section>

      {/* performance timeline */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <SectionHeader title="Performance timeline" subtitle="Recent attempts" />
        <ol className="relative space-y-3 border-l border-border/60 pl-5">
          {results.slice().reverse().slice(0, 6).map((r) => {
            const c = getCategoryById(r.categoryId);
            const good = r.scorePct >= 70;
            return (
              <li key={r.id} className="relative">
                <span className={`absolute -left-[26px] top-2 grid h-4 w-4 place-items-center rounded-full ${good ? "bg-[var(--success)]" : "bg-[var(--warning)]"} text-[10px] text-white`}>•</span>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-background/50 p-3">
                  <div>
                    <div className="text-sm font-bold">{r.testName}</div>
                    <div className="text-[11px] text-muted-foreground">{c.name} · {formatDate(r.attemptedAt)} · {r.timeTakenMin}m</div>
                  </div>
                  <div className={`text-sm font-bold ${good ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>{r.scorePct}%</div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
