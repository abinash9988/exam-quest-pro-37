import { lazy, Suspense } from "react";
import type { WeeklyActivityPoint } from "@/lib/communityMock";

const Inner = lazy(() => import("./ActivityGraphInner"));

export function ActivityGraph({ data }: { data: WeeklyActivityPoint[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Weekly activity</p>
      <div className="mt-2 h-32">
        <Suspense fallback={<div className="h-full animate-pulse rounded-lg bg-muted/40" />}>
          <Inner data={data} />
        </Suspense>
      </div>
    </div>
  );
}
