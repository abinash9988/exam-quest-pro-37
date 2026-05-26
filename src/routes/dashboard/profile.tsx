import { createFileRoute } from "@tanstack/react-router";
import { ProfileCard } from "@/components/student/ProfileCard";
import { SectionHeader } from "@/components/student/SectionHeader";
import { EditProfileSheet } from "@/components/student/EditProfileSheet";
import { student, purchases, streakSeries, categories } from "@/lib/studentMock";
import { Mail, Phone, ShieldCheck, Flame, Trophy, Wallet } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile · MockArena" },
      { name: "description", content: "Your student profile, login methods and learning stats." },
    ],
  }),
  component: ProfilePage,
});

const methodMeta = {
  email: { label: "Email", Icon: Mail },
  mobile: { label: "Mobile", Icon: Phone },
  google: { label: "Google", Icon: ShieldCheck },
} as const;

function ProfilePage() {
  const totalSpent = purchases.reduce((s, p) => s + (p.status !== "refunded" ? p.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <EditProfileSheet />
      </div>
      <ProfileCard />

      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={Flame} label="Day streak" value={student.streakDays} tone="warning" />
        <Stat icon={Trophy} label="Golden badges" value={student.goldenBadges} tone="primary" />
        <Stat icon={Wallet} label="Total spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} tone="success" />
      </div>

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <SectionHeader title="Login methods" subtitle="Ways you sign in to your account" />
        <div className="grid gap-2 sm:grid-cols-3">
          {student.loginMethods.map((m) => {
            const meta = methodMeta[m.type];
            return (
              <div key={m.type} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <meta.Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold">{meta.label}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{m.value}</div>
                </div>
                {m.verified && (
                  <span className="rounded-full bg-[var(--success)]/15 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--success)]">
                    Verified
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <SectionHeader title="Streak history" subtitle="Last 7 days of practice" />
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={streakSeries} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="d" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "oklch(0.52 0.20 268 / 0.08)" }} />
              <Bar dataKey="v" fill="oklch(0.52 0.20 268)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <SectionHeader title="Preferred category" subtitle="Choose your primary exam focus" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => {
            const active = student.preferredCategoryId === c.id;
            return (
              <button
                key={c.id}
                className={`rounded-2xl border p-3 text-left transition ${
                  active ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className="text-xl">{c.icon}</div>
                <div className="mt-1 text-sm font-bold">{c.name}</div>
                {active && <div className="text-[10px] font-semibold text-primary">Current</div>}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Flame; label: string; value: string | number; tone: "primary" | "success" | "warning" }) {
  const t = {
    primary: "bg-primary-soft text-primary",
    success: "bg-[var(--success)]/15 text-[var(--success)]",
    warning: "bg-[var(--warning)]/15 text-[var(--warning)]",
  }[tone];
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)]">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${t}`}><Icon className="h-4 w-4" /></div>
      <div className="mt-3 text-xl font-bold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
