import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";

export type FieldDef = { key: string; label: string; type: "text" | "textarea" | "image" | "number" | "bool" | "list" | "date"; hint?: string; required?: boolean; wide?: boolean };

const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function ImageField({ value, onChange, label, fallback }: { value: string; onChange: (v: string) => void; label: string; fallback?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function pick(file?: File) {
    if (!file) return;
    setBusy(true);
    try { onChange(await adminService.upload(file)); toast.success("Image uploaded"); } catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); } finally { setBusy(false); if (ref.current) ref.current.value = ""; }
  }
  const shown = value || fallback;
  return <div>
    <p className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">{label}</p>
    <div className="flex flex-wrap items-start gap-4">
      <div className="grid h-28 w-44 place-items-center overflow-hidden border border-border bg-secondary">{shown ? <img src={shown} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="size-6 text-muted-foreground" />}</div>
      <div className="space-y-2">
        <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">{busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}{value ? "Replace image" : "Upload image"}</button>
        {value && <button type="button" onClick={() => onChange("")} className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-destructive"><Trash2 className="size-3.5" />{fallback ? "Use default" : "Remove"}</button>}
        {!value && fallback && <p className="text-xs text-muted-foreground">Currently using the default image.</p>}
      </div>
    </div>
  </div>;
}

export function FieldInput({ f, value, onChange }: { f: FieldDef; value: any; onChange: (v: any) => void }) {
  if (f.type === "image") return <div className="sm:col-span-2"><ImageField label={f.label} value={value ?? ""} onChange={onChange} /></div>;
  if (f.type === "bool") return <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" className="size-4 accent-primary" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />{f.label}</label>;
  const wide = f.type === "textarea" || f.type === "list" || f.wide;
  return <div className={wide ? "sm:col-span-2" : ""}>
    <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">{f.label}{f.required && " *"}</label>
    {f.type === "textarea" ? <textarea className={`${inputCls} min-h-28`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      : f.type === "list" ? <textarea className={`${inputCls} min-h-24`} placeholder="One item per line" value={Array.isArray(value) ? value.join("\n") : ""} onChange={(e) => onChange(e.target.value.split("\n"))} />
      : <input className={inputCls} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} value={value ?? ""} onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)} />}
    {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
  </div>;
}
