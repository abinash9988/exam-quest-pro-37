# Premium Student Dashboard Plan

Build a modern edtech Student Dashboard ecosystem under `/dashboard/*` with 5 routes, reusable widgets, dark-gradient aesthetic, and mock JSON data. Replaces the current basic `/dashboard` route.

## Routes (TanStack Start file-based)

```
src/routes/dashboard.tsx                  → layout (Outlet + DashboardShell + BottomNavigation)
src/routes/dashboard/index.tsx            → main dashboard
src/routes/dashboard/profile.tsx          → profile page
src/routes/dashboard/mock-tests.tsx       → unlocked tests, resume, reattempt
src/routes/dashboard/purchases.tsx        → purchase + payment history
src/routes/dashboard/subscriptions.tsx    → active plans + upgrade cards
```

Each route gets its own `head()` with distinct title/description/og meta.

## Mock Data (`src/lib/studentMock.ts`)

Single source of truth. Generic-by-category (no hardcoded JEE/NEET logic — driven by a `categories` array):

- `Student` — name, email, mobile, avatar, joinedAt, preferredCategoryId, streakDays, goldenBadges, loginMethods[]
- `Category` — id, name, slug, icon, gradient (e.g. JEE, NEET, SSC, Banking, UPSC as seed data only)
- `UnlockedTest` — id, name, categoryId, difficulty, validUntil, status (`not-started`|`in-progress`|`completed`), progressPct, attemptsLeft
- `Purchase` — id, item, type (`test`|`subscription`), categoryId, amount, paidAt, method, status (`active`|`expired`|`refunded`)
- `Subscription` — id, categoryId, planName, startedAt, expiresAt, benefits[], status
- `Plan` (upgrade cards) — id, name, price, features[], highlight
- `DashboardStats` — activeTests, avgScore, accuracy, totalAttempts, communityPosts, rankPercentile
- Helpers: `daysRemaining(date)`, `getCategoryById(id)`

## Reusable Components (`src/components/student/`)

- `DashboardShell.tsx` — sticky top bar (logo, search, theme toggle, avatar), responsive container, bottom padding for mobile nav
- `BottomNavigation.tsx` — mobile-only (md:hidden), 5 tabs: Home, Mock Tests, Community, Results, Profile. Active-state highlight.
- `DashboardHero.tsx` — gradient bg + animated glow blobs (CSS), glass card overlay; greeting based on time-of-day, name, preferred category chip, streak + badge widgets, active subscription pill
- `StreakWidget.tsx` — 🔥 + count, gradient ring
- `BadgeWidget.tsx` — 🏅 + count
- `CountdownBadge.tsx` — pill showing "Xd left" / "Expires today" / "Expired", color-coded
- `StatsCard.tsx` — icon, label, value, delta, tone variant (primary/success/warning/review)
- `MockTestCard.tsx` — name, category chip, difficulty, validity countdown, primary CTA (Continue / Start / Reattempt based on status), progress bar
- `PurchaseCard.tsx` — item, amount, paidAt, method, status badge, category chip
- `SubscriptionCard.tsx` — plan name, category, benefits list, expiry countdown, manage button
- `ProfileCard.tsx` — avatar, name, email/mobile, joined date, login methods (Email/Mobile/Google icons), preferred category, stat strip
- `PlanCard.tsx` — upgrade plan tile with features + CTA (used on subscriptions page)
- `SectionHeader.tsx` — title + optional "View all" link

## Page Composition

**`/dashboard`**
1. `DashboardHero` (full width)
2. 6 `StatsCard` grid: Active Tests, Avg Score, Accuracy, Total Attempts, Subscription Status, Community Activity
3. "Active Mock Tests" section — horizontal scroll on mobile, grid on md+, `MockTestCard` x N
4. Two-column (md+): Recent Purchases (compact list of `PurchaseCard`) + Active Subscriptions (compact `SubscriptionCard`)
5. CTA banner: "Explore more categories"

**`/dashboard/profile`** — `ProfileCard` + tabs/sections: Login methods, Streak stats (with mini chart), Purchase count summary, Preferred category selector (mock).

**`/dashboard/mock-tests`** — Filter chips (All / In Progress / Completed / Expiring soon), grid of `MockTestCard`. Empty state.

**`/dashboard/purchases`** — Filter (All / Tests / Subscriptions / Active / Expired), payment history table on desktop, `PurchaseCard` list on mobile. Total spent summary tile.

**`/dashboard/subscriptions`** — Active subscriptions grid + "Upgrade your plan" section with 3 `PlanCard` tiers.

## Design System

- Reuse existing OKLCH tokens in `src/styles.css` (primary, gradient-hero, success, warning, review, shadow-card, shadow-soft). No new color literals in components — use tokens.
- Hero: `bg-[var(--gradient-hero)]` with absolutely-positioned blurred radial blobs animated via existing `animate-pulse` / new `animate-fade-in`.
- Glassmorphism: `bg-card/60 backdrop-blur-md border border-white/10` over hero only — applied lightly elsewhere.
- Dark mode: already supported via `ThemeToggle`; verify contrast on hero blobs.
- Animations: `animate-fade-in`, `hover-scale`, `transition-transform` per existing utility set.
- Mobile-first: stacked layouts, horizontal scroll lanes, sticky bottom nav with `pb-20 md:pb-8` on shells.

## Integration Notes

- Update `src/components/BottomNav.tsx` global nav: leave site-wide nav as-is; the dashboard uses its own `BottomNavigation` inside `DashboardShell` (hide global one on `/dashboard/*` via path check, or simply rely on dashboard shell's own bar — will hide global BottomNav on `/dashboard` paths to avoid duplication).
- Navbar link to `/dashboard` already exists.
- `routeTree.gen.ts` is auto-generated — do not edit.
- No backend; all data from `studentMock.ts`. No new packages required (Recharts already installed for profile mini-chart).

## Out of Scope

- Real auth, real payments, real test-taking changes.
- Editing existing `/admin`, `/exam`, `/mock-test`, `/result` routes.
- Community page content (bottom-nav link can route to `/dashboard` placeholder or `#`).
