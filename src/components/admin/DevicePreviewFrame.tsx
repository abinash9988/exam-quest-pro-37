import { useState } from "react";
import { Smartphone, Monitor } from "lucide-react";

export function DevicePreviewFrame({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 text-xs">
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 ${device === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Mobile
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 ${device === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            <Monitor className="h-3.5 w-3.5" /> Desktop
          </button>
        </div>
      </div>
      <div className="flex justify-center rounded-2xl border border-border bg-muted/30 p-4">
        <div
          className="overflow-hidden rounded-[28px] border-4 border-foreground/20 bg-background shadow-[var(--shadow-elevated)] transition-all"
          style={{ width: device === "mobile" ? 360 : "100%", maxWidth: "100%" }}
        >
          <div className="flex h-7 items-center justify-center bg-foreground/5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            mockarena · exam preview
          </div>
          <div className="p-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
