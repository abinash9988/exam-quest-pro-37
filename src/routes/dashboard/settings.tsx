import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SectionHeader } from "@/components/student/SectionHeader";
import { defaultNotificationPrefs, type NotificationPrefs } from "@/lib/studentMock";
import { toast } from "sonner";
import { Lock, Smartphone, Bell, Shield, Palette, LogOut, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings · MockArena" },
      { name: "description", content: "Manage your account, notifications, privacy and appearance." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultNotificationPrefs);
  const set = <K extends keyof NotificationPrefs>(k: K, v: boolean) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your account & experience.</p>
      </header>

      {/* Security */}
      <Section icon={Lock} title="Security" subtitle="Password & login sessions">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Current password"><Input type="password" placeholder="••••••••" /></Field>
          <Field label="New password"><Input type="password" placeholder="••••••••" /></Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => toast.success("Password updated")}>Update password</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("All other sessions logged out")} className="gap-1.5">
            <LogOut className="h-3.5 w-3.5" /> Logout all devices
          </Button>
        </div>
      </Section>

      {/* Account */}
      <Section icon={Smartphone} title="Account" subtitle="Contact information">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Mobile number"><Input defaultValue="+91 98765 43210" /></Field>
          <Field label="Backup email"><Input type="email" placeholder="backup@example.com" /></Field>
        </div>
        <Button size="sm" className="mt-4" onClick={() => toast.success("Account details saved")}>Save</Button>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" subtitle="Choose how we reach you">
        <div className="divide-y divide-border/60">
          <ToggleRow label="Email updates" hint="Weekly digests and important account emails" value={prefs.email} onChange={(v) => set("email", v)} />
          <ToggleRow label="Push notifications" hint="Mobile app & browser pushes" value={prefs.push} onChange={(v) => set("push", v)} />
          <ToggleRow label="SMS alerts" hint="Critical alerts only" value={prefs.sms} onChange={(v) => set("sms", v)} />
          <ToggleRow label="Weekly digest" hint="Performance summary every Sunday" value={prefs.weeklyDigest} onChange={(v) => set("weeklyDigest", v)} />
          <ToggleRow label="Streak reminders" hint="Nudge me before my streak breaks" value={prefs.streakReminders} onChange={(v) => set("streakReminders", v)} />
          <ToggleRow label="Reward alerts" hint="Notify when I unlock a new reward tier" value={prefs.rewardAlerts} onChange={(v) => set("rewardAlerts", v)} />
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance" subtitle="Theme & visual preferences">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
          <div>
            <div className="text-sm font-semibold">Dark mode</div>
            <div className="text-[11px] text-muted-foreground">Easier on your eyes during night practice.</div>
          </div>
          <ThemeToggle />
        </div>
      </Section>

      {/* Privacy */}
      <Section icon={Shield} title="Privacy" subtitle="Control your data">
        <div className="divide-y divide-border/60">
          <ToggleRow label="Show me on leaderboards" hint="Appear in public rank lists" value onChange={() => {}} />
          <ToggleRow label="Allow personalized recommendations" hint="Use my attempts to suggest content" value onChange={() => {}} />
          <ToggleRow label="Share usage analytics" hint="Helps us improve MockArena" value={false} onChange={() => {}} />
        </div>
      </Section>

      {/* Danger zone */}
      <Section icon={AlertTriangle} title="Danger zone" subtitle="Irreversible actions" tone="destructive">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <div>
            <div className="text-sm font-semibold text-destructive">Delete account</div>
            <div className="text-[11px] text-muted-foreground">Permanently remove your data, attempts and rewards.</div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => toast.error("Delete account", { description: "Mock action — wire up a backend to enable." })}
          >
            Delete
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon: Icon, title, subtitle, tone, children,
}: { icon: typeof Lock; title: string; subtitle?: string; tone?: "destructive"; children: React.ReactNode }) {
  return (
    <section className={`rounded-3xl border bg-card p-5 shadow-[var(--shadow-card)] ${tone === "destructive" ? "border-destructive/30" : "border-border/60"}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone === "destructive" ? "bg-destructive/15 text-destructive" : "bg-primary-soft text-primary"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-bold">{title}</h2>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({ label, hint, value, onChange }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-[11px] text-muted-foreground">{hint}</div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
