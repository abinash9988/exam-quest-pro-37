import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { communities, hasCommunityAccess } from "@/lib/communityMock";
import { categories } from "@/lib/studentMock";
import { CommunityCard } from "./CommunityCard";

export function CommunitySidebar({ activeSlug }: { activeSlug?: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return communities.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" || c.categoryId === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const joined = filtered.filter((c) => hasCommunityAccess(c.categoryId));
  const locked = filtered.filter((c) => !hasCommunityAccess(c.categoryId));

  return (
    <aside className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search communities…"
          className="h-9 w-full rounded-full border border-border bg-muted/40 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-background"
        />
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {categories.map((c) => (
          <FilterChip key={c.id} label={`${c.icon} ${c.name}`} active={filter === c.id} onClick={() => setFilter(c.id)} />
        ))}
      </div>

      <Section title="Joined" count={joined.length}>
        {joined.length === 0 && <Empty text="No joined communities match." />}
        {joined.map((c) => (
          <CommunityCard key={c.id} community={c} active={c.slug === activeSlug} />
        ))}
      </Section>

      <Section title="Locked" count={locked.length}>
        {locked.length === 0 && <Empty text="All matching communities are unlocked. 🎉" />}
        {locked.map((c) => (
          <CommunityCard key={c.id} community={c} locked />
        ))}
      </Section>
    </aside>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
        active ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "border border-border bg-background text-muted-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-border/60 px-3 py-3 text-center text-xs text-muted-foreground">{text}</p>;
}
