import { Plus, Trash2, ImagePlus, Check } from "lucide-react";
import type { QOption, QuestionType } from "@/lib/adminMock";
import { RichTextEditor } from "./RichTextEditor";

interface Props {
  options: QOption[];
  type: QuestionType;
  onChange: (opts: QOption[]) => void;
}

export function OptionEditor({ options, type, onChange }: Props) {
  const multi = type === "MCQ_MULTI";

  const update = (id: string, patch: Partial<QOption>) =>
    onChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const toggleCorrect = (id: string) =>
    onChange(
      options.map((o) =>
        multi
          ? o.id === id
            ? { ...o, isCorrect: !o.isCorrect }
            : o
          : { ...o, isCorrect: o.id === id }
      )
    );

  const add = () =>
    onChange([...options, { id: `o${Date.now()}`, html: "", isCorrect: false }]);

  const remove = (id: string) => onChange(options.filter((o) => o.id !== id));

  const uploadImage = (id: string, files: FileList | null) => {
    if (!files?.[0]) return;
    update(id, { imageUrl: URL.createObjectURL(files[0]) });
  };

  return (
    <div className="space-y-2">
      {options.map((o, i) => (
        <div
          key={o.id}
          className={`rounded-xl border p-3 transition ${
            o.isCorrect ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_8%,transparent)]" : "border-border bg-background"
          }`}
        >
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => toggleCorrect(o.id)}
              title={multi ? "Toggle correct" : "Mark correct"}
              className={`mt-1 grid h-6 w-6 shrink-0 place-items-center ${
                multi ? "rounded-md" : "rounded-full"
              } border-2 transition ${
                o.isCorrect ? "border-[var(--success)] bg-[var(--success)] text-white" : "border-border text-transparent"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Option {String.fromCharCode(65 + i)}</span>
                <div className="flex items-center gap-1">
                  <label className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <ImagePlus className="h-3.5 w-3.5" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(o.id, e.target.files)} />
                  </label>
                  {options.length > 2 && type !== "TRUE_FALSE" && (
                    <button type="button" onClick={() => remove(o.id)} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-[var(--destructive)]">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <RichTextEditor value={o.html} onChange={(html) => update(o.id, { html })} placeholder="Option text…" minHeight={60} />
              {o.imageUrl && (
                <img src={o.imageUrl} alt="option" className="mt-2 max-h-32 rounded-lg border border-border" />
              )}
            </div>
          </div>
        </div>
      ))}

      {type !== "TRUE_FALSE" && (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" /> Add option
        </button>
      )}
    </div>
  );
}
