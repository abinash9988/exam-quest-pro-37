import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { WeeklyActivityPoint } from "@/lib/communityMock";

export default function ActivityGraphInner({ data }: { data: WeeklyActivityPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "currentColor" }} className="text-muted-foreground" />
        <Tooltip
          cursor={{ fill: "oklch(var(--primary) / 0.08)" }}
          contentStyle={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey="messages" radius={[6, 6, 0, 0]} fill="oklch(0.52 0.20 268)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
