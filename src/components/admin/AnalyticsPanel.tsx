import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Target, Clock, SkipForward, TrendingUp, Activity } from "lucide-react";
import type { QuestionAnalytics } from "@/lib/adminMock";

const COLORS = ["var(--primary)", "var(--review)", "var(--success)", "var(--warning)", "var(--destructive)"];

export function AnalyticsPanel({ a }: { a: QuestionAnalytics }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        <Stat icon={Activity} label="Attempts" value={a.attempts.toLocaleString()} />
        <Stat icon={Target} label="Accuracy" value={`${a.accuracy}%`} tone="var(--success)" />
        <Stat icon={Clock} label="Avg Time" value={`${a.avgSolveSec}s`} />
        <Stat icon={SkipForward} label="Skip Rate" value={`${a.skipRate}%`} tone="var(--warning)" />
        <Stat icon={TrendingUp} label="Difficulty" value={`${a.difficultyRating}/5`} tone="var(--review)" />
      </div>

      <Card title="Last 30 days">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={a.last30Days} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={9} interval={5} />
              <YAxis stroke="var(--muted-foreground)" fontSize={9} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="attempts" stroke="var(--primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="accuracy" stroke="var(--success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card title="Option distribution">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.optionDistribution} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                  {a.optionDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Outcome split">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Correct", value: a.accuracy },
                    { name: "Incorrect", value: Math.max(0, 100 - a.accuracy - a.skipRate) },
                    { name: "Skipped", value: a.skipRate },
                  ]}
                  dataKey="value"
                  innerRadius={28}
                  outerRadius={52}
                  stroke="var(--background)"
                >
                  <Cell fill="var(--success)" />
                  <Cell fill="var(--destructive)" />
                  <Cell fill="var(--muted-foreground)" />
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = "var(--primary)" }: { icon: typeof Target; label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" style={{ color: tone }} /> {label}
      </div>
      <div className="mt-0.5 text-lg font-bold">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}
