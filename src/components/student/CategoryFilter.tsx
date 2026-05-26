import { categories } from "@/lib/studentMock";

interface Props {
  value: string; // "all" or categoryId
  onChange: (v: string) => void;
}

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      <button
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
          value === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"
        }`}
      >
        All
      </button>
      {categories.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active ? "border-transparent bg-gradient-to-br text-white " + c.gradient : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            <span className="mr-1">{c.icon}</span>{c.name}
          </button>
        );
      })}
    </div>
  );
}
