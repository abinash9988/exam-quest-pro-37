
# Premium Student Dashboard — Phase 2 Plan

Build on the existing `/dashboard/*` ecosystem (already has Home, Profile, Mock Tests, Purchases, Subscriptions). Add the missing routes (Results, Rewards, Settings), a full gamification + reward layer, recommendations, and a category-personalization filter. Mock data only.

## New & Updated Routes

```
src/routes/dashboard/results.tsx       (NEW) analytics + charts
src/routes/dashboard/rewards.tsx       (NEW) badge tiers + unlock timeline
src/routes/dashboard/settings.tsx      (NEW) account/notification/privacy
src/routes/dashboard/index.tsx         (UPDATE) add streak, badge, next-reward, recommendations, category filter
src/routes/dashboard/mock-tests.tsx    (UPDATE) status colors (active/expiring/expired), reattempt rule, 15-day validity surface
src/routes/dashboard/purchases.tsx     (UPDATE) SINGLE_TEST vs CATEGORY_SUBSCRIPTION badges, search input, pagination
src/routes/dashboard/profile.tsx       (UPDATE) edit profile / change preferred exam / upload avatar (mock)
```

Each route gets its own `head()` with unique title/description/og.

`DashboardShell` desktop nav + `BottomNavigation` mobile tabs updated to 5: **Home · Mock Tests · Community · Results · Profile**. Add a `/dashboard/community` placeholder route so the link resolves type-safely.

## Mock Data Extensions (`src/lib/studentMock.ts`)

Add to existing file (keep generic, category-driven):

- `Reward` — id, name, icon, badgeThreshold (25/50/75/100/150), unlocked, unlockedAt?
- `Achievement` — id, title, earnedAt, type ("streak" | "badge" | "score" | "reward")
- `ResultEntry` — id, testId, scorePct, accuracy, timeTakenMin, attemptedAt, subjectBreakdown[{subject, scorePct}]
- `SubjectStat` — subject, attempts, avgScore, strength ("weak"|"average"|"strong")
- `Recommendation` — id, type ("test"|"topic"|"challenge"), title, categoryId, reason
- `NotificationPrefs` — email, push, sms, weeklyDigest, streakReminders
- Constants: `REWARD_TIERS`, `BADGE_RULE` (score ≥70% + difficulty ∈ {Medium, Hard}), `TEST_VALIDITY_DAYS = 15`
- Helpers: `getTestStatusColor(validUntil)` → `active|expiring|expired`, `getNextReward(badges)`, `getProgressToNextReward(badges)`

## New Reusable Components (`src/components/student/`)

- `ProgressRing.tsx` — SVG circular progress (used for streak ring, reward progress)
- `RewardCard.tsx` — tier card with lock/unlock state, glow on unlocked, progress bar to threshold
- `AchievementPopup.tsx` — toast-style modal with confetti (CSS-only particles)
- `RecommendationCard.tsx` — suggested test/topic/challenge with reason chip
- `AnalyticsChart.tsx` — wrapper around Recharts (Line / Donut / Bar variants via prop)
- `CategoryFilter.tsx` — horizontal scrollable category chip filter for personalization
- `StreakCalendar.tsx` — 7-day calendar grid with flame icons on active days
- `BadgeShowcase.tsx` — golden badge grid with shimmer animation
- `EditProfileSheet.tsx` — slide-up sheet (Sheet component) for edit profile
- `ConfettiBurst.tsx` — lightweight CSS confetti for reward unlocks

Reuse existing: `DashboardShell`, `DashboardHero`, `StatsCard`, `MockTestCard`, `PurchaseCard`, `CountdownBadge`, `StreakWidget`, `BadgeWidget`, `SectionHeader`.

## Page Composition

**`/dashboard` (updated home)**
1. `DashboardHero` — add Next Reward preview pill ("🎁 Next: T-Shirt — 33 badges to go") + streak flame ring
2. 6 quick stats: Attempts · Avg Score · Active Tests · Purchases · Streak · Accuracy
3. `CategoryFilter` (sticky chip row) → filters Active Tests + Recommendations below
4. Active Mock Tests (horizontal scroll on mobile, grid md+) with status color dots
5. **Recommended for you** — 3 `RecommendationCard`s based on weak subjects
6. Two-column: Recent Purchases + Active Subscriptions
7. CTA banner: Explore categories

**`/dashboard/results`** (NEW)
- Header stats: Best Score · Current Streak · Total Badges · Total Attempts
- Line chart: score trend (last 10 attempts)
- Donut chart: subject accuracy split
- Bar chart: subject comparison (avg score per subject)
- Weekly performance chart
- Weak/Strong subject detection cards
- Rank prediction card (per category, mock %ile)
- Performance timeline (vertical list of recent results with score chip)
- All charts lazy-loaded via `React.lazy` + Suspense

**`/dashboard/rewards`** (NEW)
- Hero: current badges + ring progress to next tier + confetti on hover/unlock
- Tier grid: 5 `RewardCard`s (Sticker → Premium Bag)
- Achievement timeline (vertical, animated)
- Locked rewards desaturated with lock icon; unlocked glow gold

**`/dashboard/settings`** (NEW)
- Tabs/sections: Account · Notifications · Privacy · Appearance · Security
- Change password (mock form), update mobile (mock), notification toggles (Switch), dark mode toggle (reuse `ThemeToggle`), logout all devices button, delete account confirmation
- All form actions are mock (toast feedback via `sonner`)

**`/dashboard/mock-tests`** (update)
- Add status color dot (green/yellow/red) via `getTestStatusColor`
- Add filter chip: "Expiring soon" → tests with daysRemaining ≤ 3
- 15-day validity surfaced on card subtitle

**`/dashboard/purchases`** (update)
- Add type badge: `SINGLE_TEST` vs `CATEGORY_SUBSCRIPTION`
- Search input (filter by item name)
- Simple client-side pagination (10/page)

**`/dashboard/profile`** (update)
- "Edit Profile" button opens `EditProfileSheet` (mock save)
- "Change Preferred Exam" inline category selector
- Avatar uploader (mock — local FileReader preview only)

**`/dashboard/community`** (NEW placeholder) — minimal "Coming soon" page so bottom-nav link is type-safe.

## Design System

- Reuse OKLCH tokens in `src/styles.css`. No raw color literals.
- Indigo/purple gradients: existing `--gradient-hero` and category gradients.
- Glassmorphism: `bg-card/60 backdrop-blur-md border border-white/10` on hero + reward hero only.
- Glow effects: radial blurred blobs + `shadow-[0_0_40px_-10px_oklch(var(--primary)/0.6)]` on unlocked rewards.
- Animations: existing `animate-fade-in`, `hover-scale`; add lightweight CSS keyframes for flame pulse + confetti.
- Mobile-first: 360px tested, sticky bottom nav, `pb-24 md:pb-10` shell padding already in place.
- Dark mode: verified via existing `ThemeToggle`.

## Personalization

`CategoryFilter` writes to `useState` on home page (no global store needed). Filters: Active Tests grid, Recommendations grid, optional Subscriptions list. "All" chip resets. Stored ephemerally; preferred category from `student.preferredCategoryId` is the default selection.

## Performance

- `React.lazy` for the 4 chart components on `/results`
- `MockTestCard` list memoized via `useMemo` on filter changes
- Pagination on Purchases (slice-based, 10/page)
- Recharts already installed; no new packages

## Out of Scope

- Real auth, real payments, real test submission
- Editing `/admin/*`, `/exam/*`, `/mock-test/*`, `/result/*` routes
- Backend persistence — all mutations are toast-only mocks
- Real file uploads — avatar uses FileReader preview only
