import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PurchaseCard } from "@/components/student/PurchaseCard";
import { purchases, type Purchase } from "@/lib/studentMock";
import { Wallet, TrendingUp, Receipt } from "lucide-react";

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

function PurchasesPage() {
  const [filter, setFilter] = useState<F>("all");

  const filtered = purchases.filter((p) => {
    if (filter === "all") return true;
    if (filter === "test" || filter === "subscription") return p.type === filter;
    return p.status === filter;
  });

  const total = purchases.reduce((s, p) => s + (p.status !== "refunded" ? p.amount : 0), 0);
  const active = purchases.filter((p) => p.status === "active").length;

  const tabs: { id: F; label: string }[] = [
    { id: "all", label: "All" },
    { id: "test", label: "Tests" },
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

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <PurchaseCard key={p.id} purchase={p} />
        ))}
      </div>
    </div>
  );
}
