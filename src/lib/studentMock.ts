export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  gradient: string; // tailwind from-/to- gradient
}

export interface LoginMethod {
  type: "email" | "mobile" | "google";
  value: string;
  verified: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar: string; // initials
  joinedAt: string; // ISO
  preferredCategoryId: string;
  streakDays: number;
  goldenBadges: number;
  loginMethods: LoginMethod[];
  rankPercentile: number;
}

export type TestStatus = "not-started" | "in-progress" | "completed";

export interface UnlockedTest {
  id: string;
  name: string;
  categoryId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  validUntil: string; // ISO
  status: TestStatus;
  progressPct: number;
  attemptsLeft: number;
  questions: number;
  durationMin: number;
}

export interface Purchase {
  id: string;
  item: string;
  type: "test" | "subscription";
  categoryId: string;
  amount: number;
  paidAt: string;
  method: "UPI" | "Card" | "NetBanking" | "Wallet";
  status: "active" | "expired" | "refunded";
  invoiceId: string;
}

export interface Subscription {
  id: string;
  categoryId: string;
  planName: string;
  startedAt: string;
  expiresAt: string;
  benefits: string[];
  status: "active" | "expired";
  pricePerMonth: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  features: string[];
  highlight?: boolean;
  badge?: string;
}

export interface DashboardStats {
  activeTests: number;
  avgScore: number;
  accuracy: number;
  totalAttempts: number;
  subscriptionStatus: "Active" | "Expired" | "None";
  communityPosts: number;
}

// --- mock data ---

export const categories: Category[] = [
  { id: "cat-jee", name: "JEE", slug: "jee", icon: "⚛️", gradient: "from-indigo-500 to-purple-600" },
  { id: "cat-neet", name: "NEET", slug: "neet", icon: "🧬", gradient: "from-emerald-500 to-teal-600" },
  { id: "cat-ssc", name: "SSC", slug: "ssc", icon: "📋", gradient: "from-orange-500 to-red-500" },
  { id: "cat-banking", name: "Banking", slug: "banking", icon: "🏦", gradient: "from-blue-500 to-cyan-600" },
  { id: "cat-upsc", name: "UPSC", slug: "upsc", icon: "🏛️", gradient: "from-amber-500 to-orange-600" },
];

export const student: Student = {
  id: "stu-001",
  name: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  mobile: "+91 98765 43210",
  avatar: "AM",
  joinedAt: "2024-08-12T10:00:00.000Z",
  preferredCategoryId: "cat-jee",
  streakDays: 17,
  goldenBadges: 42,
  rankPercentile: 94.6,
  loginMethods: [
    { type: "email", value: "aarav.mehta@example.com", verified: true },
    { type: "mobile", value: "+91 98765 43210", verified: true },
    { type: "google", value: "aarav.mehta@gmail.com", verified: true },
  ],
};

const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const unlockedTests: UnlockedTest[] = [
  { id: "t1", name: "JEE Mains Full Test 04", categoryId: "cat-jee", difficulty: "Hard", validUntil: inDays(12), status: "in-progress", progressPct: 64, attemptsLeft: 1, questions: 75, durationMin: 180 },
  { id: "t2", name: "NEET Biology Booster", categoryId: "cat-neet", difficulty: "Easy", validUntil: inDays(3), status: "not-started", progressPct: 0, attemptsLeft: 2, questions: 45, durationMin: 45 },
  { id: "t3", name: "SSC CGL Tier 1 Mock", categoryId: "cat-ssc", difficulty: "Medium", validUntil: inDays(28), status: "completed", progressPct: 100, attemptsLeft: 1, questions: 100, durationMin: 60 },
  { id: "t4", name: "IBPS PO Prelims", categoryId: "cat-banking", difficulty: "Medium", validUntil: inDays(0), status: "not-started", progressPct: 0, attemptsLeft: 1, questions: 100, durationMin: 60 },
  { id: "t5", name: "UPSC Prelims GS", categoryId: "cat-upsc", difficulty: "Hard", validUntil: inDays(45), status: "in-progress", progressPct: 22, attemptsLeft: 1, questions: 100, durationMin: 120 },
  { id: "t6", name: "JEE Physics Sprint", categoryId: "cat-jee", difficulty: "Medium", validUntil: inDays(-2), status: "completed", progressPct: 100, attemptsLeft: 0, questions: 25, durationMin: 60 },
];

export const purchases: Purchase[] = [
  { id: "p1", item: "JEE Pro · Yearly", type: "subscription", categoryId: "cat-jee", amount: 2499, paidAt: daysAgo(12), method: "UPI", status: "active", invoiceId: "INV-10231" },
  { id: "p2", item: "NEET Biology Booster", type: "test", categoryId: "cat-neet", amount: 9, paidAt: daysAgo(5), method: "Card", status: "active", invoiceId: "INV-10240" },
  { id: "p3", item: "SSC CGL Tier 1 Mock", type: "test", categoryId: "cat-ssc", amount: 9, paidAt: daysAgo(20), method: "Wallet", status: "active", invoiceId: "INV-10198" },
  { id: "p4", item: "Banking Starter · Monthly", type: "subscription", categoryId: "cat-banking", amount: 299, paidAt: daysAgo(45), method: "NetBanking", status: "expired", invoiceId: "INV-10120" },
  { id: "p5", item: "UPSC Prelims GS", type: "test", categoryId: "cat-upsc", amount: 19, paidAt: daysAgo(2), method: "UPI", status: "active", invoiceId: "INV-10256" },
  { id: "p6", item: "JEE Physics Sprint", type: "test", categoryId: "cat-jee", amount: 9, paidAt: daysAgo(60), method: "Card", status: "expired", invoiceId: "INV-10044" },
];

export const subscriptions: Subscription[] = [
  {
    id: "s1", categoryId: "cat-jee", planName: "JEE Pro · Yearly",
    startedAt: daysAgo(12), expiresAt: inDays(353), status: "active", pricePerMonth: 208,
    benefits: ["Unlimited mock tests", "AI rank prediction", "Detailed analytics", "Priority support"],
  },
  {
    id: "s2", categoryId: "cat-neet", planName: "NEET Lite · Quarterly",
    startedAt: daysAgo(5), expiresAt: inDays(85), status: "active", pricePerMonth: 149,
    benefits: ["20 mock tests/month", "Subject-wise analysis", "Doubt clearing"],
  },
  {
    id: "s3", categoryId: "cat-banking", planName: "Banking Starter · Monthly",
    startedAt: daysAgo(45), expiresAt: daysAgo(15), status: "expired", pricePerMonth: 299,
    benefits: ["10 mock tests", "Sectional tests"],
  },
];

export const upgradePlans: Plan[] = [
  { id: "pl1", name: "Starter", price: 149, period: "month", features: ["10 mock tests / month", "Basic analytics", "Email support"] },
  { id: "pl2", name: "Pro", price: 299, period: "month", highlight: true, badge: "Most Popular", features: ["Unlimited mocks", "AI rank prediction", "Detailed analytics", "Priority support"] },
  { id: "pl3", name: "Elite", price: 2499, period: "year", badge: "Best Value", features: ["All Pro features", "1-on-1 mentor sessions", "Printed report card", "Lifetime resources"] },
];

export const dashboardStats: DashboardStats = {
  activeTests: 4,
  avgScore: 76,
  accuracy: 81,
  totalAttempts: 24,
  subscriptionStatus: "Active",
  communityPosts: 12,
};

export const streakSeries = [
  { d: "Mon", v: 1 }, { d: "Tue", v: 1 }, { d: "Wed", v: 0 }, { d: "Thu", v: 1 },
  { d: "Fri", v: 1 }, { d: "Sat", v: 1 }, { d: "Sun", v: 1 },
];

// helpers
export const getCategoryById = (id: string) =>
  categories.find((c) => c.id === id) ?? categories[0];

export function daysRemaining(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ============================================================
// Phase 2 — Gamification, rewards, analytics & recommendations
// ============================================================

export const TEST_VALIDITY_DAYS = 15;
export const BADGE_RULE = "Score ≥70% on a Medium or Hard test";

export type TestColorStatus = "active" | "expiring" | "expired";

export function getTestStatusColor(validUntil: string): TestColorStatus {
  const d = daysRemaining(validUntil);
  if (d < 0) return "expired";
  if (d <= 3) return "expiring";
  return "active";
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  threshold: number;
  description: string;
}

export const REWARD_TIERS: Reward[] = [
  { id: "r1", name: "Exclusive Sticker", icon: "🌟", threshold: 25, description: "Holographic MockArena sticker pack." },
  { id: "r2", name: "Steel Water Bottle", icon: "💧", threshold: 50, description: "Branded vacuum-insulated bottle." },
  { id: "r3", name: "Premium T-Shirt", icon: "👕", threshold: 75, description: "Limited-edition cotton tee." },
  { id: "r4", name: "Study Table Lamp", icon: "💡", threshold: 100, description: "Eye-care LED lamp for late-night prep." },
  { id: "r5", name: "Premium Backpack", icon: "🎒", threshold: 150, description: "Anti-theft laptop backpack." },
];

export function getNextReward(badges: number): Reward | null {
  return REWARD_TIERS.find((r) => r.threshold > badges) ?? null;
}

export function getProgressToNextReward(badges: number) {
  const next = getNextReward(badges);
  if (!next) return { from: 150, to: 150, pct: 100, remaining: 0, next: null as Reward | null };
  const prev = [...REWARD_TIERS].reverse().find((r) => r.threshold <= badges)?.threshold ?? 0;
  const span = next.threshold - prev;
  const done = badges - prev;
  return { from: prev, to: next.threshold, pct: Math.round((done / span) * 100), remaining: next.threshold - badges, next };
}

export interface Achievement {
  id: string;
  title: string;
  type: "streak" | "badge" | "score" | "reward";
  earnedAt: string;
  detail: string;
}

export const achievements: Achievement[] = [
  { id: "a1", title: "17-day streak unlocked", type: "streak", earnedAt: daysAgo(0), detail: "Practiced every day this week." },
  { id: "a2", title: "Crossed 40 Golden Badges", type: "badge", earnedAt: daysAgo(2), detail: "Top 6% of all aspirants." },
  { id: "a3", title: "Score 92% in JEE Physics", type: "score", earnedAt: daysAgo(4), detail: "Personal best in Physics." },
  { id: "a4", title: "Unlocked Sticker reward", type: "reward", earnedAt: daysAgo(8), detail: "Reached 25 badges milestone." },
  { id: "a5", title: "First Hard test cracked", type: "score", earnedAt: daysAgo(14), detail: "JEE Mains Mock 02 · 78%." },
];

export interface ResultEntry {
  id: string;
  testName: string;
  categoryId: string;
  scorePct: number;
  accuracy: number;
  timeTakenMin: number;
  attemptedAt: string;
}

export const results: ResultEntry[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `res-${i + 1}`,
  testName: ["JEE Physics Sprint", "JEE Maths Daily", "NEET Biology Booster", "SSC CGL Tier 1", "UPSC Prelims GS"][i % 5],
  categoryId: ["cat-jee", "cat-jee", "cat-neet", "cat-ssc", "cat-upsc"][i % 5],
  scorePct: 55 + ((i * 7) % 38),
  accuracy: 60 + ((i * 5) % 35),
  timeTakenMin: 25 + ((i * 9) % 45),
  attemptedAt: daysAgo(28 - i * 3),
}));

export interface SubjectStat {
  subject: string;
  attempts: number;
  avgScore: number;
  strength: "weak" | "average" | "strong";
}

export const subjectStats: SubjectStat[] = [
  { subject: "Physics", attempts: 12, avgScore: 82, strength: "strong" },
  { subject: "Chemistry", attempts: 9, avgScore: 71, strength: "average" },
  { subject: "Maths", attempts: 14, avgScore: 88, strength: "strong" },
  { subject: "Biology", attempts: 5, avgScore: 58, strength: "weak" },
  { subject: "Reasoning", attempts: 7, avgScore: 64, strength: "average" },
  { subject: "GK / Current", attempts: 4, avgScore: 49, strength: "weak" },
];

export const weeklyPerformance = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 65 },
  { day: "Thu", score: 84 },
  { day: "Fri", score: 79 },
  { day: "Sat", score: 88 },
  { day: "Sun", score: 91 },
];

export interface Recommendation {
  id: string;
  type: "test" | "topic" | "challenge";
  title: string;
  categoryId: string;
  reason: string;
}

export const recommendations: Recommendation[] = [
  { id: "rc1", type: "topic", title: "Brush up: Modern Physics", categoryId: "cat-jee", reason: "Weak subject detected" },
  { id: "rc2", type: "test", title: "NEET Biology · Cell Division", categoryId: "cat-neet", reason: "Based on recent attempts" },
  { id: "rc3", type: "challenge", title: "7-Day Daily Quant Challenge", categoryId: "cat-ssc", reason: "Trending in your category" },
  { id: "rc4", type: "test", title: "JEE Maths · Calculus Sprint", categoryId: "cat-jee", reason: "Boost your strong subject" },
  { id: "rc5", type: "topic", title: "Current Affairs · Last 30 days", categoryId: "cat-upsc", reason: "Weak subject detected" },
];

export interface NotificationPrefs {
  email: boolean;
  push: boolean;
  sms: boolean;
  weeklyDigest: boolean;
  streakReminders: boolean;
  rewardAlerts: boolean;
}

export const defaultNotificationPrefs: NotificationPrefs = {
  email: true,
  push: true,
  sms: false,
  weeklyDigest: true,
  streakReminders: true,
  rewardAlerts: true,
};

export const streakCalendar = Array.from({ length: 14 }).map((_, i) => {
  const date = new Date(Date.now() - (13 - i) * 86400000);
  return {
    date: date.toISOString(),
    label: ["S", "M", "T", "W", "T", "F", "S"][date.getDay()],
    active: i >= 14 - Math.min(student.streakDays, 14),
  };
});
