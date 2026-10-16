import { useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { FieldInput } from "./fields";
const t = (key, label, extra = {}) => ({ key, label, type: "text", ...extra });
const ta = (key, label, extra = {}) => ({ key, label, type: "textarea", ...extra });
const img = (key, label) => ({ key, label, type: "image" });
const num = (key, label, hint) =>
  hint ? { key, label, type: "number", hint } : { key, label, type: "number" };
const bool = (key, label) => ({ key, label, type: "bool" });
const slug = t("slug", "Page URL name (slug)", {
  hint: "Leave blank to create it from the title.",
});
export const entities = {
  Elevators: {
    table: "elevator_types",
    title: "Elevators",
    singular: "elevator",
    titleKey: "name",
    subKey: "short_description",
    flag: "active",
    imageKey: "featured_image_url",
    defaults: {
      name: "",
      slug: "",
      category: "",
      short_description: "",
      long_description: "",
      featured_image_url: "",
      applications: [],
      benefits: [],
      seo_title: "",
      seo_description: "",
      sort_order: 0,
      active: true,
      featured: false,
    },
    fields: [
      t("name", "Name", { required: true }),
      slug,
      t("category", "Category", { required: true }),
      num("sort_order", "Display order", "Smaller numbers show first."),
      ta("short_description", "Short description", { required: true }),
      ta("long_description", "Full description", { required: true }),
      img("featured_image_url", "Photo"),
      { key: "applications", label: "Applications", type: "list" },
      { key: "benefits", label: "Key benefits", type: "list" },
      t("seo_title", "SEO title"),
      t("seo_description", "SEO description"),
      bool("active", "Visible on website"),
      bool("featured", "Featured"),
    ],
  },
  Services: {
    table: "services",
    title: "Services",
    singular: "service",
    titleKey: "title",
    subKey: "short_description",
    flag: "active",
    imageKey: "featured_image_url",
    defaults: {
      title: "",
      slug: "",
      icon: "wrench",
      short_description: "",
      long_description: "",
      featured_image_url: "",
      seo_title: "",
      seo_description: "",
      sort_order: 0,
      active: true,
      featured: false,
    },
    fields: [
      t("title", "Title", { required: true }),
      slug,
      num("sort_order", "Display order", "Smaller numbers show first."),
      ta("short_description", "Short description", { required: true }),
      ta("long_description", "Full description", { required: true }),
      img("featured_image_url", "Photo"),
      t("seo_title", "SEO title"),
      t("seo_description", "SEO description"),
      bool("active", "Visible on website"),
      bool("featured", "Featured"),
    ],
  },
  Projects: {
    table: "projects",
    title: "Projects",
    singular: "project",
    titleKey: "title",
    subKey: "location",
    flag: "published",
    imageKey: "featured_image_url",
    defaults: {
      title: "",
      slug: "",
      category: "",
      client_name: "",
      location: "",
      elevator_type: "",
      service_performed: "",
      summary: "",
      description: "",
      project_date: "",
      featured_image_url: "",
      featured: false,
      published: true,
    },
    fields: [
      t("title", "Project title", { required: true }),
      slug,
      t("category", "Category (e.g. Residential)", { required: true }),
      t("location", "Location", { required: true }),
      t("elevator_type", "Elevator type", { required: true }),
      t("service_performed", "Service performed", { required: true }),
      t("client_name", "Client name (optional)"),
      { key: "project_date", label: "Project date", type: "date" },
      ta("summary", "Summary", { required: true }),
      ta("description", "Full description", { required: true }),
      img("featured_image_url", "Photo"),
      bool("published", "Visible on website"),
      bool("featured", "Featured"),
    ],
  },
  Testimonials: {
    table: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    titleKey: "customer_name",
    subKey: "quote",
    flag: "active",
    imageKey: "image_url",
    defaults: {
      customer_name: "",
      company: "",
      role_title: "",
      quote: "",
      rating: 5,
      image_url: "",
      active: false,
      featured: false,
      sort_order: 0,
    },
    fields: [
      t("customer_name", "Customer name", { required: true }),
      t("company", "Company"),
      t("role_title", "Role"),
      num("rating", "Rating (1-5)"),
      ta("quote", "Testimonial text", { required: true }),
      img("image_url", "Photo"),
      num("sort_order", "Display order"),
      bool("active", "Visible on website (only publish real testimonials)"),
      bool("featured", "Featured"),
    ],
  },
  FAQs: {
    table: "faqs",
    title: "FAQs",
    singular: "question",
    titleKey: "question",
    subKey: "answer",
    flag: "active",
    defaults: { question: "", answer: "", category: "general", active: true, sort_order: 0 },
    fields: [
      t("question", "Question", { required: true, wide: true }),
      ta("answer", "Answer", { required: true }),
      t("category", "Category"),
      num("sort_order", "Display order"),
      bool("active", "Visible on website"),
    ],
  },
  Blog: {
    table: "blog_posts",
    title: "Blog posts",
    singular: "post",
    titleKey: "title",
    subKey: "excerpt",
    flag: "published",
    imageKey: "cover_image_url",
    defaults: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      author: "",
      published: false,
      seo_title: "",
      seo_description: "",
    },
    fields: [
      t("title", "Post title", { required: true, wide: true }),
      slug,
      t("author", "Author"),
      ta("excerpt", "Short summary (shown in the blog list)", { required: true }),
      {
        key: "content",
        label: "Article text",
        type: "textarea",
        hint: "Separate paragraphs with a blank line. Start a line with ## for a heading.",
      },
      img("cover_image_url", "Cover image"),
      t("seo_title", "SEO title"),
      t("seo_description", "SEO description"),
      bool("published", "Published (visible on website)"),
    ],
  },
};
export function EntityManager({ cfg }) {
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const load = () =>
    adminService
      .list(cfg.table)
      .then(setRows)
      .catch((e) => {
        toast.error(e.message);
        setRows([]);
      });
  useEffect(() => {
    setRows(null);
    setEditing(null);
    load();
  }, [cfg.table]);
  async function save() {
    if (!editing) return;
    const missing = cfg.fields.find(
      (f) => f.required && !String(editing.values[f.key] ?? "").trim(),
    );
    if (missing) {
      toast.error(`Please fill in: ${missing.label}`);
      return;
    }
    setSaving(true);
    try {
      const v = { ...editing.values };
      for (const f of cfg.fields)
        if (f.type === "list") v[f.key] = (v[f.key] ?? []).map((x) => x.trim()).filter(Boolean);
      await adminService.save(cfg.table, editing.id, v);
      toast.success("Saved. The website is updated.");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }
  async function remove(r) {
    if (!confirm(`Delete "${r[cfg.titleKey]}"? This cannot be undone.`)) return;
    try {
      await adminService.remove(cfg.table, r.id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    }
  }
  async function toggle(r) {
    try {
      await adminService.setFlag(cfg.table, r.id, cfg.flag, !r[cfg.flag]);
      setRows((v) => v.map((x) => (x.id === r.id ? { ...x, [cfg.flag]: !r[cfg.flag] } : x)));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    }
  }
  if (editing)
    return (
      <div className="border border-border bg-card p-5 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editing.id ? `Edit ${cfg.singular}` : `New ${cfg.singular}`}
          </h2>
          <button
            onClick={() => setEditing(null)}
            aria-label="Close"
            className="rounded p-2 hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {cfg.fields.map((f) => (
            <FieldInput
              key={f.key}
              f={f}
              value={editing.values[f.key]}
              onChange={(val) =>
                setEditing((e) => e && { ...e, values: { ...e.values, [f.key]: val } })
              }
            />
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <button
            disabled={saving}
            onClick={save}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            onClick={() => setEditing(null)}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Add, edit, hide or delete {cfg.title.toLowerCase()}. Changes appear on the website
          immediately.
        </p>
        <button
          onClick={() => setEditing({ id: null, values: { ...cfg.defaults } })}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus className="size-4" />
          Add {cfg.singular}
        </button>
      </div>
      <div className="divide-y divide-border border border-border bg-card">
        {rows === null && <p className="p-8 text-muted-foreground">Loading…</p>}
        {rows?.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-4 p-4">
            {cfg.imageKey && (
              <div className="h-14 w-20 shrink-0 overflow-hidden bg-secondary">
                {r[cfg.imageKey] && (
                  <img src={r[cfg.imageKey]} alt="" className="h-full w-full object-cover" />
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold">{r[cfg.titleKey]}</h3>
              {cfg.subKey && (
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{r[cfg.subKey]}</p>
              )}
            </div>
            <button
              onClick={() => toggle(r)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${r[cfg.flag] ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"}`}
            >
              {r[cfg.flag] ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              {r[cfg.flag] ? (cfg.flag === "published" ? "Published" : "Visible") : "Hidden"}
            </button>
            <button
              onClick={() => setEditing({ id: r.id, values: { ...cfg.defaults, ...r } })}
              className="rounded-md border border-border p-2 hover:bg-secondary"
              aria-label="Edit"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={() => remove(r)}
              className="rounded-md border border-border p-2 text-destructive hover:bg-secondary"
              aria-label="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {rows?.length === 0 && (
          <p className="p-8 text-muted-foreground">
            Nothing here yet. Use “Add {cfg.singular}” to create the first one.
          </p>
        )}
      </div>
    </div>
  );
}
