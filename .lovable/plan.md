## Frontend-Only Auth System

Mock authentication stored in `localStorage`. No backend. Hardcoded admin emails decide role on login. Admins go to `/admin`, students go to `/dashboard`.

### 1. Auth store (`src/lib/authStore.ts` — new)

- Types: `AuthUser = { id, name, email, role: "student" | "admin", avatar? }`.
- Constants: `ADMIN_EMAILS = ["admin@mockarena.in"]`, `AUTH_KEY = "mockarena-auth"`.
- Tiny pub/sub store: `getUser()`, `signIn({email, password})`, `signUp({name, email, password})`, `signOut()`, `subscribe(cb)`.
- `signIn` / `signUp`: validate inputs, derive role from `ADMIN_EMAILS.includes(email)`, persist to `localStorage`, notify subscribers. No password verification (mock) — any non-empty password works; for admin, require password === `admin123` so it isn't trivially bypassed in a demo.
- Hook: `useAuth()` returns `{ user, signIn, signUp, signOut }` using `useSyncExternalStore`.

### 2. Auth page (`src/routes/auth.tsx` — new)

- Public route `/auth` with two tabs: **Sign In** and **Sign Up** (controlled by `?mode=signin|signup` search param).
- Sign In: email + password. Sign Up: name + email + password + confirm.
- Zod validation, inline errors, show/hide password.
- On success:
  - `role === "admin"` → `navigate({ to: "/admin" })`
  - `role === "student"` → `navigate({ to: "/dashboard" })`
- Small helper text under Sign In: "Admin? Use your admin email." (no credentials shown).
- Premium glassmorphism card matching existing design tokens (`--gradient-hero`, `--shadow-elevated`).

### 3. Header (`src/components/Navbar.tsx` — edit)

Logged OUT:

- Logo + MockArena · Mock Tests · **Sign In** (ghost) · **Sign Up** (outline) · ThemeToggle · **Start Free** (primary, links to `/auth?mode=signup`).
- Remove `Dashboard` and `Admin` links from the public header.

Logged IN (student):

- Logo + MockArena · Mock Tests · Dashboard · ThemeToggle · **Avatar menu** (initials circle) with dropdown: name/email header, "Dashboard", "Profile", "Logout".

Logged IN (admin):

- Logo + MockArena · Admin · ThemeToggle · Avatar menu (Admin badge) with "Admin Panel", "Logout".

Mobile menu mirrors the same logic.

### 4. Route guards

Create `src/lib/routeGuards.ts` with `requireStudent()` and `requireAdmin()` that read `localStorage` synchronously and call TanStack's `redirect({ to: "/auth", search: { redirect: location.href } })` from `beforeLoad`.

Apply in existing parent routes:

- `src/routes/dashboard.tsx` → `beforeLoad: requireStudent` (admins also redirected to `/admin`, not allowed in dashboard per user requirement).
- `src/routes/admin.tsx` → `beforeLoad: requireAdmin`.

Public routes untouched: `/`, `/mock-test`, `/mock-test/$slug`, `/community/*`, `/auth`.

### 5. Landing page CTAs (`src/routes/index.tsx` — minor edit)

Wire any "Sign Up" / "Get Started" / hero CTAs to `/auth?mode=signup` and "Sign In" to `/auth?mode=signin`. Keep all existing copy and layout otherwise.

### 6. Logout flow

Avatar menu → Logout: clears `localStorage` auth key, notifies subscribers, `navigate({ to: "/" })`.

---

### Files

**New:** `src/lib/authStore.ts`, `src/lib/routeGuards.ts`, `src/routes/auth.tsx`, `src/components/UserMenu.tsx`.
**Edited:** `src/components/Navbar.tsx`, `src/routes/dashboard.tsx`, `src/routes/admin.tsx`, `src/routes/index.tsx` (CTA links only).

### Out of scope

Real backend, password reset, email verification, OAuth, persistent user database, profile editing beyond what already exists.