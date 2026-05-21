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

export interface ImportRow {
  rowNo: number;
  question: string;
  subject: string;
  status: "valid" | "invalid" | "duplicate";
  error?: string;
}

export interface ImportJob {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: "Processed" | "Processing" | "Failed";
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  rows: ImportRow[];
}

export interface ActivityItem {
  id: string;
  text: string;
  user: string;
  at: string;
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

export const importJobs: ImportJob[] = [
  {
    id: "job-2041",
    fileName: "physics-bulk-nov.csv",
    uploadedAt: isoOffset(0),
    status: "Processed",
    total: 120,
    valid: 104,
    invalid: 9,
    duplicates: 7,
    rows: Array.from({ length: 12 }, (_, i) => ({
      rowNo: i + 1,
      question: `Imported row ${i + 1}: A body of mass 2kg is acted upon...`,
      subject: "Physics",
      status: i % 5 === 0 ? "invalid" : i % 7 === 0 ? "duplicate" : "valid",
      error: i % 5 === 0 ? "Missing correct option" : undefined,
    })),
  },
  {
    id: "job-2040",
    fileName: "chem-organic.csv",
    uploadedAt: isoOffset(1),
    status: "Processed",
    total: 60,
    valid: 58,
    invalid: 1,
    duplicates: 1,
    rows: Array.from({ length: 8 }, (_, i) => ({
      rowNo: i + 1,
      question: `Organic chemistry row ${i + 1}: IUPAC name of...`,
      subject: "Chemistry",
      status: "valid" as const,
    })),
  },
  {
    id: "job-2039",
    fileName: "maths-calc.csv",
    uploadedAt: isoOffset(3),
    status: "Failed",
    total: 0,
    valid: 0,
    invalid: 0,
    duplicates: 0,
    rows: [],
  },
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
