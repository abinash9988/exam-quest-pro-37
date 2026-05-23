import { useState } from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";

type Device = "mobile" | "tablet" | "desktop";
const sizes: Record<Device, number | string> = { mobile: 360, tablet: 600, desktop: "100%" };

export function DevicePreviewFrame({ children, defaultDevice = "mobile" }: { children: React.ReactNode; defaultDevice?: Device }) {
  const [device, setDevice] = useState<Device>(defaultDevice);
  const tabs: { id: Device; icon: typeof Smartphone; label: string }[] = [
    { id: "mobile", icon: Smartphone, label: "Mobile" },
    { id: "tablet", icon: Tablet, label: "Tablet" },
    { id: "desktop", icon: Monitor, label: "Desktop" },
  ];
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 text-xs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setDevice(t.id)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 ${device === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <t.icon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center rounded-2xl border border-border bg-muted/30 p-3">
        <div
          className="overflow-hidden rounded-[28px] border-4 border-foreground/20 bg-background shadow-[var(--shadow-elevated)] transition-all"
          style={{ width: sizes[device], maxWidth: "100%" }}
        >
          <div className="flex h-7 items-center justify-center bg-foreground/5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            mockarena · {device} preview
          </div>
          <div className="p-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
