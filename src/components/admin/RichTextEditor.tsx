import { useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Table as TableIcon, Sigma, Image as ImageIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({ value, onChange, placeholder = "Start typing…", minHeight = 140 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertHtml = (html: string) => {
    if (!ref.current) return;
    ref.current.focus();
    document.execCommand("insertHTML", false, html);
    onChange(ref.current.innerHTML);
  };

  const insertFormula = () => {
    const f = prompt("Enter LaTeX-like formula", "E = mc^2");
    if (f) insertHtml(`<code class="formula rounded bg-primary-soft px-1.5 py-0.5 font-mono text-primary">${f}</code>&nbsp;`);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.[0]) return;
    const url = URL.createObjectURL(files[0]);
    insertHtml(`<img src="${url}" class="my-2 max-h-48 rounded-lg" alt="upload" />`);
  };

  const tools = [
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: List, label: "Bullet list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    { icon: TableIcon, label: "Table", run: () => insertHtml('<table class="my-2 w-full border-collapse text-sm"><tr><td class="border p-1">a</td><td class="border p-1">b</td></tr><tr><td class="border p-1">c</td><td class="border p-1">d</td></tr></table>') },
    { icon: Sigma, label: "Formula", run: insertFormula },
  ];

  return (
    <div className={`rounded-xl border bg-background transition ${dragOver ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
            title={t.label}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <t.icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <label className="ml-auto flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-background hover:text-foreground">
          <ImageIcon className="h-3.5 w-3.5" /> Upload
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className="prose prose-sm dark:prose-invert max-w-none p-3 text-sm outline-none [&:empty]:before:text-muted-foreground [&:empty]:before:content-[attr(data-placeholder)]"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
