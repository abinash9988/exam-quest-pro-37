export type QuestionType = "MCQ_SINGLE" | "MCQ_MULTI" | "INTEGER" | "TRUE_FALSE";
export type QuestionStatus = "Draft" | "Review" | "Approved" | "Published" | "Rejected" | "Archived";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface QOption {
  id: string;
  html: string;
  isCorrect: boolean;
  imageUrl?: string;
}

export interface AdminQuestion {
  id: string;
  examId: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  marks: number;
  negativeMarks: number;
  tags: string[];
  status: QuestionStatus;
  question: string; // rich html
  options: QOption[];
  correctInteger?: number;
  explanation: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export type ImportJobStatus =
  | "Uploaded" | "Parsing" | "Review" | "Approved" | "Published" | "Failed"
  | "Processed" | "Processing";
export type ImportRowStatus = "valid" | "invalid" | "duplicate" | "warning";
export type ImportRowWorkflow = "pending" | "approved" | "rejected" | "published";

export interface ImportRowOption { html: string; isCorrect: boolean }

export interface ImportRow {
  rowNo: number;
  question: string;
  subject: string;
  chapter: string;
  difficulty: Difficulty;
  type: QuestionType;
  options: ImportRowOption[];
  correctAnswer: string;
  explanation: string;
  status: ImportRowStatus;
  workflow: ImportRowWorkflow;
  errors: string[];
  warnings: string[];
  /** legacy single-error field */
  error?: string;
}

export interface ImportJob {
  id: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
  status: ImportJobStatus;
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  warnings: number;
  rows: ImportRow[];
}

export interface ActivityItem {
  id: string;
  text: string;
  user: string;
  at: string;
}

// ===== Versions / Moderation / Analytics / Tags =====
export interface QuestionVersion {
  id: string;
  questionId: string;
  version: number;
  editedBy: string;
  editedAt: string;
  changeSummary: string;
  snapshot: AdminQuestion;
}

export interface ModerationComment {
  id: string;
  questionId: string;
  author: string;
  role: "Reviewer" | "Editor" | "Admin";
  message: string;
  createdAt: string;
  type: "note" | "approve" | "reject";
}

export interface WorkflowEvent {
  id: string;
  questionId: string;
  from: QuestionStatus | null;
  to: QuestionStatus;
  actor: string;
  at: string;
  note?: string;
}

export interface QuestionAnalytics {
  questionId: string;
  attempts: number;
  accuracy: number;
  avgSolveSec: number;
  skipRate: number;
  difficultyRating: number;
  last30Days: { date: string; attempts: number; accuracy: number }[];
  optionDistribution: { label: string; pct: number }[];
}

export interface TagMeta { slug: string; label: string; color: string }
export const tagCatalog: TagMeta[] = [
  { slug: "formula-based", label: "Formula-based", color: "var(--review)" },
  { slug: "conceptual",   label: "Conceptual",    color: "var(--success)" },
  { slug: "numerical",    label: "Numerical",     color: "var(--primary)" },
  { slug: "tricky",       label: "Tricky",        color: "var(--warning)" },
  { slug: "important",    label: "Important",     color: "var(--destructive)" },
];
export function tagColor(slug: string): string {
  return tagCatalog.find((t) => t.slug === slug)?.color ?? "var(--muted-foreground)";
}

export const exams = ["JEE Mains", "JEE Advanced", "NEET UG", "SSC CGL", "UPSC Prelims", "IBPS PO"];
export const subjects = ["Physics", "Chemistry", "Maths", "Biology", "Reasoning", "GS"];
export const chaptersBySubject: Record<string, string[]> = {
  Physics: ["Kinematics", "Laws of Motion", "Optics", "Electrostatics", "Modern Physics"],
  Chemistry: ["Atomic Structure", "Thermodynamics", "Organic Basics", "Coordination"],
  Maths: ["Algebra", "Calculus", "Coordinate Geometry", "Probability"],
  Biology: ["Cell Biology", "Genetics", "Human Physiology", "Ecology"],
  Reasoning: ["Puzzles", "Series", "Syllogism"],
  GS: ["Polity", "History", "Geography", "Economy"],
};
export const topicsByChapter: Record<string, string[]> = {
  Kinematics: ["1D Motion", "Projectile", "Relative Motion"],
  Optics: ["Reflection", "Refraction", "Wave Optics"],
  Calculus: ["Limits", "Derivatives", "Integrals"],
  Algebra: ["Quadratics", "Sequences", "Matrices"],
  Genetics: ["Mendelian", "Molecular Basis"],
  Polity: ["Fundamental Rights", "Parliament"],
};

const now = Date.now();
const isoOffset = (days: number) => new Date(now - days * 86400000).toISOString();

const seedQuestion = (i: number): AdminQuestion => {
  const types: QuestionType[] = ["MCQ_SINGLE", "MCQ_MULTI", "INTEGER", "TRUE_FALSE"];
  const statuses: QuestionStatus[] = ["Draft", "Review", "Approved", "Published", "Rejected", "Archived"];
  const subj = subjects[i % subjects.length];
  const ch = chaptersBySubject[subj][i % chaptersBySubject[subj].length];
  const type = types[i % 4];
  const difficulty: Difficulty = (["Easy", "Medium", "Hard"] as const)[i % 3];
  const opts: QOption[] = type === "TRUE_FALSE"
    ? [
        { id: "o1", html: "True", isCorrect: i % 2 === 0 },
        { id: "o2", html: "False", isCorrect: i % 2 !== 0 },
      ]
    : type === "INTEGER"
    ? []
    : [
        { id: "o1", html: `Option A for Q${i + 1}`, isCorrect: true },
        { id: "o2", html: `Option B for Q${i + 1}`, isCorrect: type === "MCQ_MULTI" },
        { id: "o3", html: `Option C for Q${i + 1}`, isCorrect: false },
        { id: "o4", html: `Option D for Q${i + 1}`, isCorrect: false },
      ];
  return {
    id: `Q${1000 + i}`,
    examId: exams[i % exams.length],
    subject: subj,
    chapter: ch,
    topic: (topicsByChapter[ch] ?? ["General"])[0],
    difficulty,
    type,
    marks: 4,
    negativeMarks: 1,
    tags: ["mock-2026", subj.toLowerCase()],
    status: statuses[i % statuses.length],
    question: `<p>Sample question #${i + 1} — A particle moves along the x-axis with velocity <strong>v = 3t² + 2</strong>. Find its acceleration at t = 2s.</p>`,
    options: opts,
    correctInteger: type === "INTEGER" ? 12 : undefined,
    explanation: `<p>Differentiate velocity with respect to time: <em>a = dv/dt = 6t</em>. At t=2, a = 12 m/s².</p>`,
    createdAt: isoOffset(30 - i),
    updatedAt: isoOffset(i % 10),
    author: ["Priya S.", "Rahul V.", "Anjali"][i % 3],
  };
};

export const adminQuestions: AdminQuestion[] = Array.from({ length: 36 }, (_, i) => seedQuestion(i));

function seedRow(i: number, subj: string): ImportRow {
  const mod = i % 11;
  const status: ImportRowStatus =
    mod === 0 ? "invalid" : mod === 3 ? "duplicate" : mod === 6 ? "warning" : "valid";
  const errors: string[] = [];
  const warnings: string[] = [];
  if (status === "invalid") errors.push(i % 2 === 0 ? "Missing correct option" : "Invalid difficulty value");
  if (status === "duplicate") warnings.push("Duplicate of an existing question");
  if (status === "warning") warnings.push("Explanation is empty");
  const ch = chaptersBySubject[subj][i % chaptersBySubject[subj].length];
  const diffs: Difficulty[] = ["Easy", "Medium", "Hard"];
  return {
    rowNo: i + 1,
    question: `Imported Q${i + 1}: A ${subj.toLowerCase()} problem about ${ch.toLowerCase()} — option set ${i + 1}.`,
    subject: subj,
    chapter: ch,
    difficulty: diffs[i % 3],
    type: "MCQ_SINGLE",
    options: [
      { html: "Option A", isCorrect: i % 4 === 0 },
      { html: "Option B", isCorrect: i % 4 === 1 },
      { html: "Option C", isCorrect: i % 4 === 2 },
      { html: "Option D", isCorrect: i % 4 === 3 },
    ],
    correctAnswer: ["A", "B", "C", "D"][i % 4],
    explanation: status === "warning" ? "" : `Worked solution for row ${i + 1}.`,
    status,
    workflow: "pending",
    errors,
    warnings,
    error: errors[0],
  };
}

function makeJob(opts: {
  id: string; fileName: string; uploadedAt: string; uploadedBy: string;
  status: ImportJobStatus; subj: string; count: number;
}): ImportJob {
  const rows = Array.from({ length: opts.count }, (_, i) => seedRow(i, opts.subj));
  return {
    id: opts.id, fileName: opts.fileName, uploadedAt: opts.uploadedAt, uploadedBy: opts.uploadedBy,
    status: opts.status,
    total: rows.length,
    valid: rows.filter((r) => r.status === "valid").length,
    invalid: rows.filter((r) => r.status === "invalid").length,
    duplicates: rows.filter((r) => r.status === "duplicate").length,
    warnings: rows.filter((r) => r.status === "warning").length,
    rows,
  };
}

export const importJobs: ImportJob[] = [
  makeJob({ id: "job-2041", fileName: "physics-bulk-nov.csv", uploadedAt: isoOffset(0), uploadedBy: "Priya S.", status: "Review", subj: "Physics", count: 24 }),
  makeJob({ id: "job-2040", fileName: "chem-organic.xlsx", uploadedAt: isoOffset(1), uploadedBy: "Rahul V.", status: "Published", subj: "Chemistry", count: 18 }),
  makeJob({ id: "job-2039", fileName: "maths-calc.csv", uploadedAt: isoOffset(3), uploadedBy: "Anjali", status: "Failed", subj: "Maths", count: 0 }),
  makeJob({ id: "job-2038", fileName: "bio-genetics.csv", uploadedAt: isoOffset(5), uploadedBy: "Priya S.", status: "Approved", subj: "Biology", count: 16 }),
];

export const recentActivity: ActivityItem[] = [
  { id: "a1", text: "Published 12 Physics questions", user: "Priya S.", at: "2m ago" },
  { id: "a2", text: "Imported physics-bulk-nov.csv", user: "Rahul V.", at: "1h ago" },
  { id: "a3", text: "Rejected 2 questions in review", user: "Anjali", at: "3h ago" },
  { id: "a4", text: "Created chapter: Wave Optics", user: "Priya S.", at: "Yesterday" },
];

export function getQuestion(id: string): AdminQuestion | undefined {
  return adminQuestions.find((q) => q.id === id);
}

export function getImportJob(id: string): ImportJob | undefined {
  return importJobs.find((j) => j.id === id);
}

export const emptyQuestion = (): AdminQuestion => ({
  id: `Q${Date.now()}`,
  examId: exams[0],
  subject: "Physics",
  chapter: "Kinematics",
  topic: "1D Motion",
  difficulty: "Medium",
  type: "MCQ_SINGLE",
  marks: 4,
  negativeMarks: 1,
  tags: [],
  status: "Draft",
  question: "",
  options: [
    { id: "o1", html: "", isCorrect: false },
    { id: "o2", html: "", isCorrect: false },
    { id: "o3", html: "", isCorrect: false },
    { id: "o4", html: "", isCorrect: false },
  ],
  explanation: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: "You",
});

// ===== Import helpers =====
export function createImportJob(file: { name: string; size: number }): ImportJob {
  const id = `job-${Date.now().toString().slice(-5)}`;
  const subj = subjects[Math.floor(Math.random() * subjects.length)];
  const count = 18 + Math.floor(Math.random() * 18);
  const job = makeJob({
    id, fileName: file.name, uploadedAt: new Date().toISOString(),
    uploadedBy: "You", status: "Review", subj, count,
  });
  importJobs.unshift(job);
  return job;
}

export function updateImportRow(jobId: string, rowNo: number, patch: Partial<ImportRow>) {
  const job = importJobs.find((j) => j.id === jobId);
  if (!job) return;
  const row = job.rows.find((r) => r.rowNo === rowNo);
  if (!row) return;
  Object.assign(row, patch);
  validateRow(row);
  recountJob(job);
}

export function validateRow(r: ImportRow) {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!r.question?.trim()) errors.push("Question text is required");
  if (!r.subject?.trim()) errors.push("Subject is required");
  if (!r.chapter?.trim()) warnings.push("Chapter is missing");
  if (!(["Easy","Medium","Hard"] as Difficulty[]).includes(r.difficulty)) errors.push("Invalid difficulty");
  if ((r.type === "MCQ_SINGLE" || r.type === "MCQ_MULTI") && !r.options.some((o) => o.isCorrect)) {
    errors.push("No correct option marked");
  }
  if (!r.explanation?.trim()) warnings.push("Explanation is empty");
  r.errors = errors;
  r.warnings = warnings;
  r.error = errors[0];
  r.status = errors.length ? "invalid" : warnings.length ? "warning" : "valid";
}

function recountJob(job: ImportJob) {
  job.total = job.rows.length;
  job.valid = job.rows.filter((r) => r.status === "valid").length;
  job.invalid = job.rows.filter((r) => r.status === "invalid").length;
  job.duplicates = job.rows.filter((r) => r.status === "duplicate").length;
  job.warnings = job.rows.filter((r) => r.status === "warning").length;
}

export function bulkUpdateRows(jobId: string, rowNos: number[], patch: Partial<ImportRow>) {
  rowNos.forEach((n) => updateImportRow(jobId, n, patch));
}

export function deleteRows(jobId: string, rowNos: number[]) {
  const job = importJobs.find((j) => j.id === jobId);
  if (!job) return;
  job.rows = job.rows.filter((r) => !rowNos.includes(r.rowNo));
  recountJob(job);
}

// ===== Versions / Moderation / Workflow / Analytics helpers =====
const versionsStore = new Map<string, QuestionVersion[]>();
const moderationStore = new Map<string, ModerationComment[]>();
const workflowStore = new Map<string, WorkflowEvent[]>();
const analyticsStore = new Map<string, QuestionAnalytics>();

function seedVersions(q: AdminQuestion): QuestionVersion[] {
  const authors = ["Priya S.", "Rahul V.", "Anjali", "You"];
  const summaries = ["Created question", "Rephrased stem", "Fixed option C typo", "Updated explanation", "Added formula tag"];
  return Array.from({ length: 3 }, (_, i) => ({
    id: `${q.id}-v${i + 1}`,
    questionId: q.id,
    version: i + 1,
    editedBy: authors[i % authors.length],
    editedAt: new Date(Date.now() - (15 - i * 5) * 86400000).toISOString(),
    changeSummary: summaries[i % summaries.length],
    snapshot: {
      ...q,
      question: i === 2 ? q.question : q.question.replace(/v\s*=\s*3t/, `v = ${i + 2}t`),
      explanation: i === 2 ? q.explanation : q.explanation.replace(/dv\/dt/, i === 0 ? "dv/dt (chain)" : "dv/dt"),
    },
  }));
}
function seedModeration(q: AdminQuestion): ModerationComment[] {
  return [
    { id: `${q.id}-m1`, questionId: q.id, author: "Anjali", role: "Reviewer", type: "note", createdAt: isoOffset(3), message: "Consider rewording the stem for clarity." },
    { id: `${q.id}-m2`, questionId: q.id, author: "Rahul V.", role: "Editor", type: "approve", createdAt: isoOffset(1), message: "Looks good after the edit. Approved." },
  ];
}
function seedWorkflow(q: AdminQuestion): WorkflowEvent[] {
  return [
    { id: `${q.id}-w1`, questionId: q.id, from: null, to: "Draft", actor: q.author, at: isoOffset(10), note: "Created" },
    { id: `${q.id}-w2`, questionId: q.id, from: "Draft", to: "Review", actor: q.author, at: isoOffset(5), note: "Submitted for review" },
    { id: `${q.id}-w3`, questionId: q.id, from: "Review", to: q.status, actor: "Anjali", at: isoOffset(1) },
  ];
}
function seedAnalytics(q: AdminQuestion): QuestionAnalytics {
  const seed = Number(q.id.replace(/\D/g, "")) || 1;
  const r = (n: number) => ((Math.sin(seed * n) + 1) / 2);
  const attempts = 800 + Math.floor(r(1) * 4000);
  return {
    questionId: q.id,
    attempts,
    accuracy: Math.round(40 + r(2) * 50),
    avgSolveSec: Math.round(45 + r(3) * 120),
    skipRate: Math.round(r(4) * 35),
    difficultyRating: Math.round((2 + r(5) * 3) * 10) / 10,
    last30Days: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(5, 10),
      attempts: Math.round(attempts / 30 * (0.4 + r(i + 7) * 1.4)),
      accuracy: Math.round(40 + r(i + 11) * 50),
    })),
    optionDistribution: (q.options.length ? q.options : [{ html: "A" }, { html: "B" }, { html: "C" }, { html: "D" }]).map((_, i) => ({
      label: String.fromCharCode(65 + i),
      pct: Math.round(15 + r(i + 13) * 50),
    })),
  };
}

export function getVersions(id: string): QuestionVersion[] {
  if (!versionsStore.has(id)) {
    const q = getQuestion(id);
    if (q) versionsStore.set(id, seedVersions(q));
  }
  return versionsStore.get(id) ?? [];
}
export function pushVersion(q: AdminQuestion, changeSummary: string, editedBy = "You") {
  const list = getVersions(q.id);
  const v: QuestionVersion = {
    id: `${q.id}-v${list.length + 1}`,
    questionId: q.id,
    version: list.length + 1,
    editedBy,
    editedAt: new Date().toISOString(),
    changeSummary,
    snapshot: { ...q },
  };
  versionsStore.set(q.id, [...list, v]);
  return v;
}
export function getModeration(id: string): ModerationComment[] {
  if (!moderationStore.has(id)) {
    const q = getQuestion(id);
    if (q) moderationStore.set(id, seedModeration(q));
  }
  return moderationStore.get(id) ?? [];
}
export function addModeration(id: string, c: Omit<ModerationComment, "id" | "questionId" | "createdAt">): ModerationComment {
  const item: ModerationComment = { ...c, id: `${id}-m${Date.now()}`, questionId: id, createdAt: new Date().toISOString() };
  moderationStore.set(id, [...getModeration(id), item]);
  return item;
}
export function getWorkflow(id: string): WorkflowEvent[] {
  if (!workflowStore.has(id)) {
    const q = getQuestion(id);
    if (q) workflowStore.set(id, seedWorkflow(q));
  }
  return workflowStore.get(id) ?? [];
}
export function transitionStatus(id: string, to: QuestionStatus, note?: string, actor = "You") {
  const q = getQuestion(id);
  const from = q?.status ?? null;
  const ev: WorkflowEvent = { id: `${id}-w${Date.now()}`, questionId: id, from, to, actor, at: new Date().toISOString(), note };
  workflowStore.set(id, [...getWorkflow(id), ev]);
  if (q) q.status = to;
  return ev;
}
export function getAnalytics(id: string): QuestionAnalytics {
  if (!analyticsStore.has(id)) {
    const q = getQuestion(id) ?? adminQuestions[0];
    analyticsStore.set(id, seedAnalytics({ ...q, id }));
  }
  return analyticsStore.get(id)!;
}

// Jaccard similarity on word tokens
function tokenize(s: string) {
  return new Set(s.replace(/<[^>]+>/g, " ").toLowerCase().match(/[a-z0-9]+/g) ?? []);
}
export function findDuplicates(q: AdminQuestion, top = 3): { question: AdminQuestion; similarity: number }[] {
  const a = tokenize(q.question);
  if (a.size < 3) return [];
  const scored = adminQuestions
    .filter((x) => x.id !== q.id)
    .map((x) => {
      const b = tokenize(x.question);
      const inter = [...a].filter((t) => b.has(t)).length;
      const union = new Set([...a, ...b]).size;
      return { question: x, similarity: union ? inter / union : 0 };
    })
    .filter((r) => r.similarity >= 0.35)
    .sort((x, y) => y.similarity - x.similarity)
    .slice(0, top);
  return scored;
}

export const allowedTransitions: Record<QuestionStatus, QuestionStatus[]> = {
  Draft:     ["Review", "Archived"],
  Review:    ["Approved", "Rejected", "Draft"],
  Approved:  ["Published", "Review", "Archived"],
  Published: ["Archived", "Review"],
  Rejected:  ["Draft", "Archived"],
  Archived:  ["Draft"],
};
