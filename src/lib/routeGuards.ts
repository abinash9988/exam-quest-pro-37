import { redirect } from "@tanstack/react-router";
import { authStore } from "./authStore";

export function requireStudent({ location }: { location: { href: string } }) {
  const user = authStore.getUser();
  if (!user) {
    throw redirect({ to: "/auth", search: { mode: "signin", redirect: location.href } });
  }
  if (user.role === "admin") {
    throw redirect({ to: "/admin" });
  }
}

export function requireAdmin({ location }: { location: { href: string } }) {
  const user = authStore.getUser();
  if (!user) {
    throw redirect({ to: "/auth", search: { mode: "signin", redirect: location.href } });
  }
  if (user.role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }
}
