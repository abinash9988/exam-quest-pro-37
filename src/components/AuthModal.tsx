import { useState } from "react";
import { X, Phone, ShieldCheck } from "lucide-react";

export function AuthModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  if (!open) return null;

  const updateOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 3) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-background p-6 shadow-[var(--shadow-elevated)] animate-in zoom-in-95">
        <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-muted">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--gradient-hero)] text-primary-foreground">
          {step === "phone" ? <Phone className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
        </div>
        {step === "phone" ? (
          <>
            <h2 className="text-xl font-bold">Login to unlock analysis</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll send a 4-digit OTP on your mobile.</p>
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3">
              <span className="text-sm font-semibold text-muted-foreground">+91</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter mobile number"
                inputMode="numeric"
                className="flex-1 bg-transparent text-base outline-none"
              />
            </div>
            <button
              disabled={phone.length !== 10}
              onClick={() => setStep("otp")}
              className="mt-4 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition disabled:opacity-50"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">Enter OTP</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sent to +91 {phone}. <button onClick={() => setStep("phone")} className="text-primary">Change</button></p>
            <div className="mt-5 flex justify-between gap-3">
              {otp.map((v, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={v}
                  onChange={(e) => updateOtp(i, e.target.value)}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-14 w-14 rounded-2xl border-2 border-border bg-muted/40 text-center text-xl font-bold outline-none focus:border-primary"
                />
              ))}
            </div>
            <button
              disabled={otp.some((v) => !v)}
              onClick={() => onSuccess?.()}
              className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-50"
            >
              Verify & Continue
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Didn't receive? Resend in 30s</p>
          </>
        )}
      </div>
    </div>
  );
}
