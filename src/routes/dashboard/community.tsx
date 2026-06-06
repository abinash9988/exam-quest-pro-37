import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/community")({
  beforeLoad: () => {
    throw redirect({ to: "/community" });
  },
});
