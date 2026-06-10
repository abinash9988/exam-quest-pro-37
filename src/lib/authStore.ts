import { useSyncExternalStore } from "react";

export type AuthRole = "student" | "admin";
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

export const ADMIN_EMAILS = ["admin@mockarena.in"];
const ADMIN_PASSWORD = "admin123";
const AUTH_KEY = "mockarena-auth";

const listeners = new Set<() => void>();

function read(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function write(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === AUTH_KEY) listeners.forEach((l) => l());
  });
}

export const authStore = {
  getUser: read,
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  signIn({ email, password }: { email: string; password: string }) {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) throw new Error("Email and password are required");
    const isAdmin = ADMIN_EMAILS.includes(normalized);
    if (isAdmin && password !== ADMIN_PASSWORD) {
      throw new Error("Invalid admin credentials");
    }
    const user: AuthUser = {
      id: normalized,
      name: isAdmin ? "Admin" : normalized.split("@")[0],
      email: normalized,
      role: isAdmin ? "admin" : "student",
    };
    write(user);
    return user;
  },
  signUp({ name, email, password }: { name: string; email: string; password: string }) {
    const normalized = email.trim().toLowerCase();
    if (!name.trim() || !normalized || !password) throw new Error("All fields are required");
    const isAdmin = ADMIN_EMAILS.includes(normalized);
    if (isAdmin && password !== ADMIN_PASSWORD) {
      throw new Error("This email is reserved");
    }
    const user: AuthUser = {
      id: normalized,
      name: name.trim(),
      email: normalized,
      role: isAdmin ? "admin" : "student",
    };
    write(user);
    return user;
  },
  signOut() {
    write(null);
  },
};

export function useAuth() {
  const user = useSyncExternalStore(
    authStore.subscribe,
    authStore.getUser,
    () => null,
  );
  return {
    user,
    signIn: authStore.signIn,
    signUp: authStore.signUp,
    signOut: authStore.signOut,
  };
}
