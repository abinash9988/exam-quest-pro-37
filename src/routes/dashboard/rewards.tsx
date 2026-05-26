import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/student/SectionHeader";
import { RewardCard } from "@/components/student/RewardCard";
import { ProgressRing } from "@/components/student/ProgressRing";
import { BadgeShowcase } from "@/components/student/BadgeShowcase";
import { StreakCalendar } from "@/components/student/StreakCalendar";
import { ConfettiBurst } from "@/components/student/ConfettiBurst";
import {
  REWARD_TIERS, student, achievements, getProgressToNextReward, BADGE_RULE, formatDate,
} from "@/lib/studentMock";
import { Award, Flame, Gift, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards · MockArena" },
      { name: "description", content: "Earn golden badges and unlock real-world rewards on your learning journey." },
    ],
  }),
  component: RewardsPage,
});

const TYPE_ICON = { streak: Flame, badge: Trophy, score: Award, reward: Gift } as const;

function RewardsPage() {
  const reward = getProgressToNextReward(student.goldenBadges);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Rewards</h1>
        <p className="text-sm text-muted-foreground">Collect Golden Badges and unlock real merchandise.</p>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-elevated)] md:p-8">
        <ConfettiBurst count={22} />
        <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />

        <div className="relative grid items-center gap-6 md:grid-cols-[auto,1fr,auto]">
          <ProgressRing
            value={reward.pct}
            size={132}
            stroke={12}
            trackClassName="stroke-white/20"
            className="stroke-amber-300"
            label={
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-white">{student.goldenBadges}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/80">badges</span>
              </div>
            }
          />
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur">
              <Sparkles className="h-3 w-3" /> Next milestone
            </div>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              {reward.next ? `${reward.next.icon} ${reward.next.name}` : "🏆 All rewards unlocked!"}
            </h2>
            <p className="mt-1 text-sm text-white/85">
              {reward.next
                ? `${reward.remaining} more badges to unlock this reward. You're ${reward.pct}% there.`
                : "You've completed every tier — go for legend status."}
            </p>
            <div className="mt-3 text-[11px] text-white/75">Badge rule: {BADGE_RULE}.</div>
          </div>
        </div>
      </section>

      {/* Streak calendar */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <SectionHeader title="Streak calendar" subtitle="Last 14 days · Don't break the chain" />
        <StreakCalendar />
      </section>

      {/* Reward tiers grid */}
      <section>
        <SectionHeader title="Reward tiers" subtitle="Unlock each tier by earning more Golden Badges" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REWARD_TIERS.map((r) => (
            <RewardCard key={r.id} reward={r} badges={student.goldenBadges} />
          ))}
        </div>
      </section>

      {/* Badge showcase */}
      <section className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:from-amber-500/10 dark:to-orange-500/10">
        <SectionHeader title="Golden badge collection" subtitle={`${student.goldenBadges} earned · keep going`} />
        <BadgeShowcase count={student.goldenBadges} />
      </section>

      {/* Achievement timeline */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <SectionHeader title="Achievement timeline" subtitle="Your latest wins" />
        <ol className="relative space-y-3 border-l border-border/60 pl-5">
          {achievements.map((a) => {
            const Icon = TYPE_ICON[a.type];
            return (
              <li key={a.id} className="relative animate-fade-in">
                <span className="absolute -left-[26px] top-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
                  <Icon className="h-3 w-3" />
                </span>
                <div className="rounded-xl bg-background/50 p-3">
                  <div className="text-sm font-bold">{a.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{a.detail} · {formatDate(a.earnedAt)}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
