import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap, ArrowLeft, ShieldCheck } from "lucide-react";
import { authStore, useAuth } from "@/lib/authStore";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In · MockArena" },
      { name: "description", content: "Sign in or create your MockArena account to start practicing." },
    ],
  }),
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    const user = authStore.getUser();
    if (user) {
      if (user.role === "admin") throw redirect({ to: "/admin" });
      throw redirect({ to: search.redirect ?? "/dashboard" });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const { mode = "signin", redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate({ to: "/admin" });
      else navigate({ to: redirect ?? "/dashboard" });
    }
  }, [user, navigate, redirect]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)] opacity-[0.08]" />
      <div className="absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="my-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-hero)] text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">MockArena</span>
        </div>

        <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-md">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1 text-sm font-semibold">
            <Link
              to="/auth"
              search={{ mode: "signin", redirect }}
              className={`rounded-full py-2 text-center transition ${
                mode === "signin" ? "bg-background text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup", redirect }}
              className={`rounded-full py-2 text-center transition ${
                mode === "signup" ? "bg-background text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"
              }`}
            >
              Sign Up
            </Link>
          </div>

          {mode === "signup" ? <SignUpForm redirect={redirect} /> : <SignInForm redirect={redirect} />}

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            Admins: sign in with your admin email to access the panel.
          </p>
        </div>
      </div>
    </div>
  );
}

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name too short").max(60),
    email: z.string().trim().email("Enter a valid email").max(255),
    password: z.string().min(6, "At least 6 characters").max(100),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

function SignInForm({ redirect }: { redirect?: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const user = authStore.signIn(parsed.data);
      if (user.role === "admin") navigate({ to: "/admin" });
      else navigate({ to: redirect ?? "/dashboard" });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Sign in failed" });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h1 className="text-xl font-bold">Welcome back</h1>
      <p className="-mt-1 text-xs text-muted-foreground">Sign in to continue your prep.</p>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <input
          type={show ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </Field>

      {errors.form && <p className="rounded-lg bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] px-3 py-2 text-xs text-[var(--destructive)]">{errors.form}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        New here?{" "}
        <Link to="/auth" search={{ mode: "signup", redirect }} className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </form>
  );
}

function SignUpForm({ redirect }: { redirect?: string }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({ name, email, password, confirm });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const user = authStore.signUp(parsed.data);
      if (user.role === "admin") navigate({ to: "/admin" });
      else navigate({ to: redirect ?? "/dashboard" });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Sign up failed" });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h1 className="text-xl font-bold">Create your account</h1>
      <p className="-mt-1 text-xs text-muted-foreground">Start with 3 free mock tests.</p>

      <Field label="Full name" error={errors.name}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Aarav Sharma"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <input
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </Field>

      <Field label="Confirm password" error={errors.confirm}>
        <input
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat password"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </Field>

      {errors.form && <p className="rounded-lg bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] px-3 py-2 text-xs text-[var(--destructive)]">{errors.form}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth" search={{ mode: "signin", redirect }} className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`flex items-center gap-2 rounded-2xl border bg-muted/40 px-3.5 py-3 transition focus-within:border-primary ${
          error ? "border-[var(--destructive)]" : "border-border"
        }`}
      >
        {children}
      </div>
      {error && <p className="mt-1 text-[11px] text-[var(--destructive)]">{error}</p>}
    </label>
  );
}
