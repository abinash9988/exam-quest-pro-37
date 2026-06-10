import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/student/DashboardShell";
import { requireStudent } from "@/lib/routeGuards";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · MockArena" },
      { name: "description", content: "Your premium learning dashboard — track mock tests, streaks, badges and subscriptions." },
      { property: "og:title", content: "Student Dashboard · MockArena" },
      { property: "og:description", content: "Premium student ecosystem for mock exam practice." },
    ],
  }),
  beforeLoad: requireStudent,
  component: DashboardShell,
});
