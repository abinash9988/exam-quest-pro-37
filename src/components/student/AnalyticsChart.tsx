import { lazy, Suspense } from "react";

const Inner = lazy(() => import("./AnalyticsChartInner").then((m) => ({ default: m.AnalyticsChartInner })));

export type ChartVariant = "line" | "bar" | "donut" | "area";
export interface AnalyticsChartProps {
  variant: ChartVariant;
  data: any[];
  xKey?: string;
  yKey?: string;
  nameKey?: string;
  valueKey?: string;
  height?: number;
}

export function AnalyticsChart(props: AnalyticsChartProps) {
  return (
    <Suspense fallback={<div className="grid h-40 place-items-center text-xs text-muted-foreground">Loading chart…</div>}>
      <Inner {...props} />
    </Suspense>
  );
}
