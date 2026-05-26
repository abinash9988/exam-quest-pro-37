import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PurchaseCard } from "@/components/student/PurchaseCard";
import { purchases, type Purchase } from "@/lib/studentMock";
import { Wallet, TrendingUp, Receipt, Search, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/purchases")({
  head: () => ({
    meta: [
      { title: "Purchases · MockArena" },
      { name: "description", content: "Your payment history, invoices and subscription orders." },
    ],
  }),
  component: PurchasesPage,
});

type F = "all" | Purchase["type"] | Purchase["status"];
const PAGE = 5;

const TYPE_LABEL: Record<Purchase["type"], string> = {
  test: "SINGLE_TEST",
  subscription: "CATEGORY_SUBSCRIPTION",
};

function PurchasesPage() {
  const [filter, setFilter] = useState<F>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return purchases.filter((p) => {
      if (q && !p.item.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "all") return true;
      if (filter === "test" || filter === "subscription") return p.type === filter;
      return p.status === filter;
    });
  }, [filter, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageItems = filtered.slice((page - 1) * PAGE, page * PAGE);

  const total = purchases.reduce((s, p) => s + (p.status !== "refunded" ? p.amount : 0), 0);
  const active = purchases.filter((p) => p.status === "active").length;

  const tabs: { id: F; label: string }[] = [
    { id: "all", label: "All" },
    { id: "test", label: "Single Tests" },
    { id: "subscription", label: "Subscriptions" },
    { id: "active", label: "Active" },
    { id: "expired", label: "Expired" },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Purchase history</h1>
        <p className="text-sm text-muted-foreground">All your transactions, invoices and order status.</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)]">
          <Wallet className="h-4 w-4 text-primary" />
          <div className="mt-2 text-xl font-bold tabular-nums">₹{total.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-muted-foreground">Total spent</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)]">
          <Receipt className="h-4 w-4 text-[var(--review)]" />
          <div className="mt-2 text-xl font-bold tabular-nums">{purchases.length}</div>
          <div className="text-[11px] text-muted-foreground">Orders</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)]">
          <TrendingUp className="h-4 w-4 text-[var(--success)]" />
          <div className="mt-2 text-xl font-bold tabular-nums">{active}</div>
          <div className="text-[11px] text-muted-foreground">Active</div>
        </div>
      </div>

      {/* search + filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search by item name…"
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus:border-primary"
          />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setFilter(t.id); setPage(1); }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <div className="text-4xl">🧾</div>
          <h3 className="mt-3 text-sm font-bold">No purchases match</h3>
          <p className="text-xs text-muted-foreground">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pageItems.map((p) => (
            <div key={p.id} className="space-y-1">
              <div className="flex items-center gap-2 pl-1 text-[10px] font-bold uppercase tracking-wider">
                <span className={`rounded-md px-1.5 py-0.5 ${p.type === "subscription" ? "bg-[var(--review)]/15 text-[var(--review)]" : "bg-primary-soft text-primary"}`}>
                  {TYPE_LABEL[p.type]}
                </span>
              </div>
              <PurchaseCard purchase={p} />
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
