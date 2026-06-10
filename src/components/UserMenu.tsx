import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, LayoutDashboard, Shield, User as UserIcon } from "lucide-react";
import { useAuth, type AuthUser } from "@/lib/authStore";

export function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isAdmin = user.role === "admin";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-hero)] text-xs font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:scale-105"
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-elevated)] animate-in fade-in zoom-in-95">
          <div className="border-b border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">{user.name}</div>
              {isAdmin && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                  Admin
                </span>
              )}
            </div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
          <div className="p-1.5">
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  <UserIcon className="h-4 w-4" /> Profile
                </Link>
              </>
            )}
            <button
              onClick={() => {
                signOut();
                setOpen(false);
                navigate({ to: "/" });
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[var(--destructive)] hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
