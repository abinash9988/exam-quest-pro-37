import { createFileRoute } from "@tanstack/react-router";
import { Users, MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/community")({
  head: () => ({
    meta: [
      { title: "Community · MockArena" },
      { name: "description", content: "Connect with fellow aspirants — coming soon." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-[var(--gradient-card)] p-8 text-center md:p-16">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="relative">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elevated)]">
          <Users className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Community is coming soon</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Discussion threads, study groups, doubt clearing, and weekly challenges with thousands of fellow aspirants — all in one place.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary"><MessageCircle className="h-3 w-3" /> Doubt threads</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/15 px-3 py-1 font-semibold text-[var(--warning)]"><Sparkles className="h-3 w-3" /> Weekly challenges</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/15 px-3 py-1 font-semibold text-[var(--success)]"><Users className="h-3 w-3" /> Study groups</span>
        </div>
      </div>
    </div>
  );
}
