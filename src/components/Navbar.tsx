import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/authStore";
import { UserMenu } from "@/components/UserMenu";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-hero)] text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight">MockArena</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          <Link to="/mock-test" className="text-muted-foreground transition-colors hover:text-foreground">
            Mock Tests
          </Link>

          {user && !isAdmin && (
            <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
              Admin
            </Link>
          )}

          <ThemeToggle />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-full border border-border bg-card px-4 py-2 text-foreground transition hover:bg-muted"
              >
                Sign Up
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]"
              >
                Start Free
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {user && <UserMenu user={user} />}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-3 text-sm">
            <Link to="/mock-test" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">
              Mock Tests
            </Link>
            {user && !isAdmin && (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-muted">
                Admin
              </Link>
            )}
            {!user && (
              <>
                <Link
                  to="/auth"
                  search={{ mode: "signin" }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-muted"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary px-3 py-2 text-center font-semibold text-primary-foreground"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
