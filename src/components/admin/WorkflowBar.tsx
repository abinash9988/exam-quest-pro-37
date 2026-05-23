import { Loader2, CheckCircle2, Save, Send, X, Archive, RotateCcw, Upload as PubIcon } from "lucide-react";
import { allowedTransitions, type QuestionStatus } from "@/lib/adminMock";
import { StatusBadge } from "./StatusBadge";
import { formatAgo, type AutosaveStatus } from "@/hooks/useAutosave";

const labels: Record<QuestionStatus, { label: string; icon: typeof Save; tone: string }> = {
  Draft:     { label: "Save Draft",       icon: Save,     tone: "border-border" },
  Review:    { label: "Submit for Review", icon: Send,     tone: "bg-[var(--review)] text-white border-transparent" },
  Approved:  { label: "Approve",          icon: CheckCircle2, tone: "bg-[var(--success)] text-white border-transparent" },
  Published: { label: "Publish",          icon: PubIcon,  tone: "bg-primary text-primary-foreground border-transparent" },
  Rejected:  { label: "Reject",           icon: X,        tone: "bg-[var(--destructive)] text-white border-transparent" },
  Archived:  { label: "Archive",          icon: Archive,  tone: "border-border" },
};

interface Props {
  status: QuestionStatus;
  saveStatus: AutosaveStatus;
  lastSavedAt: Date | null;
  onTransition: (to: QuestionStatus) => void;
  onCancel: () => void;
}

export function WorkflowBar({ status, saveStatus, lastSavedAt, onTransition, onCancel }: Props) {
  const allowed = allowedTransitions[status];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur-md md:left-64">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Cancel</button>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <StatusBadge status={status} />
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {saveStatus === "saving" && <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>}
            {saveStatus === "saved" && <><CheckCircle2 className="h-3 w-3 text-[var(--success)]" /> Draft saved · {formatAgo(lastSavedAt)}</>}
            {saveStatus === "idle" && <><RotateCcw className="h-3 w-3" /> Autosave on</>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {allowed.map((t) => {
            const cfg = labels[t];
            const Icon = cfg.icon;
            return (
              <button
                key={t}
                onClick={() => onTransition(t)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:opacity-90 ${cfg.tone}`}
              >
                <Icon className="h-3.5 w-3.5" /> {cfg.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
