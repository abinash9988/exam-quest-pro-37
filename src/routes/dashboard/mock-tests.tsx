import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MockTestCard } from "@/components/student/MockTestCard";
import { unlockedTests, categories, daysRemaining, type TestStatus } from "@/lib/studentMock";

export const Route = createFileRoute("/dashboard/mock-tests")({
  head: () => ({
    meta: [
      { title: "My Mock Tests · MockArena" },
      { name: "description", content: "All your unlocked mock tests with progress and validity." },
    ],
  }),
  component: MockTestsPage,
});

type Filter = "all" | TestStatus | "expiring" | string;

function MockTestsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [cat, setCat] = useState<string>("all");

  const filtered = unlockedTests.filter((t) => {
    if (cat !== "all" && t.categoryId !== cat) return false;
    if (filter === "all") return true;
    if (filter === "expiring") return daysRemaining(t.validUntil) >= 0 && daysRemaining(t.validUntil) <= 5;
    return t.status === filter;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "in-progress", label: "In progress" },
    { id: "not-started", label: "Not started" },
    { id: "completed", label: "Completed" },
    { id: "expiring", label: "Expiring soon" },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">My mock tests</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} of {unlockedTests.length} unlocked tests</p>
      </header>

      <div className="space-y-2">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setCat("all")}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              cat === "all" ? "border-primary bg-primary-soft text-primary" : "border-border bg-background text-muted-foreground"
            }`}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                cat === c.id ? "border-primary bg-primary-soft text-primary" : "border-border bg-background text-muted-foreground"
              }`}
            >
              <span className="mr-1">{c.icon}</span>{c.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <div className="text-4xl">📭</div>
          <h3 className="mt-3 text-sm font-bold">No tests match this filter</h3>
          <p className="text-xs text-muted-foreground">Try a different category or status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <MockTestCard key={t.id} test={t} />
          ))}
        </div>
      )}
    </div>
  );
}
