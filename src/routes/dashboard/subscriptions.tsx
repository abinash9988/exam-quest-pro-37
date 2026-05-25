import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionCard } from "@/components/student/SubscriptionCard";
import { PlanCard } from "@/components/student/PlanCard";
import { SectionHeader } from "@/components/student/SectionHeader";
import { subscriptions, upgradePlans, categories } from "@/lib/studentMock";

export const Route = createFileRoute("/dashboard/subscriptions")({
  head: () => ({
    meta: [
      { title: "Subscriptions · MockArena" },
      { name: "description", content: "Manage your active plans and explore upgrade options." },
    ],
  }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const active = subscriptions.filter((s) => s.status === "active");
  const expired = subscriptions.filter((s) => s.status === "expired");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">Unlock entire exam categories with one plan.</p>
      </header>

      <section>
        <SectionHeader title="Active plans" subtitle={`${active.length} categories unlocked`} />
        <div className="grid gap-3 md:grid-cols-2">
          {active.map((s) => (
            <SubscriptionCard key={s.id} sub={s} />
          ))}
        </div>
      </section>

      {expired.length > 0 && (
        <section>
          <SectionHeader title="Expired" />
          <div className="grid gap-3 md:grid-cols-2">
            {expired.map((s) => (
              <SubscriptionCard key={s.id} sub={s} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Upgrade your plan" subtitle="Choose what fits your prep journey" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upgradePlans.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="text-sm font-bold">Subscribe by exam category</h3>
        <p className="text-xs text-muted-foreground">Pick any category to view dedicated plans.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => (
            <button key={c.id} className={`group rounded-2xl bg-gradient-to-br ${c.gradient} p-3 text-left text-white shadow-[var(--shadow-soft)] transition hover:scale-[1.02]`}>
              <div className="text-xl">{c.icon}</div>
              <div className="mt-1 text-sm font-bold">{c.name}</div>
              <div className="text-[10px] opacity-80">From ₹149/mo</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
