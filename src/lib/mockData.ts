export interface ExamCategory {
  slug: string;
  name: string;
  fullName: string;
  icon: string;
  color: string;
  testCount: number;
  description: string;
}

export interface MockTest {
  id: string;
  slug: string;
  title: string;
  category: string;
  subject: string;
  duration: number; // minutes
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  attempts: number;
}

export interface Question {
  id: number;
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export const categories: ExamCategory[] = [
  { slug: "jee-mains", name: "JEE", fullName: "JEE Mains & Advanced", icon: "⚛️", color: "from-indigo-500 to-purple-600", testCount: 142, description: "Joint Entrance Examination for engineering aspirants. Includes Physics, Chemistry and Mathematics." },
  { slug: "neet", name: "NEET", fullName: "NEET UG", icon: "🧬", color: "from-emerald-500 to-teal-600", testCount: 128, description: "National Eligibility cum Entrance Test for medical aspirants." },
  { slug: "ssc", name: "SSC", fullName: "SSC CGL / CHSL", icon: "📋", color: "from-orange-500 to-red-500", testCount: 96, description: "Staff Selection Commission exams for government posts." },
  { slug: "upsc", name: "UPSC", fullName: "UPSC Civil Services", icon: "🏛️", color: "from-amber-500 to-orange-600", testCount: 84, description: "Civil Services Examination by Union Public Service Commission." },
  { slug: "banking", name: "Banking", fullName: "Banking & Insurance", icon: "🏦", color: "from-blue-500 to-cyan-600", testCount: 110, description: "IBPS, SBI PO, RBI and other banking exams." },
];

export const mockTests: MockTest[] = [
  { id: "jee-mains-01", slug: "jee-mains-01", title: "JEE Mains Full Test 01", category: "jee-mains", subject: "PCM", duration: 180, questions: 75, difficulty: "Hard", attempts: 12450 },
  { id: "jee-mains-02", slug: "jee-mains-02", title: "JEE Mains Physics Sprint", category: "jee-mains", subject: "Physics", duration: 60, questions: 25, difficulty: "Medium", attempts: 8230 },
  { id: "neet-01", slug: "neet-01", title: "NEET Full Mock 01", category: "neet", subject: "PCB", duration: 200, questions: 180, difficulty: "Hard", attempts: 15600 },
  { id: "neet-02", slug: "neet-02", title: "NEET Biology Booster", category: "neet", subject: "Biology", duration: 45, questions: 45, difficulty: "Easy", attempts: 6710 },
  { id: "ssc-01", slug: "ssc-01", title: "SSC CGL Tier 1 Mock", category: "ssc", subject: "General", duration: 60, questions: 100, difficulty: "Medium", attempts: 9420 },
  { id: "upsc-01", slug: "upsc-01", title: "UPSC Prelims GS Paper", category: "upsc", subject: "GS", duration: 120, questions: 100, difficulty: "Hard", attempts: 4300 },
  { id: "banking-01", slug: "banking-01", title: "IBPS PO Prelims Mock", category: "banking", subject: "Reasoning", duration: 60, questions: 100, difficulty: "Medium", attempts: 11200 },
  { id: "banking-02", slug: "banking-02", title: "SBI Clerk Quant", category: "banking", subject: "Quant", duration: 30, questions: 35, difficulty: "Easy", attempts: 5410 },
];

export const sampleQuestions: Question[] = [
  { id: 1, subject: "Physics", text: "A particle moves in a circle of radius 5 m with constant speed of 10 m/s. What is its centripetal acceleration?", options: ["10 m/s²", "20 m/s²", "25 m/s²", "50 m/s²"], correctIndex: 1 },
  { id: 2, subject: "Physics", text: "The dimensional formula of Planck's constant is:", options: ["[ML²T⁻¹]", "[ML²T⁻²]", "[MLT⁻¹]", "[ML²T⁻³]"], correctIndex: 0 },
  { id: 3, subject: "Chemistry", text: "Which of the following is the strongest reducing agent?", options: ["F⁻", "Cl⁻", "Br⁻", "I⁻"], correctIndex: 3 },
  { id: 4, subject: "Chemistry", text: "The IUPAC name of CH₃-CH(OH)-CH₃ is:", options: ["Propan-1-ol", "Propan-2-ol", "Propanal", "Propanone"], correctIndex: 1 },
  { id: 5, subject: "Maths", text: "If sin θ + cos θ = 1, then sin θ · cos θ equals:", options: ["0", "1/2", "1", "-1/2"], correctIndex: 0 },
  { id: 6, subject: "Maths", text: "The derivative of x · ln(x) is:", options: ["ln(x)", "1 + ln(x)", "1/x", "x"], correctIndex: 1 },
  { id: 7, subject: "Maths", text: "The number of real roots of x² + 1 = 0 is:", options: ["0", "1", "2", "Infinite"], correctIndex: 0 },
  { id: 8, subject: "Physics", text: "Escape velocity from Earth's surface is approximately:", options: ["7.9 km/s", "9.8 km/s", "11.2 km/s", "15 km/s"], correctIndex: 2 },
  { id: 9, subject: "Chemistry", text: "The pH of a 0.001 M HCl solution is:", options: ["1", "2", "3", "4"], correctIndex: 2 },
  { id: 10, subject: "Maths", text: "∫(1/x) dx equals:", options: ["x", "ln|x| + C", "1/x² + C", "e^x + C"], correctIndex: 1 },
];

export const testimonials = [
  { name: "Priya Sharma", role: "JEE 2024 · AIR 1247", text: "The detailed analysis after each mock helped me identify weak areas. Cracked JEE Mains in the first attempt!", avatar: "PS" },
  { name: "Rahul Verma", role: "NEET 2024", text: "The exam interface feels exactly like the real NEET. Mobile experience is unbelievably smooth.", avatar: "RV" },
  { name: "Anjali Singh", role: "SBI PO 2024", text: "Affordable pricing, accurate rank predictions and clean UI. Highly recommended for serious aspirants.", avatar: "AS" },
];

export const faqs = [
  { q: "How many free tests do I get?", a: "Every new user gets 3 full-length mock tests absolutely free. After that, each test costs just ₹9." },
  { q: "Is the analysis truly detailed?", a: "Yes. You get subject-wise accuracy, time per question, weak topics, and AI-driven rank prediction." },
  { q: "Can I take tests on mobile?", a: "Absolutely. Our platform is mobile-first and works flawlessly on devices as small as 360px wide." },
  { q: "Is rank prediction reliable?", a: "Our ML model is trained on 5 years of real exam data and has 92% accuracy within ±500 ranks." },
];
