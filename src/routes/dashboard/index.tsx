import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHero } from "@/components/student/DashboardHero";
import { StatsCard } from "@/components/student/StatsCard";
import { MockTestCard } from "@/components/student/MockTestCard";
import { PurchaseCard } from "@/components/student/PurchaseCard";
import { SubscriptionCard } from "@/components/student/SubscriptionCard";
import { SectionHeader } from "@/components/student/SectionHeader";
import {
  dashboardStats,
  unlockedTests,
  purchases,
  subscriptions,
  categories,
} from "@/lib/studentMock";
import { BookOpen, Target, Activity, ListChecks, CreditCard, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard · MockArena" }] }),
  component: DashboardHome,
});

function DashboardHome() {
  const activeTests = unlockedTests.filter((t) => t.status !== "completed").slice(0, 4);
  const recentPurchases = [...purchases]
    .sort((a, b) => +new Date(b.paidAt) - +new Date(a.paidAt))
    .slice(0, 3);
  const activeSubs = subscriptions.filter((s) => s.status === "active");

  return (
    <div className="space-y-6">
      <DashboardHero />

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatsCard icon={BookOpen} label="Active mock tests" value={dashboardStats.activeTests} tone="primary" />
          <StatsCard icon={Target} label="Average score" value={`${dashboardStats.avgScore}%`} tone="success" hint="+4%" />
          <StatsCard icon={Activity} label="Accuracy" value={`${dashboardStats.accuracy}%`} tone="review" />
          <StatsCard icon={ListChecks} label="Total attempts" value={dashboardStats.totalAttempts} tone="warning" />
          <StatsCard icon={CreditCard} label="Subscription" value={dashboardStats.subscriptionStatus} tone="accent" />
          <StatsCard icon={Users} label="Community posts" value={dashboardStats.communityPosts} tone="primary" />
        </div>
      </section>

      {/* Active mock tests */}
      <section>
        <SectionHeader title="Active mock tests" subtitle="Resume, reattempt or unlock new ones" viewAllTo="/dashboard/mock-tests" />
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {activeTests.map((t) => (
            <div key={t.id} className="w-72 shrink-0 md:w-auto">
              <MockTestCard test={t} />
            </div>
          ))}
        </div>
      </section>

      {/* Two-column */}
      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <SectionHeader title="Recent purchases" viewAllTo="/dashboard/purchases" />
          <div className="space-y-2">
            {recentPurchases.map((p) => (
              <PurchaseCard key={p.id} purchase={p} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader title="Active subscriptions" viewAllTo="/dashboard/subscriptions" />
          <div className="space-y-3">
            {activeSubs.map((s) => (
              <SubscriptionCard key={s.id} sub={s} />
            ))}
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
