import { Flame, Trophy, Sparkles, Target } from "lucide-react";
import { student } from "@/lib/studentMock";

const cards = [
  { icon: Flame, title: "Study streak", value: `${student.streakDays} days`, tone: "from-orange-500 to-rose-500" },
  { icon: Trophy, title: "Golden badges", value: `${student.goldenBadges}`, tone: "from-amber-400 to-yellow-600" },
  { icon: Sparkles, title: "Daily motivation", value: "Small steps, big wins", tone: "from-indigo-500 to-purple-600" },
  { icon: Target, title: "Weekly challenge", value: "Solve 100 MCQs", tone: "from-emerald-500 to-teal-600" },
];

export function EngagementStrip() {
  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="flex gap-3 md:grid md:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className={`relative w-56 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${c.tone} p-4 text-white shadow md:w-auto`}
          >
            <c.icon className="h-5 w-5" />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/80">{c.title}</p>
            <p className="mt-1 text-base font-extrabold leading-tight">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
