import { Lock, Sparkles } from "lucide-react";
import type { Reward } from "@/lib/studentMock";
import { ConfettiBurst } from "./ConfettiBurst";

interface Props {
  reward: Reward;
  badges: number;
}

export function RewardCard({ reward, badges }: Props) {
  const unlocked = badges >= reward.threshold;
  const pct = Math.min(100, Math.round((badges / reward.threshold) * 100));

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 transition ${
        unlocked
          ? "border-amber-300/60 bg-gradient-to-br from-amber-100/70 via-yellow-50 to-orange-100/70 shadow-[0_0_40px_-12px_oklch(0.78_0.16_75/0.6)] dark:from-amber-500/15 dark:via-yellow-500/10 dark:to-orange-500/15"
          : "border-border/60 bg-card opacity-90 hover:border-primary/40"
      }`}
    >
      {unlocked && <ConfettiBurst count={14} />}
      <div className="relative flex items-start justify-between">
        <div
          className={`grid h-14 w-14 place-items-center rounded-2xl text-3xl ${
            unlocked ? "bg-white/70 shadow-[var(--shadow-elevated)] dark:bg-white/10" : "bg-muted grayscale"
          }`}
        >
          {reward.icon}
        </div>
        {unlocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--warning)]">
            <Sparkles className="h-3 w-3" /> Unlocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
            <Lock className="h-3 w-3" /> Locked
          </span>
        )}
      </div>

      <h3 className="relative mt-3 text-base font-bold">{reward.name}</h3>
      <p className="relative mt-0.5 text-xs text-muted-foreground">{reward.description}</p>

      <div className="relative mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-muted-foreground">{Math.min(badges, reward.threshold)} / {reward.threshold} badges</span>
          <span className={unlocked ? "text-[var(--warning)]" : "text-primary"}>{pct}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              unlocked ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-[var(--gradient-hero)]"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button
        disabled={!unlocked}
        className={`relative mt-4 w-full rounded-xl py-2 text-xs font-semibold transition ${
          unlocked
            ? "bg-[var(--warning)] text-white hover:scale-[1.02]"
            : "cursor-not-allowed bg-muted text-muted-foreground"
        }`}
      >
        {unlocked ? "Claim reward" : `${reward.threshold - badges} badges to unlock`}
      </button>
    </div>
  );
}
