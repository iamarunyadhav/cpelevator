import { useEffect, useRef, useState } from "react";
import { BarChart3, Building2, Copy, FileText, ImagePlus, Inbox, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminService, type QuoteStatus } from "@/services/adminService";
import { fieldGroups } from "@/content/fields";
import { FieldInput, ImageField, type FieldDef } from "./fields";

const statuses: QuoteStatus[] = ["new", "contacted", "site_visit_planned", "quoted", "won", "closed", "cancelled"];
const err = (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong");
const fmt = (d: string) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

export function Dashboard({ go }: { go: (v: string) => void }) {
  const [d, setD] = useState<Awaited<ReturnType<typeof adminService.dashboard>> | null>(null);
  useEffect(() => { adminService.dashboard().then(setD).catch(err); }, []);
  const cards = [["Quote Requests", "Quote requests", d?.quotes, Inbox], ["Contact Messages", "Contact messages", d?.messages, MessageSquare], ["Projects", "Published projects", d?.projects, Building2], ["Blog", "Published posts", d?.posts, FileText], ["Services", "Active services", d?.services, BarChart3]] as const;
  return <div className="space-y-8">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([view, label, value, Icon]) => <button key={label} onClick={() => go(view)} className="border border-border bg-card p-5 text-left transition-colors hover:border-primary"><Icon className="size-5 text-accent" /><p className="mt-6 text-sm text-muted-foreground">{label}</p><p className="mt-1 font-display text-4xl font-bold">{value === undefined ? "—" : String(value)}</p></button>)}</div>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="border border-border bg-card"><h2 className="border-b border-border p-4 font-bold">Latest quote requests</h2>{d?.latestQuotes.map((q) => <div key={q.id} className="flex justify-between gap-3 border-b border-border p-4 text-sm last:border-0"><div><p className="font-bold">{q.full_name}</p><p className="text-muted-foreground">{q.reference} · {q.service_type}</p></div><span className="text-xs text-muted-foreground">{fmt(q.created_at)}</span></div>)}{d && !d.latestQuotes.length && <p className="p-4 text-sm text-muted-foreground">No quote requests yet.</p>}</section>
      <section className="border border-border bg-card"><h2 className="border-b border-border p-4 font-bold">Latest messages</h2>{d?.latestMessages.map((m) => <div key={m.id} className="flex justify-between gap-3 border-b border-border p-4 text-sm last:border-0"><div><p className="font-bold">{m.name}</p><p className="text-muted-foreground">{m.subject}</p></div><span className="text-xs text-muted-foreground">{fmt(m.created_at)}</span></div>)}{d && !d.latestMessages.length && <p className="p-4 text-sm text-muted-foreground">No messages yet.</p>}</section>
    </div>
  </div>;
}

export function Quotes() {
  const [rows, setRows] = useState<any[]>([]); const [filter, setFilter] = useState("all"); const [search, setSearch] = useState(""); const [open, setOpen] = useState<any | null>(null);
  const [notes, setNotes] = useState<any[]>([]); const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  useEffect(() => { adminService.quotes().then(setRows).catch(err); }, []);
  useEffect(() => { if (open) { adminService.quoteNotes(open.id).then(setNotes); adminService.quoteAttachments(open.id).then(setFiles); } }, [open?.id]);
  const shown = rows.filter((r) => (filter === "all" || r.status === filter) && `${r.reference} ${r.full_name} ${r.phone} ${r.email}`.toLowerCase().includes(search.toLowerCase()));
  async function setStatus(id: string, status: QuoteStatus) { try { await adminService.updateQuote(id, status); setRows((v) => v.map((x) => x.id === id ? { ...x, status } : x)); setOpen((o: any) => o && o.id === id ? { ...o, status } : o); } catch (e) { err(e); } }
  async function del(id: string) { if (!confirm("Delete this quote request permanently?")) return; try { await adminService.deleteQuote(id); setRows((v) => v.filter((x) => x.id !== id)); setOpen(null); } catch (e) { err(e); } }
  async function addNote(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const f = e.currentTarget; const note = String(new FormData(f).get("note") ?? ""); try { await adminService.addQuoteNote(open.id, note); f.reset(); setNotes(await adminService.quoteNotes(open.id)); } catch (x) { err(x); } }
  const Row = ({ k, v }: { k: string; v?: string | null }) => v ? <div><p className="text-xs font-bold uppercase text-muted-foreground">{k}</p><p className="text-sm">{v}</p></div> : null;
  if (open) return <div className="border border-border bg-card p-5 md:p-8">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><button onClick={() => setOpen(null)} className="text-sm font-bold text-primary">← Back to list</button><h2 className="mt-2 text-xl font-bold">{open.reference} · {open.full_name}</h2></div>
      <div className="flex gap-2"><select value={open.status} onChange={(e) => setStatus(open.id, e.target.value as QuoteStatus)} className="rounded border border-border bg-background p-2 text-sm">{statuses.map((x) => <option key={x} value={x}>{x.replaceAll("_", " ")}</option>)}</select><button onClick={() => del(open.id)} className="rounded border border-border p-2 text-destructive" aria-label="Delete"><Trash2 className="size-4" /></button></div></div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Row k="Service" v={open.service_type} /><Row k="Elevator type" v={open.elevator_type} /><Row k="Property" v={open.property_type} /><Row k="Floors / stops" v={open.floors_stops} /><Row k="Capacity" v={open.required_capacity} /><Row k="Existing elevator" v={open.existing_elevator} /><Row k="Location" v={open.project_location} /><Row k="Timeline" v={open.timeline} /><Row k="Company" v={open.company_name} /><Row k="Preferred contact" v={open.preferred_contact} /><Row k="Received" v={fmt(open.created_at)} />
      <div><p className="text-xs font-bold uppercase text-muted-foreground">Contact</p><a className="block text-sm text-primary" href={`tel:${open.phone}`}>{open.phone}</a>{open.whatsapp && <a className="block text-sm text-primary" target="_blank" rel="noreferrer" href={`https://wa.me/${open.whatsapp.replace(/\D/g, "")}`}>WhatsApp {open.whatsapp}</a>}<a className="block text-sm text-primary" href={`mailto:${open.email}`}>{open.email}</a></div></div>
    {open.requirements && <div className="mt-6"><p className="text-xs font-bold uppercase text-muted-foreground">Requirements</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{open.requirements}</p></div>}
    {files.length > 0 && <div className="mt-6"><p className="text-xs font-bold uppercase text-muted-foreground">Attachments</p>{files.map((f) => <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className="block text-sm text-primary">{f.name}</a>)}</div>}
    <div className="mt-8 border-t border-border pt-6"><h3 className="font-bold">Internal notes (never public)</h3><form onSubmit={addNote} className="mt-3 flex gap-2"><input name="note" required maxLength={1500} placeholder="Add a note…" className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm" /><button className="rounded bg-primary px-4 text-sm font-bold text-primary-foreground">Save</button></form>{notes.map((n) => <div key={n.id} className="mt-3 border-l-2 border-accent pl-3 text-sm"><p>{n.note}</p><p className="text-xs text-muted-foreground">{fmt(n.created_at)}</p></div>)}</div>
  </div>;
  return <div><div className="mb-6 flex flex-wrap justify-between gap-3"><input aria-label="Search quote requests" placeholder="Search reference, name or contact" value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-64 rounded-md border border-border bg-background px-3 py-2 text-sm" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm"><option value="all">All statuses</option>{statuses.map((x) => <option key={x} value={x}>{x.replaceAll("_", " ")}</option>)}</select></div>
    <div className="overflow-x-auto border border-border bg-card"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-secondary"><tr>{["Reference", "Name", "Contact", "Requirement", "Status", "Received"].map((x) => <th key={x} className="p-4">{x}</th>)}</tr></thead><tbody>{shown.map((r) => <tr key={r.id} className="cursor-pointer border-t border-border hover:bg-secondary/50" onClick={() => setOpen(r)}><td className="p-4 font-bold">{r.reference}</td><td className="p-4">{r.full_name}</td><td className="p-4">{r.phone}<br /><span className="text-muted-foreground">{r.email}</span></td><td className="p-4">{r.service_type}<br /><span className="text-muted-foreground">{r.project_location}</span></td><td className="p-4" onClick={(e) => e.stopPropagation()}><select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as QuoteStatus)} className="rounded border border-border bg-background p-2">{statuses.map((x) => <option key={x} value={x}>{x.replaceAll("_", " ")}</option>)}</select></td><td className="p-4 text-muted-foreground">{fmt(r.created_at)}</td></tr>)}</tbody></table>{!shown.length && <p className="p-8 text-muted-foreground">No quote requests in this view.</p>}</div></div>;
}

export function Messages() {
  const [rows, setRows] = useState<any[] | null>(null);
  useEffect(() => { adminService.messages().then(setRows).catch((e) => { err(e); setRows([]); }); }, []);
  async function status(id: string, s: string) { try { await adminService.setMessageStatus(id, s); setRows((v) => v!.map((x) => x.id === id ? { ...x, status: s } : x)); } catch (e) { err(e); } }
  async function del(id: string) { if (!confirm("Delete this message?")) return; try { await adminService.deleteMessage(id); setRows((v) => v!.filter((x) => x.id !== id)); } catch (e) { err(e); } }
  return <div className="space-y-3">{rows?.map((r) => <article key={r.id} className="border border-border bg-card p-5"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-bold">{r.subject}</h2><p className="mt-1 text-sm">{r.name}{r.phone && <> · <a className="text-primary" href={`tel:${r.phone}`}>{r.phone}</a></>}{r.email && <> · <a className="text-primary" href={`mailto:${r.email}`}>{r.email}</a></>}</p></div><time className="text-xs text-muted-foreground">{fmt(r.created_at)}</time></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{r.message}</p>
    <div className="mt-4 flex items-center gap-3"><select value={r.status} onChange={(e) => status(r.id, e.target.value)} className="rounded border border-border bg-background p-2 text-sm">{["new", "read", "replied", "closed"].map((x) => <option key={x}>{x}</option>)}</select><button onClick={() => del(r.id)} className="rounded border border-border p-2 text-destructive" aria-label="Delete"><Trash2 className="size-4" /></button></div></article>)}
    {rows && !rows.length && <p className="border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No contact messages yet.</p>}</div>;
}

export function PagesContent() {
  const [vals, setVals] = useState<Record<string, string> | null>(null); const [tab, setTab] = useState(fieldGroups[0]!.page); const [saving, setSaving] = useState(false);
  useEffect(() => { adminService.contentValues().then(setVals).catch((e) => { err(e); setVals({}); }); }, []);
  if (!vals) return <p className="text-muted-foreground">Loading…</p>;
  const group = fieldGroups.find((g) => g.page === tab)!;
  async function save() { setSaving(true); try { await adminService.saveContent(Object.fromEntries(group.fields.map((f) => [f.key, vals![f.key] ?? ""]))); toast.success("Saved. The website is updated."); } catch (e) { err(e); } finally { setSaving(false); } }
  return <div>
    <div className="mb-6 flex flex-wrap gap-2">{fieldGroups.map((g) => <button key={g.page} onClick={() => setTab(g.page)} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === g.page ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>{g.page}</button>)}</div>
    <div className="border border-border bg-card p-5 md:p-8"><p className="mb-6 text-sm text-muted-foreground">Edit the text and images of the {group.page.toLowerCase()}. Clear a text box and save to restore the original wording.</p>
      <div className="grid gap-5 sm:grid-cols-2">{group.fields.map((f) => {
        const def: FieldDef = { key: f.key, label: f.label, type: f.type };
        if (f.type === "image") return <div key={f.key} className="sm:col-span-2"><ImageField label={f.label} value={vals[f.key] ?? ""} onChange={(v) => setVals({ ...vals, [f.key]: v })} fallback="" /></div>;
        return <FieldInput key={f.key} f={def} value={vals[f.key] || f.def} onChange={(v) => setVals({ ...vals, [f.key]: v })} />;
      })}</div>
      <button disabled={saving} onClick={save} className="mt-8 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></div></div>;
}

export function Media() {
  const [files, setFiles] = useState<{ name: string; path: string; url: string }[] | null>(null); const ref = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false);
  const load = () => adminService.media().then(setFiles).catch((e) => { err(e); setFiles([]); });
  useEffect(() => { load(); }, []);
  async function up(list: FileList | null) { if (!list?.length) return; setBusy(true); try { for (const f of Array.from(list)) await adminService.upload(f); toast.success("Uploaded"); await load(); } catch (e) { err(e); } finally { setBusy(false); if (ref.current) ref.current.value = ""; } }
  async function del(p: string) { if (!confirm("Delete this image? Pages using it will show the default image.")) return; try { await adminService.deleteMedia(p); load(); } catch (e) { err(e); } }
  return <div><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Upload images, then copy the link to use anywhere. You can also pick images directly when editing content.</p><input ref={ref} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => up(e.target.files)} /><button disabled={busy} onClick={() => ref.current?.click()} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"><ImagePlus className="size-4" />{busy ? "Uploading…" : "Upload images"}</button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{files?.map((f) => <div key={f.path} className="border border-border bg-card"><div className="aspect-[4/3] bg-secondary"><img src={f.url} alt={f.name} loading="lazy" className="h-full w-full object-cover" /></div><div className="flex items-center justify-between gap-2 p-3"><p className="truncate text-xs">{f.name}</p><div className="flex gap-1"><button onClick={() => { navigator.clipboard.writeText(location.origin + f.url); toast.success("Link copied"); }} className="rounded p-1.5 hover:bg-secondary" aria-label="Copy link"><Copy className="size-4" /></button><button onClick={() => del(f.path)} className="rounded p-1.5 text-destructive hover:bg-secondary" aria-label="Delete"><Trash2 className="size-4" /></button></div></div></div>)}</div>
    {files && !files.length && <p className="border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No images uploaded yet.</p>}</div>;
}

const sf = (key: string, label: string, type: FieldDef["type"] = "text"): FieldDef => ({ key, label, type });
const settingFields: [string, FieldDef[]][] = [
  ["Company", [sf("company_name", "Company name"), sf("logo_url", "Logo", "image"), sf("favicon_url", "Favicon", "image")]],
  ["Contact details", [sf("phone", "Phone"), sf("whatsapp", "WhatsApp number (with country code)"), sf("email", "Email"), sf("address_line_1", "Address line 1"), sf("address_line_2", "Address line 2"), sf("city", "City"), sf("country", "Country"), sf("google_maps_url", "Google Maps link"), sf("business_hours", "Business hours", "textarea"), sf("emergency_support_text", "Emergency support text", "textarea")]],
  ["Social links", [sf("facebook_url", "Facebook"), sf("instagram_url", "Instagram"), sf("linkedin_url", "LinkedIn"), sf("youtube_url", "YouTube")]],
  ["Footer & SEO", [sf("footer_description", "Footer description", "textarea"), sf("copyright_text", "Copyright text"), sf("seo_title", "Default SEO title"), sf("seo_description", "Default SEO description", "textarea")]],
];
export function SiteSettings() {
  const [v, setV] = useState<Record<string, any> | null>(null); const [saving, setSaving] = useState(false);
  useEffect(() => { adminService.settings().then((d) => setV(d ?? {})).catch((e) => { err(e); setV({}); }); }, []);
  if (!v) return <p className="text-muted-foreground">Loading…</p>;
  async function save() { if (!v?.["id"]) return; setSaving(true); try { const { id, updated_at, ...rest } = v as Record<string, any>; for (const k of ["logo_url", "favicon_url"]) if (!rest[k]) rest[k] = null; await adminService.saveSettings(id as string, rest); toast.success("Settings saved. The website is updated."); } catch (e) { err(e); } finally { setSaving(false); } }
  return <div className="space-y-6">{settingFields.map(([title, fields]) => <section key={title} className="border border-border bg-card p-5 md:p-8"><h2 className="mb-5 text-lg font-bold">{title}</h2><div className="grid gap-5 sm:grid-cols-2">{fields.map((f) => <FieldInput key={f.key} f={f} value={v[f.key]} onChange={(x) => setV({ ...v, [f.key]: x })} />)}</div></section>)}
    <button disabled={saving} onClick={save} className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60">{saving ? "Saving…" : "Save settings"}</button></div>;
}
