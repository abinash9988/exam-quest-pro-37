import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { categories, testimonials } from "@/lib/mockData";
import { BarChart3, Smartphone, Target, Trophy, ArrowRight, Check, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MockArena · Free Online Mock Tests for JEE, NEET, SSC, UPSC, Banking" },
      { name: "description", content: "Practice with real-exam style mock tests. Detailed analysis, rank prediction, and mobile-first interface. 3 free tests, then just ₹9." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <Hero />
      <Categories />
      <Features />
      <Pricing />
      <Testimonials />
      <Footer />
      <BottomNav />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-[0.08]" />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" /> Trusted by 2M+ aspirants
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Crack any exam with <span className="bg-[var(--gradient-hero)] bg-clip-text text-transparent">real mock tests</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Practice like the actual exam. Get AI-powered analysis, rank prediction & weak topic detection — all on your phone.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:scale-[1.02] sm:w-auto"
            >
              Start Free Mock Test
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/auth" search={{ mode: "signin" }} className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
              Already have an account? Sign in →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> 3 free tests</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> No credit card</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> Mobile optimized</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Choose your exam</h2>
      <p className="mt-1 text-sm text-muted-foreground">Pick a category to explore mock tests.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/mock-test/$slug"
            params={{ slug: c.slug }}
            className="group rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
          >
            <div className={`mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-xl`}>{c.icon}</div>
            <div className="text-sm font-bold">{c.name}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{c.testCount} tests</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: BarChart3, title: "Detailed Analysis", desc: "Subject-wise, topic-wise breakdown of every attempt." },
  { icon: Trophy, title: "Rank Prediction", desc: "ML-driven AIR prediction with 92% accuracy." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Optimised for 360px devices. No horizontal scroll." },
  { icon: Target, title: "Real Exam Experience", desc: "UI that mirrors the actual exam interface." },
];

function Features() {
  return (
    <section className="bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Why MockArena</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Simple, honest pricing</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pay only for what you use.</p>
      </div>
      <div className="mx-auto mt-6 grid max-w-3xl gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starter</div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-bold">Free</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">3 full-length mock tests</p>
          <ul className="mt-5 space-y-2 text-sm">
            {["3 free mock tests", "Basic analysis", "Mobile access"].map((x) => (
              <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--success)]" />{x}</li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-[var(--gradient-card)] p-6 shadow-[var(--shadow-elevated)]">
          <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Popular</span>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Pay-as-you-go</div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-bold">₹9</span>
            <span className="text-sm text-muted-foreground">/ extra test</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Unlock advanced insights</p>
          <ul className="mt-5 space-y-2 text-sm">
            {["Unlimited tests", "AI rank prediction", "Weak topic detection", "Question-level review"].map((x) => (
              <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--success)]" />{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Loved by toppers</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex gap-0.5 text-[var(--warning)]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              <p className="mt-3 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-hero)] text-xs font-bold text-primary-foreground">{t.avatar}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <div className="text-base font-bold">MockArena</div>
          <p className="mt-2 text-xs text-muted-foreground">India's mobile-first exam practice platform.</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exams</div>
          <ul className="mt-3 space-y-1.5 text-xs">
            {categories.slice(0, 4).map((c) => <li key={c.slug}><Link to="/mock-test/$slug" params={{ slug: c.slug }} className="hover:text-primary">{c.fullName}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>About</li><li>Careers</li><li>Contact</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</div>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>Privacy</li><li>Terms</li><li>Refund</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© 2026 MockArena. All rights reserved.</div>
    </footer>
  );
}
