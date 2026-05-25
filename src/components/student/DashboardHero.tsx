import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { student, getCategoryById, subscriptions } from "@/lib/studentMock";
import { StreakWidget } from "./StreakWidget";
import { BadgeWidget } from "./BadgeWidget";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero() {
  const category = getCategoryById(student.preferredCategoryId);
  const activeSub = subscriptions.find((s) => s.status === "active");

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[var(--gradient-hero)] p-6 shadow-[var(--shadow-elevated)] md:p-8">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-fuchsia-300/30 blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <Sparkles className="h-3 w-3" /> {greeting()}, learner
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {student.name.split(" ")[0]}, ready to crack <span className="text-white/90">{category.name}</span>? 🚀
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80">
            You're in the <strong className="text-white">top {(100 - student.rankPercentile).toFixed(1)}%</strong> of all aspirants this week. Keep the streak alive.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <StreakWidget days={student.streakDays} />
            <BadgeWidget count={student.goldenBadges} />
            {activeSub && (
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px] shadow-emerald-300" />
                {activeSub.planName}
              </div>
            )}
          </div>
        </div>

        {/* Glass quick-resume */}
        <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl md:p-5">
          <div className="text-[11px] uppercase tracking-wider text-white/70">Resume practice</div>
          <div className="mt-1 text-base font-bold text-white">JEE Mains Full Test 04</div>
          <div className="mt-1 text-xs text-white/70">64% completed · 27 mins left</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: "64%" }} />
          </div>
          <Link
            to="/dashboard/mock-tests"
            className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-white py-2.5 text-sm font-semibold text-primary transition hover:scale-[1.02]"
          >
            Continue test <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
