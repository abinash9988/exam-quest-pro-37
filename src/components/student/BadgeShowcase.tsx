import { Trophy } from "lucide-react";

interface Props {
  count: number;
  visible?: number;
}

export function BadgeShowcase({ count, visible = 12 }: Props) {
  const items = Array.from({ length: visible });
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
      {items.map((_, i) => (
        <div
          key={i}
          className="group relative aspect-square overflow-hidden rounded-xl border border-amber-300/40 bg-gradient-to-br from-amber-300/30 via-yellow-200/20 to-orange-400/30 shadow-[0_0_18px_-6px_oklch(0.78_0.16_75/0.5)] dark:from-amber-400/20 dark:to-orange-500/20"
        >
          <div className="absolute inset-0 grid place-items-center">
            <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          </div>
          <span className="absolute -left-6 top-0 h-full w-6 -skew-x-12 bg-white/40 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
        </div>
      ))}
      <div className="col-span-full text-[11px] text-muted-foreground">+ {count - visible} more badges in your collection</div>
    </div>
  );
}
