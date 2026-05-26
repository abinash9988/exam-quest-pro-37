import { useEffect, useState } from "react";
import { Award, X } from "lucide-react";
import { ConfettiBurst } from "./ConfettiBurst";

interface Props {
  title: string;
  description: string;
  onDismiss?: () => void;
  durationMs?: number;
}

export function AchievementPopup({ title, description, onDismiss, durationMs = 4500 }: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDismiss?.(); }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDismiss]);

  if (!visible) return null;
  return (
    <div className="fixed bottom-24 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 md:bottom-8">
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-[var(--gradient-hero)] p-4 shadow-[var(--shadow-elevated)] animate-[scale-in_0.25s_ease-out]">
        <ConfettiBurst count={20} />
        <button
          onClick={() => { setVisible(false); onDismiss?.(); }}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="relative flex items-center gap-3 text-white">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-white/80">Achievement unlocked</div>
            <div className="text-sm font-bold">{title}</div>
            <div className="text-[11px] text-white/80">{description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
