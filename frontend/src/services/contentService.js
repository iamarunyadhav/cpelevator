import { api } from "@/lib/api";
import {
  company as staticCompany,
  elevators as sEl,
  services as sSv,
  projects as sPr,
  faqs as sFq,
} from "@/content/site";
import { fieldDefaults } from "@/content/fields";
const digits = (s) => s.replace(/[^\d]/g, "");
const defaultCompany = {
  ...staticCompany,
  hours: "",
  emergency: "",
  footer:
    "Compass Elevators provides elevator installation, maintenance, repair and modernization solutions for residential, commercial and specialist applications.",
  copyright: "© Compass Elevators. All Rights Reserved.",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  mapsUrl: "",
  logo: "",
  seoTitle: "",
  seoDescription: "",
};
export const contentService = {
  async site() {
    try {
      const { settings: d, content: saved } = await api("/public/site");
      const content = { ...fieldDefaults };
      Object.entries(saved ?? {}).forEach(([key, value]) => {
        if (value?.trim()) content[key] = value;
      });
      if (!d) return { company: defaultCompany, content };
      const wa = digits(d.whatsapp);
      return {
        content,
        company: {
          ...defaultCompany,
          name: d.company_name,
          phone: d.phone,
          phoneHref: `tel:+${digits(d.phone)}`,
          whatsapp: d.whatsapp,
          whatsappHref: `https://wa.me/${wa}?text=${encodeURIComponent("Hello Compass Elevators, I would like to know more about your elevator services.")}`,
          email: d.email,
          emailHref: `mailto:${d.email}`,
          address: [d.address_line_1, d.address_line_2, d.city, d.country].filter(Boolean),
          hours: d.business_hours ?? "",
          emergency: d.emergency_support_text ?? "",
          footer: d.footer_description,
          copyright: d.copyright_text,
          facebook: d.facebook_url ?? "",
          instagram: d.instagram_url ?? "",
          linkedin: d.linkedin_url ?? "",
          youtube: d.youtube_url ?? "",
          mapsUrl: d.google_maps_url ?? "",
          logo: d.logo_url ?? "",
          seoTitle: d.seo_title,
          seoDescription: d.seo_description,
        },
      };
    } catch {
      return { company: defaultCompany, content: { ...fieldDefaults } };
    }
  },
  async services() {
    try {
      const data = await api("/public/services");
      return data.map((r) => ({
        title: r.title,
        slug: r.slug,
        summary: r.short_description,
        long: r.long_description,
        image: r.featured_image_url ?? "",
      }));
    } catch {
      return sSv.map((s) => ({ ...s, long: "", image: "" }));
    }
  },
  async elevators() {
    try {
      const data = await api("/public/elevators");
      return data.map((r) => ({
        name: r.name,
        slug: r.slug,
        category: r.category,
        summary: r.short_description,
        long: r.long_description,
        applications: r.applications,
        benefits: r.benefits,
        image: r.featured_image_url ?? "",
      }));
    } catch {
      return sEl.map((e) => ({ ...e, long: "", image: "" }));
    }
  },
  async projects() {
    try {
      const data = await api("/public/projects");
      return data.map((r) => ({
        title: r.title,
        slug: r.slug,
        category: r.category,
        location: r.location,
        service: r.service_performed,
        summary: r.summary,
        description: r.description,
        image: r.featured_image_url ?? "",
      }));
    } catch {
      return sPr.map((p) => ({ ...p, slug: "", summary: "", description: "", image: "" }));
    }
  },
  async faqs() {
    try {
      const data = await api("/public/faqs");
      return data.map((r) => ({ q: r.question, a: r.answer }));
    } catch {
      return sFq.map((f) => ({ q: f[0] ?? "", a: f[1] ?? "" }));
    }
  },
  async testimonials() {
    try {
      return await api("/public/testimonials");
    } catch {
      return [];
    }
  },
  async posts(limit) {
    try {
      return (await api(`/public/posts${limit ? `?limit=${limit}` : ""}`)).map(toPost);
    } catch {
      return [];
    }
  },
  async post(slug) {
    try {
      return toPost(await api(`/public/posts/${encodeURIComponent(slug)}`));
    } catch {
      return null;
    }
  },
};
function toPost(r) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    cover: r.cover_image_url ?? "",
    author: r.author ?? "",
    date: r.published_at ?? r.created_at,
    seoTitle: r.seo_title ?? "",
    seoDescription: r.seo_description ?? "",
  };
}
