import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, FileText, Users, BookOpen, BarChart3, Upload, Plus, Search, MoreVertical, Menu, X } from "lucide-react";
import { mockTests } from "@/lib/mockData";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · MockArena" }] }),
  component: Admin,
});

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "questions", label: "Questions", icon: FileText },
  { id: "exams", label: "Exams", icon: BookOpen },
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

function Admin() {
  const [active, setActive] = useState<(typeof nav)[number]["id"]>("dashboard");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-background transition-transform md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link to="/" className="text-base font-bold">MockArena</Link>
          <button onClick={() => setOpen(false)} className="md:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => { setActive(n.id); setOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active === n.id ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-[var(--gradient-card)] p-3 text-xs">
          <div className="font-semibold">Admin User</div>
          <div className="text-muted-foreground">admin@mockarena.in</div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="flex-1 md:ml-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md">
          <button onClick={() => setOpen(true)} className="md:hidden"><Menu className="h-5 w-5" /></button>
          <h1 className="text-base font-bold capitalize">{active}</h1>
          <div className="h-8 w-8 rounded-full bg-[var(--gradient-hero)]" />
        </header>

        <main className="p-4 md:p-6">
          {active === "dashboard" && <DashboardView />}
          {active === "questions" && <QuestionsView />}
          {active === "exams" && <ExamsView />}
          {active === "users" && <UsersView />}
          {active === "analytics" && <AnalyticsView />}
        </main>
      </div>
    </div>
  );
}

function DashboardView() {
  const cards = [
    { l: "Total Users", v: "48,231", d: "+12.4%" },
    { l: "Active Today", v: "3,142", d: "+8.1%" },
    { l: "Tests Taken", v: "1.2M", d: "+23.0%" },
    { l: "Revenue (MTD)", v: "₹4.8L", d: "+18.7%" },
  ];
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.l} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="text-xs text-muted-foreground">{c.l}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{c.v}</div>
            <div className="mt-1 text-xs font-semibold text-[var(--success)]">{c.d}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Panel title="Recent activity">
          <ul className="space-y-2 text-sm">
            {["Priya S. completed JEE Mock 01", "New user signup: rahul@gmail.com", "Question bank updated: Physics", "Payment received: ₹9 from Anjali"].map((x) => (
              <li key={x} className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                <span>{x}</span><span className="text-[10px] text-muted-foreground">2m ago</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Top performing tests">
          <ul className="space-y-2 text-sm">
            {mockTests.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                <span className="truncate">{t.title}</span><span className="shrink-0 text-xs font-semibold text-primary">{t.attempts.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function QuestionsView() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-[var(--shadow-card)]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search questions..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <button className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold">
          <Upload className="h-3.5 w-3.5" /> CSV Upload
        </button>
        <button className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> New
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="border-b border-dashed border-border p-5 text-center">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="mt-2 text-sm font-semibold">Drop CSV here to bulk-upload</div>
          <div className="text-xs text-muted-foreground">id, subject, question, opt1..opt4, correct</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Question</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs">Q{1001 + i}</td>
                  <td className="px-4 py-3">{["Physics", "Chemistry", "Maths"][i % 3]}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">A particle moves in a circle of radius 5 m...</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">Medium</span></td>
                  <td className="px-4 py-3 text-right"><MoreVertical className="ml-auto h-4 w-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ExamsView() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {mockTests.map((t) => (
        <div key={t.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="text-[10px] font-semibold uppercase text-primary">{t.subject}</div>
          <div className="mt-1 text-sm font-bold">{t.title}</div>
          <div className="mt-2 text-xs text-muted-foreground">{t.questions} Qs · {t.duration}m · {t.difficulty}</div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-lg border border-border py-1.5 text-xs font-semibold">Edit</button>
            <button className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground">Publish</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersView() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Tests</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {["Priya Sharma", "Rahul Verma", "Anjali Singh", "Karan Mehta", "Sneha Iyer"].map((n, i) => (
              <tr key={n} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--gradient-hero)] text-xs font-bold text-primary-foreground">
                      {n.split(" ").map((x) => x[0]).join("")}
                    </div>
                    <span className="font-semibold">{n}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${i % 2 ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>{i % 2 ? "Paid" : "Free"}</span></td>
                <td className="px-4 py-3 tabular-nums">{12 + i * 7}</td>
                <td className="px-4 py-3 text-muted-foreground">12 May 2026</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const a = [
    { l: "DAU", v: "8,420" }, { l: "Avg session", v: "24m" }, { l: "Conv rate", v: "6.4%" },
    { l: "Pass-test rate", v: "71%" }, { l: "Mobile users", v: "88%" }, { l: "ARPU", v: "₹42" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {a.map((x) => (
        <div key={x.l} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground">{x.l}</div>
          <div className="mt-1 text-2xl font-bold tabular-nums">{x.v}</div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}
