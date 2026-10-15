import { api, tokenStore } from "@/lib/api";

export type EntityTable = "services" | "elevator_types" | "projects" | "testimonials" | "faqs" | "blog_posts";
export type QuoteStatus = "new" | "contacted" | "site_visit_planned" | "quoted" | "won" | "closed" | "cancelled";

export const authService = {
  async signIn(email: string, password: string): Promise<{ error: Error | null }> {
    try {
      const { token } = await api<{ token: string }>("/auth/login", { method: "POST", body: { email, password } });
      tokenStore.set(token);
      return { error: null };
    } catch (error) { return { error: error as Error }; }
  },
  async signOut() {
    try { await api("/auth/logout", { method: "POST", auth: true }); } catch { /* token already invalid */ }
    tokenStore.clear();
  },
  async currentUser() {
    if (!tokenStore.get()) return null;
    try { return (await api<{ user: { id: number; name: string; email: string; is_admin: boolean } }>("/auth/me", { auth: true })).user; } catch { return null; }
  },
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export { slugify };

const admin = <T = any>(path: string, options: Parameters<typeof api>[1] = {}) => api<T>(`/admin${path}`, { ...options, auth: true });

export const adminService = {
  async isAdmin() {
    return Boolean((await authService.currentUser())?.is_admin);
  },
  dashboard: () => admin<{ quotes: number; messages: number; projects: number; services: number; posts: number; latestQuotes: any[]; latestMessages: any[] }>("/dashboard"),
  quotes: () => admin<any[]>("/quotes"),
  async quoteAttachments(quoteId: string): Promise<{ name: string; url: string }[]> {
    return (await admin(`/quotes/${quoteId}`)).attachments;
  },
  async quoteNotes(quoteId: string): Promise<any[]> {
    return (await admin(`/quotes/${quoteId}`)).notes;
  },
  async updateQuote(id: string, status: QuoteStatus) {
    await admin(`/quotes/${id}`, { method: "PATCH", body: { status } });
  },
  async deleteQuote(id: string) {
    await admin(`/quotes/${id}`, { method: "DELETE" });
  },
  async addQuoteNote(quoteId: string, note: string) {
    const clean = note.trim();
    if (!clean || clean.length > 1500) throw new Error("Enter a note under 1,500 characters.");
    await admin(`/quotes/${quoteId}/notes`, { method: "POST", body: { note: clean } });
  },
  messages: () => admin<any[]>("/messages"),
  async setMessageStatus(id: string, status: string) {
    await admin(`/messages/${id}`, { method: "PATCH", body: { status } });
  },
  async deleteMessage(id: string) {
    await admin(`/messages/${id}`, { method: "DELETE" });
  },
  // Generic content CRUD
  list: (table: EntityTable) => admin<any[]>(`/entities/${table}`),
  async save(table: EntityTable, id: string | null, values: Record<string, any>) {
    await admin(`/entities/${table}${id ? `/${id}` : ""}`, { method: id ? "PUT" : "POST", body: values });
  },
  async remove(table: EntityTable, id: string) {
    await admin(`/entities/${table}/${id}`, { method: "DELETE" });
  },
  async setFlag(table: EntityTable, id: string, key: string, value: boolean) {
    await admin(`/entities/${table}/${id}/flag`, { method: "PATCH", body: { key, value } });
  },
  // Page content
  contentValues: () => admin<Record<string, string>>("/content"),
  async saveContent(values: Record<string, string>) {
    await admin("/content", { method: "PUT", body: { values } });
  },
  // Settings
  settings: () => admin<any>("/settings"),
  async saveSettings(_id: string, values: any) {
    await admin("/settings", { method: "PUT", body: values });
  },
  // Media
  async upload(file: File): Promise<string> {
    if (!/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.type)) throw new Error("Please choose a JPG, PNG, WEBP, GIF or SVG image.");
    if (file.size > 10 * 1024 * 1024) throw new Error("Image must be 10 MB or smaller.");
    const form = new FormData();
    form.append("file", file);
    return (await admin<{ url: string }>("/media", { method: "POST", body: form })).url;
  },
  media: () => admin<{ name: string; path: string; url: string }[]>("/media"),
  async deleteMedia(path: string) {
    await admin("/media", { method: "DELETE", body: { path } });
  },
};
