import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { GraduationCap, Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNavigation } from "./BottomNavigation";
import { student } from "@/lib/studentMock";

export function DashboardShell() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-primary-soft/30 pb-24 md:pb-10">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elevated)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="hidden text-base font-bold tracking-tight sm:inline">MockArena</span>
          </Link>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search tests, subjects, mentors..."
              className="h-9 w-full rounded-full border border-border bg-muted/40 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background"
            />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { to: "/dashboard", label: "Home", exact: true },
              { to: "/dashboard/mock-tests", label: "Mock Tests" },
              { to: "/dashboard/purchases", label: "Purchases" },
              { to: "/dashboard/subscriptions", label: "Plans" },
              { to: "/dashboard/profile", label: "Profile" },
            ].map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
            <Link
              to="/dashboard/profile"
              className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-hero)] text-xs font-bold text-primary-foreground"
              aria-label="Profile"
            >
              {student.avatar}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 md:py-8">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}
