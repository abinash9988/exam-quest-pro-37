import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, BarChart3, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/mock-test", label: "Tests", icon: BookOpen },
  { to: "/dashboard", label: "Stats", icon: BarChart3 },
  { to: "/admin", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  // Hide on exam page and dashboard (dashboard has its own bottom nav)
  if (path.startsWith("/exam/") || path.startsWith("/dashboard")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link key={to} to={to} className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium">
              <Icon className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={active ? "text-primary" : "text-muted-foreground"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
