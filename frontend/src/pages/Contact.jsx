import { usePageMeta } from "@/hooks/usePageMeta";
import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSite } from "@/lib/site-context";
import { contactSchema, contactService } from "@/services/publicService";
const fields = ["name", "phone", "email", "subject", "message"];
export default function Contact() {
  usePageMeta(
    "Contact Compass Elevators | Colombo, Sri Lanka",
    "Contact Compass Elevators by phone, WhatsApp, email or the website enquiry form.",
  );
  const { company, c } = useSite();
  const details = [
    { Icon: Phone, label: "Phone", text: company.phone, href: company.phoneHref },
    { Icon: MessageCircle, label: "WhatsApp", text: company.whatsapp, href: company.whatsappHref },
    { Icon: Mail, label: "Email", text: company.email, href: company.emailHref },
    { Icon: MapPin, label: "Office", text: company.address.join(", "), href: company.mapsUrl },
    ...(company.hours
      ? [{ Icon: Clock, label: "Business hours", text: company.hours, href: "" }]
      : []),
  ];
  const [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const input = Object.fromEntries(fields.map((k) => [k, String(fd.get(k) ?? "")]));
    const valid = contactSchema.safeParse(input);
    if (!valid.success) {
      setError(valid.error.issues[0]?.message ?? "Check your details.");
      return;
    }
    setBusy(true);
    try {
      await contactService.create({ data: valid.data });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <PublicLayout>
      <PageHero eyebrow="Contact" title={c("contact_title")} description={c("contact_desc")} />
      <section className="py-20">
        <div className="page-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <h2 className="text-2xl font-bold">Contact details</h2>
            <div className="mt-8 space-y-6">
              {details.map(({ Icon, label, text, href }) => (
                <div className="flex gap-4" key={label}>
                  <Icon className="mt-1 size-5 text-accent" />
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
                    {href ? (
                      <a className="mt-1 block font-semibold hover:text-accent" href={href}>
                        {text}
                      </a>
                    ) : (
                      <p className="mt-1 font-semibold">{text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border bg-card p-6 md:p-10">
            {sent ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="mx-auto size-12 text-success" />
                <h2 className="mt-5 text-2xl font-bold">Message received</h2>
                <p className="mt-3 text-muted-foreground">
                  Thank you. Our team can now review your enquiry and contact you using the details
                  provided.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 className="text-2xl font-bold">Send an enquiry</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please provide a phone number or email so we can reply.
                </p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field name="name" label="Full name *" />
                  <Field name="phone" label="Phone number" />
                  <Field name="email" label="Email address" type="email" />
                  <Field name="subject" label="Subject *" />
                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="message">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      maxLength={1500}
                      required
                      className="min-h-36"
                    />
                  </div>
                </div>
                {error && (
                  <p role="alert" className="mt-4 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button className="mt-6" size="lg" disabled={busy}>
                  {busy ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
function Field({ name, label, type = "text" }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <Input className="form-field" id={name} name={name} type={type} maxLength={255} />
    </div>
  );
}
