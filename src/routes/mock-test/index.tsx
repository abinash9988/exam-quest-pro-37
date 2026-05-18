import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { mockTests, categories } from "@/lib/mockData";
import { Search, Clock, FileText, Users, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/mock-test/")({
  head: () => ({
    meta: [
      { title: "All Mock Tests · JEE, NEET, SSC, UPSC, Banking | MockArena" },
      { name: "description", content: "Browse 500+ mock tests across competitive exams. Filter by difficulty and start practising free." },
    ],
  }),
  component: ListingPage,
});

const diffs = ["All", "Easy", "Medium", "Hard"] as const;

function ListingPage() {
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<(typeof diffs)[number]>("All");

  const filtered = useMemo(() => mockTests.filter((t) => {
    const matchQ = !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.subject.toLowerCase().includes(q.toLowerCase());
    const matchD = diff === "All" || t.difficulty === diff;
    return matchQ && matchD;
  }), [q, diff]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight">Mock Tests</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} tests available</p>

        <div className="sticky top-14 z-20 -mx-4 mt-4 bg-background/95 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-3 shadow-[var(--shadow-card)]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tests, subjects..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {diffs.map((d) => (
              <button
                key={d}
                onClick={() => setDiff(d)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  diff === d ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {d}
              </button>
            ))}
            <div className="ml-2 h-6 w-px shrink-0 bg-border" />
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/mock-test/$slug"
                params={{ slug: c.slug }}
                className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TestCard key={t.id} t={t} />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function TestCard({ t }: { t: (typeof mockTests)[number] }) {
  const diffColor = t.difficulty === "Easy" ? "bg-[var(--success)]/10 text-[var(--success)]" : t.difficulty === "Medium" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-destructive/10 text-destructive";
  return (
    <div className="group rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t.subject}</div>
          <h3 className="mt-0.5 text-base font-bold leading-snug">{t.title}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${diffColor}`}>{t.difficulty}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{t.duration} min</span>
        <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{t.questions} Qs</span>
        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{(t.attempts / 1000).toFixed(1)}k</span>
      </div>
      <Link
        to="/exam/$examId"
        params={{ examId: t.id }}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition group-hover:scale-[1.01]"
      >
        Start Test <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
