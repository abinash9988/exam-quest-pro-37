# Admin CMS — Enterprise Workflow & Moderation Upgrade

Extend the existing Admin Question CMS (already at `/admin/*`) with workflow, versioning, duplicate detection, autosave, advanced search, tagging, analytics, multi-device preview, and moderation. Frontend-only, mock data, fully responsive.

## 1. Mock data layer (`src/lib/adminMock.ts`)

Extend types and seed data — no breaking changes to existing fields.

- `QuestionVersion` — `{ id, questionId, version, editedBy, editedAt, changeSummary, snapshot: AdminQuestion }`
- `ModerationComment` — `{ id, questionId, author, role, message, createdAt, type: "note" | "approve" | "reject" }`
- `WorkflowEvent` — `{ id, questionId, from, to, actor, at, note? }`
- `QuestionAnalytics` — `{ questionId, attempts, accuracy, avgSolveSec, skipRate, difficultyRating, last30Days: { date, attempts, accuracy }[], optionDistribution: { label, pct }[] }`
- `TagMeta` — `{ slug, label, color }` for `formula-based | conceptual | numerical | tricky | important` (+ free-form).
- Helpers: `getVersions(id)`, `restoreVersion(id, vId)`, `getAnalytics(id)`, `getModeration(id)`, `addModeration(...)`, `transitionStatus(id, to, note)`, `findDuplicates(q)` (token-overlap similarity → returns top 3 with `%`), `tagCatalog`.

## 2. Question editor enhancements (`src/components/admin/QuestionEditor.tsx`)

Refactor into a 3-column layout on desktop, stacked on mobile:

```text
[ Main editor (existing) ] [ Right rail tabs ]
[ Sticky workflow bar (bottom) ]
```

Right-rail tabs: **Versions · Duplicates · Moderation · Analytics**. Sticky workflow bar shows current status badge + transition buttons (Save Draft, Submit for Review, Approve, Reject, Publish, Archive) gated by current status.

New sub-components in `src/components/admin/`:

- `WorkflowBar.tsx` — status pill + allowed transition buttons + autosave indicator (`Saving… / Draft saved · 2s ago`).
- `WorkflowTimeline.tsx` — vertical timeline of `WorkflowEvent[]`.
- `VersionHistoryPanel.tsx` — list of versions with "View / Compare / Restore". Compare opens `VersionCompareModal`.
- `VersionCompareModal.tsx` — side-by-side diff (question text, options, answer, explanation, tags) with simple line/field-level highlight.
- `DuplicateWarningPanel.tsx` — warning cards with similarity %, opens `DuplicateCompareModal` (current vs candidate, highlight matching option text).
- `ModerationPanel.tsx` — comment thread + Approve / Reject inline forms with note field.
- `AnalyticsPanel.tsx` — stat cards (Attempts, Accuracy %, Avg Solve Time, Skip %, Difficulty Rating) + Recharts (line: 30-day attempts/accuracy, bar: option distribution, pie: correct vs incorrect vs skipped).
- `TagInput.tsx` — colored pill input with autocomplete from `tagCatalog`, free-form add, X-to-remove, keyboard support.
- `useAutosave.ts` (hook) — debounced 1.5s save to in-memory store; exposes `status: 'idle' | 'saving' | 'saved'` and `lastSavedAt`.

## 3. Question list enhancements (`src/routes/admin/questions/index.tsx`)

- New `AdvancedFilters.tsx` drawer: subject, chapter, topic, tags (multi), status, difficulty, type, created date range, updated date range, sort.
- Active filter chips above the table with one-click clear.
- Tag column rendering colored pills.
- Row actions: quick status transition menu.

## 4. Preview enhancements (`src/components/admin/PreviewModal.tsx` + `DevicePreviewFrame.tsx`)

- Device switcher: **Mobile / Tablet / Desktop** with realistic frame sizes.
- Render full exam card mock: question + options + palette (1-of-N) + timer (mm:ss countdown) + bottom nav, reusing `QuestionPreviewCard` plus new `ExamChromeMock.tsx`.

## 5. Routing

No new routes needed — all features live inside existing editor + list pages. Add a tab anchor (`?tab=versions|duplicates|moderation|analytics`) so deep-links work.

## 6. Responsive

- Right rail collapses to a bottom tab sheet on `<lg`.
- Workflow bar becomes sticky bottom action bar on mobile.
- Tables: existing card fallback pattern preserved; advanced filters open as drawer on mobile.
- `AdminShell` sidebar already collapsible — verify behavior, no changes expected.

## Technical notes

- All status/tag colors via existing OKLCH tokens in `src/styles.css`; add `--tag-formula`, `--tag-conceptual`, `--tag-numerical`, `--tag-tricky`, `--tag-important` if needed.
- Charts via `recharts` (already in `src/components/ui/chart.tsx`).
- Diff: simple field-by-field comparison; for question/explanation strings, split by sentence and mark added/removed — no external diff lib.
- Similarity: Jaccard on lowercased word tokens of question stem; ≥60% flagged.
- Autosave writes to a module-level `Map` keyed by question id (mock); does not persist across reload — that's fine for mock.
- No backend, no new packages required.

## Build order

1. Extend `adminMock.ts` (types, seeds, helpers).
2. Build shared panels + hook (`useAutosave`, `TagInput`, `WorkflowBar`, `WorkflowTimeline`).
3. Build versioning + duplicate + moderation + analytics panels.
4. Refactor `QuestionEditor` into 3-column layout with right-rail tabs and sticky workflow bar.
5. Enhance list page filters + tag column.
6. Upgrade `PreviewModal` with device switcher + exam chrome.
7. Responsive QA at 375 / 768 / 1280.
