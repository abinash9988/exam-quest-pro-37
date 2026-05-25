import { Medal } from "lucide-react";

export function BadgeWidget({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white shadow-lg">
        <Medal className="h-3.5 w-3.5" />
      </span>
      <div className="leading-tight text-white">
        <div className="text-sm font-bold tabular-nums">{count}</div>
        <div className="text-[10px] uppercase tracking-wide opacity-80">Golden badges</div>
      </div>
    </div>
  );
}
