import { z } from "zod";
import { api } from "@/lib/api";
export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(100),
    phone: z.string().trim().max(30).optional(),
    email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
    subject: z.string().trim().min(3, "Please add a subject").max(160),
    message: z.string().trim().min(10, "Please add a little more detail").max(1500),
  })
  .refine((value) => Boolean(value.phone || value.email), {
    message: "Enter a phone number or email",
    path: ["phone"],
  });
export const quoteSchema = z.object({
  service_type: z.string().min(1),
  elevator_type: z.string().min(1),
  property_type: z.string().min(1),
  floors_stops: z.string().max(30).optional(),
  required_capacity: z.string().max(60).optional(),
  existing_elevator: z.string().min(1),
  project_location: z.string().trim().min(2).max(160),
  timeline: z.string().min(1),
  requirements: z.string().max(2000).optional(),
  full_name: z.string().trim().min(2).max(100),
  company_name: z.string().max(120).optional(),
  phone: z.string().trim().min(7).max(30),
  whatsapp: z.string().max(30).optional(),
  email: z.string().email().max(255),
  preferred_contact: z.string().min(1),
  consent: z.literal(true),
});
// Keep the `{ data }` call shape the pages already use.
const createContact = async ({ data }) => {
  try {
    await api("/public/contact", {
      method: "POST",
      body: { ...data, phone: data.phone || null, email: data.email || null },
    });
  } catch {
    throw new Error("We could not send your message. Please call or WhatsApp us instead.");
  }
  return { ok: true };
};
const createQuote = async ({ data }) => {
  try {
    return await api("/public/quotes", { method: "POST", body: data });
  } catch {
    throw new Error("We could not record your request. Please call or WhatsApp us instead.");
  }
};
async function uploadAttachment(quoteId, file) {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024)
    throw new Error("Attach a JPG, PNG or PDF under 10 MB.");
  const form = new FormData();
  form.append("file", file);
  try {
    await api(`/public/quotes/${quoteId}/attachments`, { method: "POST", body: form });
  } catch {
    throw new Error("Your request was saved, but the attachment did not upload.");
  }
}
export const contactService = { create: createContact };
export const quoteService = { create: createQuote, upload: uploadAttachment };
