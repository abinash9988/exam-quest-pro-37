import { categories, purchases, subscriptions, type Category } from "./studentMock";

export const MAX_MESSAGE_LEN = 500;
export const MESSAGES_PER_PAGE = 30;
export const POLL_INTERVAL_MS = 12000;

export interface Community {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  tagline: string;
  gradient: string;
  activeMembers: number;
  totalDiscussions: number;
  dailyMessages: number;
}

export interface Message {
  id: string;
  communityId: string;
  authorName: string;
  authorInitials: string;
  text: string;
  sentAt: string; // ISO
}

export type PinnedKind = "daily" | "alert" | "motivation" | "announcement";

export interface PinnedItem {
  id: string;
  communityId: string;
  kind: PinnedKind;
  title: string;
  body: string;
  postedAt: string;
}

export interface TopContributor {
  name: string;
  initials: string;
  messages: number;
  badges: number;
}

export interface WeeklyActivityPoint {
  day: string;
  messages: number;
}

const minsAgo = (n: number) => new Date(Date.now() - n * 60_000).toISOString();

const communityMeta: Record<string, { name: string; tagline: string; active: number; discussions: number; daily: number }> = {
  "cat-jee": { name: "JEE Aspirants", tagline: "Crack JEE Mains & Advanced together", active: 12480, discussions: 3421, daily: 612 },
  "cat-neet": { name: "NEET Warriors", tagline: "Biology, Chemistry, Physics — daily prep", active: 9824, discussions: 2987, daily: 524 },
  "cat-ssc": { name: "SSC Champions", tagline: "Crack CGL, CHSL, MTS with peers", active: 7211, discussions: 1834, daily: 318 },
  "cat-banking": { name: "Banking Community", tagline: "IBPS, SBI, RBI prep & strategy", active: 5602, discussions: 1542, daily: 274 },
  "cat-upsc": { name: "UPSC Leaders", tagline: "Prelims, Mains and current affairs", active: 8341, discussions: 2231, daily: 401 },
};

export const communities: Community[] = categories.map((c, i) => {
  const meta = communityMeta[c.id] ?? { name: `${c.name} Community`, tagline: "Study together", active: 1000, discussions: 100, daily: 20 };
  return {
    id: `com-${c.slug}`,
    categoryId: c.id,
    slug: c.slug,
    name: meta.name,
    tagline: meta.tagline,
    gradient: c.gradient,
    activeMembers: meta.active + i * 17,
    totalDiscussions: meta.discussions,
    dailyMessages: meta.daily,
  };
});

const sampleAuthors: { name: string; initials: string }[] = [
  { name: "Riya Sharma", initials: "RS" },
  { name: "Ananya Patel", initials: "AP" },
  { name: "Karthik Iyer", initials: "KI" },
  { name: "Meera Joshi", initials: "MJ" },
  { name: "Devansh Rao", initials: "DR" },
  { name: "Pooja Nair", initials: "PN" },
  { name: "Aman Verma", initials: "AV" },
  { name: "Sneha Reddy", initials: "SR" },
  { name: "Harsh Kapoor", initials: "HK" },
  { name: "Ishaan Gupta", initials: "IG" },
];

const samplePrompts: Record<string, string[]> = {
  "cat-jee": [
    "Anyone solved Q22 from JEE 2023 paper? Stuck on the rotational motion part.",
    "Sharing my 60-day Physics revision schedule — DM if you want the sheet.",
    "Which mock series do you rate higher for Advanced — Allen or FIITJEE?",
    "Today I finally cracked Calculus integration tricks. Practice really helps.",
    "Coordinate geometry doubts thread — drop your questions below.",
    "Mole concept revision in 30 mins, who wants to join the study sprint?",
    "Best video lectures for Modern Physics?",
    "Just hit 88 percentile in the latest mock. Aiming for 95+ next week.",
  ],
  "cat-neet": [
    "Plant kingdom MCQs are killing me. Any tips?",
    "Daily Bio target: 90 questions. Anyone in?",
    "Sharing handwritten notes for Human Physiology.",
    "How do you all retain Chemistry reactions long-term?",
    "Mock test today — let's compare scores in the evening.",
    "AIIMS toppers' interview was super motivating, watch it.",
    "Cell division clarification — meiosis II vs mitosis differences?",
    "30 day Biology revision plan, drop a 🌱 to get the PDF.",
  ],
  "cat-ssc": [
    "SSC CGL Tier 1 mock today at 6 PM, who's in?",
    "Quant short tricks — sharing my notes.",
    "English antonyms revision thread.",
    "Reasoning section under 12 mins — how do you do it?",
    "GK current affairs of last week, key headlines.",
    "Tier 2 prep starts now. Need a study buddy.",
    "Anyone preparing for CHSL alongside CGL?",
    "Profit & Loss tricky question — discuss approach.",
  ],
  "cat-banking": [
    "IBPS PO Prelims pattern this year — any leaks?",
    "Data Interpretation speed practice, 20 sets daily.",
    "Quant strategy: skip and revisit or solve in order?",
    "SBI Clerk notification expected soon. Stay ready.",
    "Reasoning puzzles thread — daily 5 puzzles.",
    "English vocab list: 50 words a day, who's joining?",
    "Banking awareness PDF — November edition.",
    "Computer aptitude weak. Resources please?",
  ],
  "cat-upsc": [
    "Daily current affairs discussion — Nov 22.",
    "Anyone following Vision IAS PT365? Worth it?",
    "GS Paper 2 governance answers — how do you structure?",
    "Map practice for Geography — daily 1 region.",
    "Optional subject confusion. PSIR vs Sociology?",
    "Essay paper practice partner needed.",
    "Today's editorial: Indian Express on climate policy.",
    "Prelims 100 days strategy — sharing my plan.",
  ],
};

function genMessages(community: Community, count: number): Message[] {
  const prompts = samplePrompts[community.categoryId] ?? ["Great discussion today!"];
  const msgs: Message[] = [];
  for (let i = 0; i < count; i++) {
    const author = sampleAuthors[i % sampleAuthors.length];
    const text = prompts[i % prompts.length];
    msgs.push({
      id: `${community.id}-m${i}`,
      communityId: community.id,
      authorName: author.name,
      authorInitials: author.initials,
      text,
      sentAt: minsAgo((count - i) * 7 + ((i * 3) % 5)),
    });
  }
  return msgs;
}

export const messagesByCommunity: Record<string, Message[]> = communities.reduce(
  (acc, c) => {
    acc[c.id] = genMessages(c, 40);
    return acc;
  },
  {} as Record<string, Message[]>,
);

const pinnedTemplates: Record<string, Omit<PinnedItem, "id" | "communityId" | "postedAt">[]> = {
  "cat-jee": [
    { kind: "daily", title: "🎯 Daily JEE Discussion", body: "Today's focus: Rotational Mechanics. Drop your doubts and best problems below." },
    { kind: "alert", title: "📢 JEE Mains Session 2 dates announced", body: "Registration closes Dec 12. Don't miss the deadline." },
    { kind: "motivation", title: "💪 You vs Yesterday", body: "Solve 5 more problems today than yesterday. Compounded daily — that's how toppers are built." },
    { kind: "announcement", title: "🏆 Weekly Topper Mock", body: "This Sunday 10 AM. Free entry for subscribers." },
  ],
  "cat-neet": [
    { kind: "daily", title: "🌿 Daily NEET Discussion", body: "Today: Human Reproduction. Share your one-liner notes." },
    { kind: "alert", title: "📢 NTA NEET Syllabus Update", body: "Minor changes in Botany — full PDF in announcements." },
    { kind: "motivation", title: "💪 100 MCQs a day", body: "Consistency beats intensity. Show up every day." },
  ],
  "cat-ssc": [
    { kind: "daily", title: "📋 Daily SSC Discussion", body: "Quant focus today: Time, Speed & Distance." },
    { kind: "alert", title: "📢 SSC CGL Tier 1 admit cards out", body: "Download from official portal. Check exam centre carefully." },
    { kind: "motivation", title: "💪 Crack the pattern", body: "Every wrong answer is feedback. Review honestly." },
  ],
  "cat-banking": [
    { kind: "daily", title: "🏦 Daily Banking Discussion", body: "DI puzzles thread — bring your trickiest set." },
    { kind: "alert", title: "📢 IBPS PO Mains date confirmed", body: "Jan 28. 10 weeks to go — plan accordingly." },
    { kind: "motivation", title: "💪 Speed = Accuracy + Calm", body: "Practice timed sets daily. Mind first, then hand." },
  ],
  "cat-upsc": [
    { kind: "daily", title: "🏛️ Daily UPSC Discussion", body: "Today's editorial: discuss key arguments and counter-points." },
    { kind: "alert", title: "📢 UPSC Prelims notification", body: "Expected by Feb second week. Finish static syllabus before that." },
    { kind: "motivation", title: "💪 Slow is smooth, smooth is fast", body: "Revise more than you read. Retention is the real game." },
  ],
};

export const pinnedByCommunity: Record<string, PinnedItem[]> = communities.reduce((acc, c) => {
  const tpl = pinnedTemplates[c.categoryId] ?? [];
  acc[c.id] = tpl.map((t, i) => ({
    ...t,
    id: `${c.id}-pin-${i}`,
    communityId: c.id,
    postedAt: minsAgo(60 * (i + 1)),
  }));
  return acc;
}, {} as Record<string, PinnedItem[]>);

export const topContributorsByCommunity: Record<string, TopContributor[]> = communities.reduce((acc, c) => {
  acc[c.id] = [
    { name: "Riya Sharma", initials: "RS", messages: 312, badges: 48 },
    { name: "Karthik Iyer", initials: "KI", messages: 287, badges: 41 },
    { name: "Meera Joshi", initials: "MJ", messages: 241, badges: 37 },
    { name: "Aman Verma", initials: "AV", messages: 198, badges: 29 },
    { name: "Pooja Nair", initials: "PN", messages: 174, badges: 26 },
  ];
  return acc;
}, {} as Record<string, TopContributor[]>);

export const weeklyActivityByCommunity: Record<string, WeeklyActivityPoint[]> = communities.reduce((acc, c) => {
  const base = c.dailyMessages;
  acc[c.id] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    messages: Math.round(base * (0.6 + ((i * 17) % 10) / 10 + (i === 6 ? 0.3 : 0))),
  }));
  return acc;
}, {} as Record<string, WeeklyActivityPoint[]>);

// --- access ---

export function hasCommunityAccess(categoryId: string): boolean {
  const subActive = subscriptions.some((s) => s.categoryId === categoryId && s.status === "active");
  const purchaseActive = purchases.some((p) => p.categoryId === categoryId && p.status === "active");
  return subActive || purchaseActive;
}

export function getCommunityBySlug(slug: string): Community | undefined {
  return communities.find((c) => c.slug === slug);
}

export function getCategoryForCommunity(c: Community): Category | undefined {
  return categories.find((cat) => cat.id === c.categoryId);
}

export function joinedCommunities(): Community[] {
  return communities.filter((c) => hasCommunityAccess(c.categoryId));
}

export function lockedCommunities(): Community[] {
  return communities.filter((c) => !hasCommunityAccess(c.categoryId));
}

// "Live" message simulation pool
export const incomingMessagePool: { name: string; initials: string; text: string }[] = [
  { name: "Tanya Bose", initials: "TB", text: "Just joined — what's today's focus?" },
  { name: "Rohan Das", initials: "RD", text: "Mock score: 72%. Improving!" },
  { name: "Sara Khan", initials: "SK", text: "Anyone has revision notes for today's topic?" },
  { name: "Vivek Menon", initials: "VM", text: "Solved 50 MCQs in 40 mins. New PB." },
  { name: "Nikita Roy", initials: "NR", text: "Sharing my mind-map in a bit." },
];
