import { Flame } from "lucide-react";
import { streakCalendar } from "@/lib/studentMock";

export function StreakCalendar() {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-14">
      {streakCalendar.map((d, i) => (
        <div
          key={d.date}
          className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border text-[10px] font-bold transition ${
            d.active
              ? "border-[var(--warning)]/40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-[var(--warning)]"
              : "border-border bg-muted/30 text-muted-foreground"
          }`}
          title={new Date(d.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
        >
          {d.active ? <Flame className="h-3.5 w-3.5" /> : <span>{d.label}</span>}
          <span className="absolute -bottom-4 text-[9px] font-medium text-muted-foreground">{i === streakCalendar.length - 1 ? "today" : ""}</span>
        </div>
      ))}
    </div>
  );
}
