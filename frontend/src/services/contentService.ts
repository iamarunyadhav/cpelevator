import { api } from "@/lib/api";
import { company as staticCompany, elevators as sEl, services as sSv, projects as sPr, faqs as sFq } from "@/content/site";
import { fieldDefaults } from "@/content/fields";

export type Company = typeof staticCompany & { hours: string; emergency: string; footer: string; copyright: string; facebook: string; instagram: string; linkedin: string; youtube: string; mapsUrl: string; logo: string; seoTitle: string; seoDescription: string };
export type SiteBundle = { company: Company; content: Record<string, string> };
export type ServiceItem = { title: string; slug: string; summary: string; long: string; image: string };
export type ElevatorItem = { name: string; slug: string; category: string; summary: string; long: string; applications: string[]; benefits: string[]; image: string };
export type ProjectItem = { title: string; slug: string; category: string; location: string; service: string; summary: string; description: string; image: string };
export type FaqItem = { q: string; a: string };
export type Post = { id: string; title: string; slug: string; excerpt: string; content: string; cover: string; author: string; date: string | null; seoTitle: string; seoDescription: string };

const digits = (s: string) => s.replace(/[^\d]/g, "");
const defaultCompany: Company = { ...staticCompany, hours: "", emergency: "", footer: "Compass Elevators provides elevator installation, maintenance, repair and modernization solutions for residential, commercial and specialist applications.", copyright: "© Compass Elevators. All Rights Reserved.", facebook: "", instagram: "", linkedin: "", youtube: "", mapsUrl: "", logo: "", seoTitle: "", seoDescription: "" };

export const contentService = {
  async site(): Promise<SiteBundle> {
    try {
      const { settings: d, content: saved } = await api<{ settings: any | null; content: Record<string, string> }>("/public/site");
      const content: Record<string, string> = { ...fieldDefaults };
      Object.entries(saved ?? {}).forEach(([key, value]) => { if (value?.trim()) content[key] = value; });
      if (!d) return { company: defaultCompany, content };
      const wa = digits(d.whatsapp);
      return { content, company: { ...defaultCompany, name: d.company_name, phone: d.phone, phoneHref: `tel:+${digits(d.phone)}`, whatsapp: d.whatsapp, whatsappHref: `https://wa.me/${wa}?text=${encodeURIComponent("Hello Compass Elevators, I would like to know more about your elevator services.")}`, email: d.email, emailHref: `mailto:${d.email}`, address: [d.address_line_1, d.address_line_2, d.city, d.country].filter(Boolean) as string[], hours: d.business_hours ?? "", emergency: d.emergency_support_text ?? "", footer: d.footer_description, copyright: d.copyright_text, facebook: d.facebook_url ?? "", instagram: d.instagram_url ?? "", linkedin: d.linkedin_url ?? "", youtube: d.youtube_url ?? "", mapsUrl: d.google_maps_url ?? "", logo: d.logo_url ?? "", seoTitle: d.seo_title, seoDescription: d.seo_description } };
    } catch { return { company: defaultCompany, content: { ...fieldDefaults } }; }
  },
  async services(): Promise<ServiceItem[]> {
    try {
      const data = await api<any[]>("/public/services");
      return data.map((r) => ({ title: r.title, slug: r.slug, summary: r.short_description, long: r.long_description, image: r.featured_image_url ?? "" }));
    } catch { return sSv.map((s) => ({ ...s, long: "", image: "" })); }
  },
  async elevators(): Promise<ElevatorItem[]> {
    try {
      const data = await api<any[]>("/public/elevators");
      return data.map((r) => ({ name: r.name, slug: r.slug, category: r.category, summary: r.short_description, long: r.long_description, applications: r.applications, benefits: r.benefits, image: r.featured_image_url ?? "" }));
    } catch { return sEl.map((e) => ({ ...e, long: "", image: "" })); }
  },
  async projects(): Promise<ProjectItem[]> {
    try {
      const data = await api<any[]>("/public/projects");
      return data.map((r) => ({ title: r.title, slug: r.slug, category: r.category, location: r.location, service: r.service_performed, summary: r.summary, description: r.description, image: r.featured_image_url ?? "" }));
    } catch { return sPr.map((p) => ({ ...p, slug: "", summary: "", description: "", image: "" })); }
  },
  async faqs(): Promise<FaqItem[]> {
    try {
      const data = await api<any[]>("/public/faqs");
      return data.map((r) => ({ q: r.question, a: r.answer }));
    } catch { return sFq.map((f) => ({ q: f[0] ?? "", a: f[1] ?? "" })); }
  },
  async testimonials() {
    try { return await api<any[]>("/public/testimonials"); } catch { return []; }
  },
  async posts(limit?: number): Promise<Post[]> {
    try { return (await api<any[]>(`/public/posts${limit ? `?limit=${limit}` : ""}`)).map(toPost); } catch { return []; }
  },
  async post(slug: string): Promise<Post | null> {
    try { return toPost(await api<any>(`/public/posts/${encodeURIComponent(slug)}`)); } catch { return null; }
  },
};

function toPost(r: any): Post {
  return { id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt, content: r.content, cover: r.cover_image_url ?? "", author: r.author ?? "", date: r.published_at ?? r.created_at, seoTitle: r.seo_title ?? "", seoDescription: r.seo_description ?? "" };
}
