# Import Management Pipeline

Build a full CSV/Excel question import workflow for the Admin CMS: **Upload → Parse → Review → Approve → Publish**, with a dedicated history view. All data stays mock/in-memory.

## Routes

- `/admin/import` — Upload page (rewrite existing)
- `/admin/import/review/$jobId` — Editable review grid (rewrite existing)
- `/admin/import/history` — Past import jobs (new)

## Mock data additions (`src/lib/adminMock.ts`)

Extend `ImportJob` and `ImportRow`:

- `ImportJob`: add `uploadedBy`, `status: "Uploaded" | "Parsing" | "Review" | "Approved" | "Published" | "Failed"`, `warnings`.
- `ImportRow`: add editable fields — `chapter`, `difficulty`, `type`, `options[]`, `correctAnswer`, `explanation`, `errors: string[]`, `warnings: string[]`, `rowStatus: "pending" | "approved" | "rejected" | "published"`.
- Seed 2–3 jobs with ~25 rows mixing valid/warning/invalid/duplicate cases.
- Helpers: `createImportJob(file)`, `getJob(id)`, `updateRow(jobId, rowNo, patch)`, `bulkUpdateRows`, `approveRows`, `publishRows`, `rejectRows`.

## 1. Upload page (`/admin/import`)

- Hero card with dashed drag-and-drop zone, upload icon, "Drop CSV or Excel file", Browse button, and a **Download Template** split button (CSV / Excel — both trigger a mock blob download with sample headers).
- Client-side validation: extension (`.csv`, `.xlsx`), size (≤10MB), single file.
- Simulated upload progress bar (setInterval) → on completion show **Import Summary card**: total / valid / invalid / warnings / duplicates, with "Review Now" CTA → navigates to `/admin/import/review/$jobId`.
- Sidebar quick-links to History and recent 3 jobs.

## 2. Review grid (`/admin/import/review/$jobId`) — primary surface

Airtable/Notion-style editable spreadsheet:

- **Sticky toolbar**: search input, filter chips (Status, Subject, Difficulty, Errors-only), bulk-action menu, "Publish Selected" primary button, row counter.
- **Sticky-header table** with resizable columns (mouse-drag handles via simple `useRef` width state):
  Checkbox · Row# · Question · Subject · Chapter · Difficulty · Type · Status · Errors · Actions.
- **Inline editing**: click cell → input/select swaps in; Enter/blur commits via `updateRow`. Selects for Subject/Difficulty/Type pull from existing mock lists.
- **Status pill colors** via existing tokens: green (valid/approved), amber (warning), red (invalid), blue (published).
- **Row actions** (icon buttons): Preview (opens modal), Approve, Reject, Edit (expands row to full editor drawer).
- **Bulk actions** on selected rows: Approve · Reject · Publish · Delete · Change Difficulty · Change Subject (last two open small popovers).
- **Pagination**: 25/50/100 per page, page nav at bottom.
- **Validation engine** (`validateRow` in mockData): checks missing question/subject/chapter, invalid difficulty, missing options for MCQ, missing correct answer, duplicate hash of question text. Re-runs on each edit and recolors status.
- **Preview modal**: reuses existing `QuestionPreviewCard` + `DevicePreviewFrame` (mobile/desktop toggle), renders mock formula/image placeholders.

## 3. History page (`/admin/import/history`)

- Stat cards: Total Jobs, Rows Imported, Rows Failed, Last Upload.
- Table: File · Uploaded By · Uploaded At · Total · Valid · Invalid · Status pill · Actions (Open Review, Download Original mock, Delete).
- Filter by status + search by filename.

## 4. Shared components (`src/components/admin/`)

- `ImportDropzone.tsx` — drag/drop + browse + progress.
- `ImportSummaryCard.tsx` — post-upload stats with CTA.
- `ReviewGrid.tsx` — the editable table (resize, inline edit, selection).
- `ReviewToolbar.tsx` — search/filters/bulk menu.
- `PreviewModal.tsx` — wraps existing preview components in a dialog.
- `JobStatusBadge.tsx` — extends existing `StatusBadge` with import statuses.
- Add "Import History" link to `AdminShell` sidebar.

## Technical notes

- TanStack Router file routes; new file: `src/routes/admin/import/history.tsx`.
- State: per-page `useReducer` for the grid (rows, selection, filters, edits). No Zustand yet; shape kept compatible.
- No real CSV parsing — `createImportJob` synthesizes rows from a seeded template so uploads always "succeed".
- Template downloads use `Blob` + `URL.createObjectURL` with hard-coded header strings; xlsx is a CSV-with-`.xlsx` stub (acceptable for mock).
- All styling via existing OKLCH tokens, `shadow-card`, `gradient-card`. Mobile: grid collapses to horizontally-scrolling table inside a rounded card; toolbar becomes sticky bottom action bar with condensed bulk menu.
- Reuse existing `QuestionPreviewCard`, `DevicePreviewFrame`, `StatusBadge`, `AdminShell`.

## Build order

1. Extend `adminMock.ts` (types + helpers + seeds).
2. Build shared components.
3. Rewrite `/admin/import` (upload + summary).
4. Rewrite `/admin/import/review/$jobId` (grid + modal + bulk).
5. Create `/admin/import/history`.
6. Wire sidebar link; verify at 360px and desktop.
