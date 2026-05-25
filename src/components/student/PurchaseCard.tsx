import { Receipt, Download } from "lucide-react";
import { type Purchase, getCategoryById, formatDate } from "@/lib/studentMock";

const statusTone: Record<Purchase["status"], string> = {
  active: "bg-[var(--success)]/15 text-[var(--success)]",
  expired: "bg-muted text-muted-foreground",
  refunded: "bg-destructive/15 text-destructive",
};

export function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const cat = getCategoryById(purchase.categoryId);
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-[var(--shadow-card)] transition hover:border-primary/40">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${cat.gradient} text-base`}>
        {cat.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-semibold">{purchase.item}</div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusTone[purchase.status]}`}>
            {purchase.status}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Receipt className="h-3 w-3" />{purchase.invoiceId}</span>
          <span>·</span>
          <span>{purchase.method}</span>
          <span>·</span>
          <span>{formatDate(purchase.paidAt)}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold tabular-nums">₹{purchase.amount.toLocaleString("en-IN")}</div>
        <button className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
          <Download className="h-3 w-3" /> Invoice
        </button>
      </div>
    </div>
  );
}
