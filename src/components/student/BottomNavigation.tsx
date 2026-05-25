import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Users, BarChart3, User } from "lucide-react";

const items: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/dashboard", label: "Home", icon: Home, exact: true },
  { to: "/dashboard/mock-tests", label: "Tests", icon: BookOpen },
  { to: "/dashboard/subscriptions", label: "Community", icon: Users },
  { to: "/dashboard/purchases", label: "Results", icon: BarChart3 },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export function BottomNavigation() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? path === to : path.startsWith(to);
          return (
            <Link key={to} to={to} className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium">
              {active && (
                <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-[var(--gradient-hero)]" />
              )}
              <Icon className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={active ? "text-primary" : "text-muted-foreground"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
