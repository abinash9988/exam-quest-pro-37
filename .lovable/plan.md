
# Community System — Implementation Plan

Extends the existing Student Dashboard. The `/dashboard/community` placeholder is replaced by a full community ecosystem with category-scoped discussion rooms, access gating based on purchases/subscriptions, and a study-focused (non-social-media) UI.

## Routes

```
src/routes/community.tsx                 (NEW) layout: sidebar + <Outlet /> + right rail
src/routes/community/index.tsx           (NEW) overview: joined + locked + discover
src/routes/community/$slug.tsx           (NEW) feed for jee/neet/ssc/banking/upsc
src/routes/dashboard/community.tsx       (UPDATE) becomes a redirect → /community
```

Slug-driven, not 5 hardcoded files — scales to any future category. Validates `params.slug` against `categories[].slug`; unknown slug → `notFound()`. Each route gets its own `head()` with unique title + description + og.

`BottomNavigation.tsx` Community tab repoints to `/community`. `DashboardShell` desktop nav same. Top `BottomNav.tsx` visibility logic extended to also hide on `/community/*`.

## Access Gating

Pure derived logic in `src/lib/communityMock.ts`:

```ts
hasCommunityAccess(categoryId): boolean
  = subscriptions.some(s => s.categoryId === categoryId && s.status === "active")
  || purchases.some(p => p.categoryId === categoryId && p.status === "active")
```

- Unlocked → full feed + composer.
- Locked → `LockedCommunityCard` with category banner, lock icon, message ("Purchase any mock test or subscribe to unlock"), and two CTAs → `/dashboard/mock-tests` and `/dashboard/subscriptions`. No feed mounted.

Helpers exported: `joinedCommunities()`, `lockedCommunities()`, `getCommunityBySlug(slug)`.

## Mock Data (`src/lib/communityMock.ts`)

New file (keeps `studentMock.ts` clean). Reuses existing `categories`, `purchases`, `subscriptions`, `student`.

Types:
- `Community` — id, categoryId, name (e.g. "JEE Aspirants"), tagline, bannerGradient, activeMembers, totalDiscussions, dailyMessages
- `Message` — id, communityId, authorName, authorInitials, text, sentAt, isPinned?
- `PinnedItem` — id, communityId, kind ("daily"|"alert"|"motivation"|"announcement"), title, body, postedAt
- `TopContributor` — name, initials, messages, badges
- `WeeklyActivityPoint` — day, messages

Constants: `MAX_MESSAGE_LEN = 500`, `MESSAGES_PER_PAGE = 30`, `POLL_INTERVAL_MS = 12000`.

Seed ~40 messages per community (study-focused: "Anyone solved Q22 from JEE 2023 paper?", "Sharing my Bio revision schedule…"), 3-4 pinned items per community, 5 contributors, 7-day activity series.

## Reusable Components (`src/components/community/`)

- `CommunityShell.tsx` — desktop 3-col grid (`sidebar | feed | stats`), mobile single column with sticky composer; consumes `<Outlet />`
- `CommunitySidebar.tsx` — search input, category chip filters, Joined / Locked sections, each row uses `CommunityCard`
- `CommunityCard.tsx` — compact row: gradient dot, name, member count, lock badge if locked, active indicator
- `CommunityBanner.tsx` — gradient header per community with name, tagline, member/discussion counts
- `DiscussionFeed.tsx` — virtualized message list (windowed via simple slice + IntersectionObserver "load more"), groups by day with date separators
- `MessageBubble.tsx` — three-line layout only: bold name · small time · text. No avatars, no reactions, no replies, no media
- `StickyMessageInput.tsx` — sticky bottom textarea, send button, live `current / MAX_MESSAGE_LEN` counter, disabled when over limit or empty; on send appends to local state + toast
- `PinnedMessageCard.tsx` — color-coded by `kind`, pin icon, collapsible body
- `CommunityStatsCard.tsx` — right rail: active students, total discussions, daily messages
- `ActivityGraph.tsx` — lightweight 7-day bar chart via Recharts `BarChart` (lazy-loaded)
- `LockedCommunityCard.tsx` — premium lock state + unlock CTAs
- `TopContributorsList.tsx` — name + initials chip + message count
- `EngagementStrip.tsx` — streak highlight, top badge earners, daily motivation banner, weekly challenge card (horizontal scroll on mobile)

## Page Composition

**`/community` (overview)**
- `CommunityBanner` (generic gradient) with greeting
- "Your Communities" grid → joined `CommunityCard`s linking to `/community/$slug`
- "Locked Communities" grid → `LockedCommunityCard`s
- `EngagementStrip` at bottom

**`/community/$slug` (feed)**
- Access check first. If locked → `LockedCommunityCard` full-bleed, no feed.
- Else: `CommunityBanner` (category-themed) → `PinnedMessageCard` carousel (daily discussion + alerts) → `DiscussionFeed` → `StickyMessageInput`
- Right rail (desktop only): `CommunityStatsCard`, `ActivityGraph`, `TopContributorsList`, mini `EngagementStrip`

## State & "Live" Behavior (mock)

- Messages held in `useState`, seeded from mock data per slug
- `setInterval` every `POLL_INTERVAL_MS` injects 0–2 simulated incoming messages (round-robin from a canned pool of study lines) — gives a "live" feel without any backend
- New user-sent messages prepended/appended locally + toast confirmation
- Pagination: initial 30 messages, "Load earlier" button slices next page

## Performance

- Slug route uses `React.useMemo` for filtered messages
- `ActivityGraph` lazy-loaded via `React.lazy` + Suspense (Recharts is heavy)
- Polling cleared on unmount
- Message list windowed by page slice (no full re-render on append)
- No avatars/media → minimal DOM weight per bubble

## Design System

- Reuse OKLCH tokens. Gradients from each `category.gradient` for banner and accents
- Glassmorphism only on `CommunityBanner` and right-rail stat card
- Mobile-first: 360px tested, sticky composer above bottom nav (`bottom-[var(--bottomnav-h)]`)
- Dark-mode verified, no raw color literals

## Out of Scope

- Real auth, real messaging backend, real-time websockets
- Reactions, likes, DMs, follows, media, profile photos — explicitly excluded per spec
- Editing `/admin/*`, `/exam/*`, `/mock-test/*`, `/result/*`
- Persistence — messages reset on reload

## Files Created
- `src/lib/communityMock.ts`
- `src/components/community/` (12 components listed above)
- `src/routes/community.tsx`, `src/routes/community/index.tsx`, `src/routes/community/$slug.tsx`

## Files Edited
- `src/routes/dashboard/community.tsx` → redirect to `/community`
- `src/components/student/BottomNavigation.tsx` (community tab href)
- `src/components/student/DashboardShell.tsx` (nav link)
- `src/components/BottomNav.tsx` (hide on `/community/*`)
