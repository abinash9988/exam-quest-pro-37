import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, FileText, Upload, Menu, X, Plus, Search, ChevronRight, History } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/questions", label: "Questions", icon: FileText },
  { to: "/admin/import", label: "Import", icon: Upload, exact: true },
  { to: "/admin/import/history", label: "Import history", icon: History },
];

export function AdminShell() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-background transition-transform md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--gradient-hero)] text-xs text-primary-foreground">M</span>
            MockArena
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-3 py-3">
          <Link
            to={"/admin/questions/create" as string}
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New Question
          </Link>
        </div>

        <nav className="space-y-1 px-3">
          <div className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Manage</div>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(n.to, n.exact)
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-[var(--gradient-card)] p-3 text-xs">
          <div className="font-semibold">Admin User</div>
          <div className="text-muted-foreground">admin@mockarena.in</div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setOpen(true)} className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <nav className="flex items-center gap-1 text-xs text-muted-foreground overflow-hidden">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1 truncate">
                  {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
                  <span className={i === crumbs.length - 1 ? "font-semibold text-foreground capitalize" : "capitalize"}>
                    {decodeURIComponent(c)}
                  </span>
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs sm:flex">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input placeholder="Search…" className="w-40 bg-transparent outline-none" />
            </div>
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-[var(--gradient-hero)]" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
