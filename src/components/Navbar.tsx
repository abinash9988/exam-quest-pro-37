import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-hero)] text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight">MockArena</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/mock-test" className="text-muted-foreground transition-colors hover:text-foreground">Mock Tests</Link>
          <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          <Link to="/admin" className="text-muted-foreground transition-colors hover:text-foreground">Admin</Link>
          <ThemeToggle />
          <Link to="/mock-test" className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]">Start Free</Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="grid h-9 w-9 place-items-center rounded-lg border border-border">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-3 text-sm">
            <Link to="/mock-test" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">Mock Tests</Link>
            <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">Dashboard</Link>
            <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">Admin</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
