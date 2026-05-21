# Admin Question Management CMS — Plan

Building a scalable, mobile-first Admin CMS on top of the existing TanStack Start app (Next.js isn't used here — same React/TS/Tailwind stack, fully compatible with the spec). All data stays mock JSON. The existing `/admin` route will be restructured into a proper layout with nested routes.

## Routes

```
src/routes/admin.tsx                          → layout (sidebar + header + Outlet)
src/routes/admin/index.tsx                    → /admin (dashboard)
src/routes/admin/questions/index.tsx          → /admin/questions (list)
src/routes/admin/questions/create.tsx         → /admin/questions/create
src/routes/admin/questions/edit.$id.tsx       → /admin/questions/edit/:id
src/routes/admin/import/index.tsx             → /admin/import
src/routes/admin/import/review.$jobId.tsx     → /admin/import/review/:jobId
```

The current flat `admin.tsx` (with internal tab state) will be split into a true layout route + child routes so URLs are shareable and SSR-friendly.

## Mock data layer (`src/lib/adminMock.ts`)

TypeScript interfaces + seeded arrays:
- `AdminQuestion` — id, examId, subject, chapter, topic, difficulty, type (`MCQ_SINGLE | MCQ_MULTI | INTEGER | TRUE_FALSE`), marks, negativeMarks, tags[], status (`Draft | Review | Approved | Published | Rejected | Archived`), question (rich HTML), options[{id, html, isCorrect, imageUrl?}], correctInteger?, explanation, imageUrl?, createdAt, updatedAt, author
- `ImportJob` — id, fileName, uploadedAt, status, total, valid, invalid, duplicates, rows[]
- `ActivityItem`, `RecentUpload`
- Helpers: `getQuestion(id)`, `listQuestions(filters)`, `getImportJob(id)`

~30 seeded questions across JEE/NEET subjects with realistic chapters/topics.

## Shared admin components (`src/components/admin/`)

- `AdminLayout` — sidebar (drawer on mobile via Sheet), sticky header, breadcrumbs
- `StatCard`, `SectionCard`
- `DataTable` — generic, with column defs, row selection, bulk-action bar, sort, pagination
- `FilterBar` — collapsible on mobile; chips for active filters
- `StatusBadge` — color-coded per status
- `RichTextEditor` — toolbar (bold/italic/lists/tables/formula/image), `contentEditable` div, drag-and-drop image dropzone (mock — converts to object URL), formula insert dialog (LaTeX-ish string wrapped in `<code class="formula">`)
- `OptionEditor` — dynamic add/remove, correct-answer toggle (radio for SINGLE, checkbox for MULTI), per-option image upload
- `QuestionPreviewCard` — renders question exactly like the student exam UI
- `DevicePreviewFrame` — toggle mobile (375px) ↔ desktop, wraps preview in a framed viewport
- `AutoSaveIndicator` — "Saved 2s ago" with debounced save simulation
- `StickyActionBar` — Save Draft / Submit Review / Publish (sticky bottom on mobile, sticky right on desktop)
- `DuplicateWarning` — banner shown when question text matches existing

## Page-by-page

### 1. `/admin` Dashboard
- 4 stat cards: Total / Draft / Published / Import Jobs (counts from mock)
- Recent uploads table (last 5 import jobs, click → review)
- Recent activity feed
- Quick actions: "New Question", "Import CSV"

### 2. `/admin/questions` List
- Search input (debounced, filters on question text + tags)
- Filter drawer: Subject, Chapter (cascading), Topic, Difficulty, Type, Status
- Sort dropdown: Newest / Oldest / Most edited / Difficulty
- `DataTable` columns: checkbox, ID, Question (truncated), Subject, Type, Difficulty, Status badge, Updated, Actions (quick-edit, publish, archive)
- Bulk action bar appears when rows selected: Publish, Archive, Delete, Change status
- Pagination (10/25/50 per page)
- Mobile: collapses to stacked cards instead of table

### 3. `/admin/questions/create` ★ Hero page
Two-column layout (stacks on mobile, tabs to switch Editor ↔ Preview):

**Left — Editor**
- Metadata form (collapsible): Exam, Subject, Chapter, Topic, Difficulty, Type, Marks, Negative Marks, Tags (chip input)
- Question rich text editor with full toolbar + image dropzone
- Conditional answer area based on `type`:
  - MCQ_SINGLE/MULTI → `OptionEditor`
  - INTEGER → numeric input for correct value + range
  - TRUE_FALSE → two fixed options
- Explanation rich text editor (with formula + image)
- Duplicate warning banner if question matches existing mock entry
- Validation messages inline per field

**Right — Live Preview**
- `DevicePreviewFrame` with mobile/desktop toggle
- Renders `QuestionPreviewCard` updated on every keystroke (controlled state)
- Shows exam-style numbering, options, marks chip — matches the student exam UI

**Sticky action bar**
- Save Draft, Submit Review, Publish (with confirm)
- Auto-save indicator on the bar

### 4. `/admin/questions/edit/:id`
- Same component as create, preloaded from `getQuestion(id)` via route loader
- 404 fallback (`notFoundComponent`) if id missing
- Adds "Revision history" panel (mock list)

### 5. `/admin/import`
- Drag-and-drop CSV dropzone (mock parse)
- Format help card with expected columns
- List of past import jobs → each row links to review page

### 6. `/admin/import/review/:jobId`
- Summary stats: total / valid / invalid / duplicates
- Tabs: All / Errors / Duplicates
- Row-level table showing parsed question + validation status + inline fix
- Bulk actions: Approve valid, Discard invalid, Publish all

## State management

Local component state + `useReducer` for the question editor (covers undo-ready shape). No Zustand needed yet but shape kept compatible. Mock auto-save uses `setTimeout` debounce.

## Design tokens

Reuses existing `--gradient-card`, `--shadow-card`, `--shadow-soft`, status colors (`--success`, `--warning`, `--review`, `--destructive`). No new global tokens needed; status badge palette added inline using existing tokens. Dark mode inherits automatically.

## Out of scope (intentionally)

- Real rich-text engine (Tiptap/Lexical) — uses lightweight `contentEditable` with mock toolbar; can be swapped later behind the `RichTextEditor` API
- Real LaTeX rendering — formula stored as raw string, displayed in a styled `<code>` block
- Backend persistence — all mutations update in-memory mock arrays for the session

## File-creation order
1. `src/lib/adminMock.ts` (types + data)
2. `src/components/admin/*` shared components
3. Rewrite `src/routes/admin.tsx` → layout
4. Create child routes (dashboard, list, create, edit, import, import review)
5. Verify build / preview at mobile + desktop breakpoints

Ready to implement on approval.