import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function Timer({ initialSeconds, onExpire }: { initialSeconds: number; onExpire?: () => void }) {
  const [s, setS] = useState(initialSeconds);
  useEffect(() => {
    if (s <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setS((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [s, onExpire]);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const low = s < 300;
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tabular-nums ${low ? "bg-destructive/10 text-destructive" : "bg-primary-soft text-primary"}`}>
      <Clock className="h-3.5 w-3.5" />
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(sec).padStart(2, "0")}
    </div>
  );
}
