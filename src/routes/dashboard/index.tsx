import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardHero } from "@/components/student/DashboardHero";
import { StatsCard } from "@/components/student/StatsCard";
import { MockTestCard } from "@/components/student/MockTestCard";
import { PurchaseCard } from "@/components/student/PurchaseCard";
import { SubscriptionCard } from "@/components/student/SubscriptionCard";
import { SectionHeader } from "@/components/student/SectionHeader";
import { CategoryFilter } from "@/components/student/CategoryFilter";
import { RecommendationCard } from "@/components/student/RecommendationCard";
import { ProgressRing } from "@/components/student/ProgressRing";
import {
  dashboardStats, unlockedTests, purchases, subscriptions, categories,
  recommendations, student, getProgressToNextReward,
} from "@/lib/studentMock";
import { BookOpen, Target, Activity, ListChecks, CreditCard, Users, ArrowRight, Gift } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboard · MockArena" },
      { name: "description", content: "Your premium learning dashboard — streaks, badges, mock tests and rewards." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const [cat, setCat] = useState<string>("all");

  const filteredTests = useMemo(
    () => unlockedTests.filter((t) => (cat === "all" ? true : t.categoryId === cat)).filter((t) => t.status !== "completed").slice(0, 4),
    [cat],
  );
  const filteredRecs = useMemo(
    () => recommendations.filter((r) => (cat === "all" ? true : r.categoryId === cat)).slice(0, 3),
    [cat],
  );

  const recentPurchases = [...purchases]
    .sort((a, b) => +new Date(b.paidAt) - +new Date(a.paidAt))
    .slice(0, 3);
  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const reward = getProgressToNextReward(student.goldenBadges);

  return (
    <div className="space-y-6">
      <DashboardHero />

      {/* Next reward strip */}
      {reward.next && (
        <Link
          to="/dashboard/rewards"
          className="group flex items-center gap-4 rounded-3xl border border-amber-300/30 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] dark:from-amber-500/10 dark:via-yellow-500/5 dark:to-orange-500/10"
        >
          <ProgressRing
            value={reward.pct}
            size={64}
            stroke={6}
            label={<span className="text-sm">{student.goldenBadges}</span>}
            className="stroke-[var(--warning)]"
          />
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--warning)]">
              <Gift className="h-3 w-3" /> Next reward
            </div>
            <div className="mt-1 text-sm font-bold">
              {reward.next.icon} {reward.next.name}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {reward.remaining} more golden badges to unlock
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatsCard icon={BookOpen} label="Active mock tests" value={dashboardStats.activeTests} tone="primary" />
        <StatsCard icon={Target} label="Average score" value={`${dashboardStats.avgScore}%`} tone="success" hint="+4%" />
        <StatsCard icon={Activity} label="Accuracy" value={`${dashboardStats.accuracy}%`} tone="review" />
        <StatsCard icon={ListChecks} label="Total attempts" value={dashboardStats.totalAttempts} tone="warning" />
        <StatsCard icon={CreditCard} label="Subscription" value={dashboardStats.subscriptionStatus} tone="accent" />
        <StatsCard icon={Users} label="Community posts" value={dashboardStats.communityPosts} tone="primary" />
      </section>

      {/* Category filter */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Personalize</div>
        <CategoryFilter value={cat} onChange={setCat} />
      </div>

      {/* Active mock tests */}
      <section>
        <SectionHeader title="Active mock tests" subtitle="Resume, reattempt or unlock new ones" viewAllTo="/dashboard/mock-tests" />
        {filteredTests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
            No active tests in this category yet.
          </div>
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
            {filteredTests.map((t) => (
              <div key={t.id} className="w-72 shrink-0 md:w-auto">
                <MockTestCard test={t} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section>
        <SectionHeader title="Recommended for you" subtitle="Based on your weak subjects & recent attempts" />
        {filteredRecs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            Nothing here yet — try another category.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecs.map((r) => <RecommendationCard key={r.id} rec={r} />)}
          </div>
        )}
      </section>

      {/* Two-column */}
      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <SectionHeader title="Recent purchases" viewAllTo="/dashboard/purchases" />
          <div className="space-y-2">
            {recentPurchases.map((p) => <PurchaseCard key={p.id} purchase={p} />)}
          </div>
        </div>
        <div>
          <SectionHeader title="Active subscriptions" viewAllTo="/dashboard/subscriptions" />
          <div className="space-y-3">
            {activeSubs.map((s) => <SubscriptionCard key={s.id} sub={s} />)}
          </div>
        </div>
      </section>

      {/* Explore categories */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-[var(--gradient-card)] p-5 md:p-7">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold">Explore more exam categories</h3>
            <p className="text-xs text-muted-foreground">Unlock targeted mock tests across every major competitive exam.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span key={c.id} className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-br ${c.gradient} px-2.5 py-1 text-[11px] font-semibold text-white`}>
                  <span>{c.icon}</span> {c.name}
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/mock-test"
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:scale-[1.02]"
          >
            Browse catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
