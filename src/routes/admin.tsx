import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/routeGuards";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · MockArena" }] }),
  beforeLoad: requireAdmin,
  component: AdminShell,
});
