import type { WorkflowEvent } from "@/lib/adminMock";
import { StatusBadge } from "./StatusBadge";

export function WorkflowTimeline({ events }: { events: WorkflowEvent[] }) {
  if (!events.length) return <div className="text-xs text-muted-foreground">No workflow history yet.</div>;
  return (
    <ol className="relative space-y-3 border-l border-border pl-4">
      {events.slice().reverse().map((e) => (
        <li key={e.id} className="relative">
          <span className="absolute -left-[21px] top-1 grid h-3 w-3 place-items-center rounded-full border-2 border-background bg-primary" />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {e.from && <><StatusBadge status={e.from} /><span className="text-muted-foreground">→</span></>}
            <StatusBadge status={e.to} />
            <span className="text-muted-foreground">by <span className="font-semibold text-foreground">{e.actor}</span></span>
            <span className="ml-auto text-[10px] text-muted-foreground">{new Date(e.at).toLocaleString()}</span>
          </div>
          {e.note && <div className="mt-1 text-xs text-muted-foreground">{e.note}</div>}
        </li>
      ))}
    </ol>
  );
}
