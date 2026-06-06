import { Link, Outlet, useParams, useRouterState } from "@tanstack/react-router";
import { GraduationCap, Bell, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNavigation } from "@/components/student/BottomNavigation";
import { student } from "@/lib/studentMock";
import { CommunitySidebar } from "./CommunitySidebar";

export function CommunityShell() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const params = useParams({ strict: false }) as { slug?: string };
  const isFeed = !!params.slug;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-primary-soft/30 pb-24 lg:pb-6">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            {isFeed && (
              <Link to="/community" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background hover:bg-muted lg:hidden" aria-label="Back to communities">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elevated)]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="hidden text-base font-bold tracking-tight sm:inline">MockArena</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { to: "/dashboard", label: "Home" },
              { to: "/dashboard/mock-tests", label: "Mock Tests" },
              { to: "/community", label: "Community" },
              { to: "/dashboard/results", label: "Results" },
              { to: "/dashboard/profile", label: "Profile" },
            ].map((n) => {
              const active = n.to === "/community" ? path.startsWith("/community") : path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-background hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <ThemeToggle />
            <Link to="/dashboard/profile" className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-hero)] text-xs font-bold text-primary-foreground" aria-label="Profile">
              {student.avatar}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 lg:py-6">
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar — hidden on mobile when viewing a feed */}
          <div className={`${isFeed ? "hidden lg:block" : ""}`}>
            <CommunitySidebar activeSlug={params.slug} />
          </div>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
