import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { categories, mockTests, faqs } from "@/lib/mockData";
import { ChevronDown, Clock, FileText, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/mock-test/$slug")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.cat.fullName} Mock Tests · Free Practice | MockArena` },
      { name: "description", content: `${loaderData.cat.testCount} ${loaderData.cat.fullName} mock tests. ${loaderData.cat.description} Start free now.` },
    ] : [],
  }),
  component: DetailPage,
  notFoundComponent: () => <div className="grid min-h-screen place-items-center">Category not found</div>,
});

function DetailPage() {
  const { cat } = Route.useLoaderData();
  const [diff, setDiff] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const tests = mockTests.filter((t) => t.category === cat.slug);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="text-xs text-muted-foreground">
          <Link to="/mock-test" className="hover:text-primary">Mock Tests</Link> / <span className="text-foreground">{cat.name}</span>
        </nav>

        <header className="mt-4 overflow-hidden rounded-3xl border border-border bg-[var(--gradient-card)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-4">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${cat.color} text-2xl`}>{cat.icon}</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{cat.fullName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat icon={FileText} label="Mock Tests" value={cat.testCount.toString()} />
            <Stat icon={BookOpen} label="Subjects" value="4" />
            <Stat icon={TrendingUp} label="Avg. Score" value="68%" />
          </div>
        </header>

        <section className="mt-6">
          <h2 className="text-lg font-bold">Choose difficulty</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDiff(d)}
                className={`rounded-2xl border-2 p-3 text-sm font-semibold transition ${
                  diff === d ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-bold">Available tests</h2>
          <div className="mt-3 space-y-2.5">
            {tests.length === 0 && <p className="text-sm text-muted-foreground">Sample tests coming soon. Try other categories.</p>}
            {tests.map((t) => (
              <Link
                key={t.id}
                to="/exam/$examId"
                params={{ examId: t.id }}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition hover:border-primary"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{t.title}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration}m</span>
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{t.questions} Qs</span>
                    <span>{t.difficulty}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold">Frequently asked</h2>
          <div className="mt-3 space-y-2">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/60 p-3 text-center backdrop-blur">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <div className="mt-1 text-lg font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-semibold">
        {q}
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-4 pb-4 text-sm text-muted-foreground">{a}</p>}
    </div>
  );
}
