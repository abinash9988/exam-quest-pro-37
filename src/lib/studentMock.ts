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
