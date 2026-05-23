import { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { tagCatalog, tagColor } from "@/lib/adminMock";

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: Props) {
  const [v, setV] = useState("");
  const [focus, setFocus] = useState(false);

  const suggestions = useMemo(() => {
    const q = v.trim().toLowerCase();
    return tagCatalog
      .filter((t) => !tags.includes(t.slug))
      .filter((t) => !q || t.label.toLowerCase().includes(q) || t.slug.includes(q))
      .slice(0, 5);
  }, [v, tags]);

  const add = (slug: string) => {
    const s = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!s || tags.includes(s)) return;
    onChange([...tags, s]);
    setV("");
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5">
        {tags.map((t) => {
          const c = tagColor(t);
          return (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: `color-mix(in oklab, ${c} 16%, transparent)`,
                color: c,
              }}
            >
              {tagCatalog.find((x) => x.slug === t)?.label ?? t}
              <button onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(v);
            }
            if (e.key === "Backspace" && !v && tags.length) onChange(tags.slice(0, -1));
          }}
          placeholder={tags.length ? "Add tag…" : "Add tags (Enter to add)"}
          className="flex-1 min-w-[100px] bg-transparent text-xs outline-none"
        />
        <button onClick={() => add(v)} className="text-muted-foreground" aria-label="Add tag">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {focus && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-popover p-1 shadow-[var(--shadow-elevated)]">
          {suggestions.map((s) => (
            <button
              key={s.slug}
              onMouseDown={(e) => {
                e.preventDefault();
                add(s.slug);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">{s.slug}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
