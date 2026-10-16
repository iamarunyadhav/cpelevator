import { api, tokenStore } from "@/lib/api";
export const authService = {
  async signIn(email, password) {
    try {
      const { token } = await api("/auth/login", { method: "POST", body: { email, password } });
      tokenStore.set(token);
      return { error: null };
    } catch (error) {
      return { error: error };
    }
  },
  async signOut() {
    try {
      await api("/auth/logout", { method: "POST", auth: true });
    } catch {
      /* token already invalid */
    }
    tokenStore.clear();
  },
  async currentUser() {
    if (!tokenStore.get()) return null;
    try {
      return (await api("/auth/me", { auth: true })).user;
    } catch {
      return null;
    }
  },
};
const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
export { slugify };
const admin = (path, options = {}) => api(`/admin${path}`, { ...options, auth: true });
export const adminService = {
  async isAdmin() {
    return Boolean((await authService.currentUser())?.is_admin);
  },
  dashboard: () => admin("/dashboard"),
  quotes: () => admin("/quotes"),
  async quoteAttachments(quoteId) {
    return (await admin(`/quotes/${quoteId}`)).attachments;
  },
  async quoteNotes(quoteId) {
    return (await admin(`/quotes/${quoteId}`)).notes;
  },
  async updateQuote(id, status) {
    await admin(`/quotes/${id}`, { method: "PATCH", body: { status } });
  },
  async deleteQuote(id) {
    await admin(`/quotes/${id}`, { method: "DELETE" });
  },
  async addQuoteNote(quoteId, note) {
    const clean = note.trim();
    if (!clean || clean.length > 1500) throw new Error("Enter a note under 1,500 characters.");
    await admin(`/quotes/${quoteId}/notes`, { method: "POST", body: { note: clean } });
  },
  messages: () => admin("/messages"),
  async setMessageStatus(id, status) {
    await admin(`/messages/${id}`, { method: "PATCH", body: { status } });
  },
  async deleteMessage(id) {
    await admin(`/messages/${id}`, { method: "DELETE" });
  },
  // Generic content CRUD
  list: (table) => admin(`/entities/${table}`),
  async save(table, id, values) {
    await admin(`/entities/${table}${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      body: values,
    });
  },
  async remove(table, id) {
    await admin(`/entities/${table}/${id}`, { method: "DELETE" });
  },
  async setFlag(table, id, key, value) {
    await admin(`/entities/${table}/${id}/flag`, { method: "PATCH", body: { key, value } });
  },
  // Page content
  contentValues: () => admin("/content"),
  async saveContent(values) {
    await admin("/content", { method: "PUT", body: { values } });
  },
  // Settings
  settings: () => admin("/settings"),
  async saveSettings(_id, values) {
    await admin("/settings", { method: "PUT", body: values });
  },
  // Media
  async upload(file) {
    if (!/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.type))
      throw new Error("Please choose a JPG, PNG, WEBP, GIF or SVG image.");
    if (file.size > 10 * 1024 * 1024) throw new Error("Image must be 10 MB or smaller.");
    const form = new FormData();
    form.append("file", file);
    return (await admin("/media", { method: "POST", body: form })).url;
  },
  media: () => admin("/media"),
  async deleteMedia(path) {
    await admin("/media", { method: "DELETE", body: { path } });
  },
};
