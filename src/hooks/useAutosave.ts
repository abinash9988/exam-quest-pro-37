import { useEffect, useRef, useState } from "react";

const store = new Map<string, unknown>();

export type AutosaveStatus = "idle" | "saving" | "saved";

export function useAutosave<T>(key: string, value: T, delay = 1500) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const first = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      store.set(key, value);
      setLastSavedAt(new Date());
      setStatus("saved");
    }, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, key, delay]);

  return { status, lastSavedAt };
}

export function formatAgo(d: Date | null): string {
  if (!d) return "";
  const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}
