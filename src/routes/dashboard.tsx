import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/student/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · MockArena" },
      { name: "description", content: "Your premium learning dashboard — track mock tests, streaks, badges and subscriptions." },
      { property: "og:title", content: "Student Dashboard · MockArena" },
      { property: "og:description", content: "Premium student ecosystem for mock exam practice." },
    ],
  }),
  component: DashboardShell,
});
