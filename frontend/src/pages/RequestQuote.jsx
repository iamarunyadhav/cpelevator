import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileUp } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { quoteSchema, quoteService } from "@/services/publicService";
import { usePageMeta } from "@/hooks/usePageMeta";
const initial = {
  service_type: "",
  elevator_type: "",
  property_type: "",
  floors_stops: "",
  required_capacity: "",
  existing_elevator: "",
  project_location: "",
  timeline: "",
  requirements: "",
  full_name: "",
  company_name: "",
  phone: "",
  whatsapp: "",
  email: "",
  preferred_contact: "",
  consent: true,
};
export default function Quote() {
  usePageMeta(
    "Request an Elevator Quote | Compass Elevators Sri Lanka",
    "Tell Compass Elevators about your building, lift needs and preferred timeline.",
  );
  const [step, setStep] = useState(0),
    [values, setValues] = useState(initial),
    [file, setFile] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [ref, setRef] = useState("");
  function change(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }
  function next() {
    setError("");
    const required =
      step === 0
        ? ["service_type"]
        : step === 1
          ? ["elevator_type", "property_type", "existing_elevator"]
          : ["project_location", "timeline"];
    const missing = required.find((k) => !String(values[k]));
    if (missing) {
      setError("Please complete the required fields before continuing.");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  }
  async function submit(e) {
    e.preventDefault();
    const valid = quoteSchema.safeParse(values);
    if (!valid.success) {
      setError(valid.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const row = await quoteService.create({ data: valid.data });
      if (file) await quoteService.upload(row.id, file);
      setRef(row.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit your request.");
    } finally {
      setBusy(false);
    }
  }
  if (ref)
    return (
      <PublicLayout>
        <PageHero
          eyebrow="Quote request"
          title="Your request is on its way"
          description="We have recorded the project details you shared."
        />
        <section className="page-shell py-20">
          <div className="mx-auto max-w-xl border-t-4 border-success bg-card p-10 text-center shadow-xl">
            <CheckCircle2 className="mx-auto size-14 text-success" />
            <p className="mt-6 eyebrow">Request reference</p>
            <h2 className="mt-3 text-3xl font-bold">{ref}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Keep this reference for future communication. Our team will review the information and
              contact you using your preferred method.
            </p>
          </div>
        </section>
      </PublicLayout>
    );
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Project enquiry"
        title="Request a free quote"
        description="Share your requirement in four short steps so our team can respond with relevant guidance."
      />
      <section className="py-16">
        <div className="page-shell">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 grid grid-cols-4 gap-2" aria-label={`Step ${step + 1} of 4`}>
              {["Need", "Building", "Project", "Contact"].map((x, i) => (
                <div key={x}>
                  <div className={`h-1 ${i <= step ? "bg-accent" : "bg-border"}`} />
                  <p
                    className={`mt-2 text-xs font-bold ${i === step ? "text-primary" : "text-muted-foreground"}`}
                  >
                    0{i + 1} {x}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={submit} className="border border-border bg-card p-6 md:p-10">
              <Step step={step} values={values} change={change} file={file} setFile={setFile} />
              {error && (
                <p className="mt-5 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <div className="mt-8 flex justify-between border-t border-border pt-6">
                {step > 0 ? (
                  <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                    <ArrowLeft /> Back
                  </Button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <Button type="button" onClick={next}>
                    Continue <ArrowRight />
                  </Button>
                ) : (
                  <Button type="submit" disabled={busy}>
                    {busy ? "Submitting…" : "Submit Quote Request"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
function Step({ step, values, change, file, setFile }) {
  const select = (name, label, options) => (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        value={String(values[name])}
        onChange={(e) => change(name, e.target.value)}
        className="form-field w-full rounded-md border px-3 text-sm"
      >
        <option value="">Select an option</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
  const input = (name, label, type = "text") => (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <Input
        className="form-field"
        id={name}
        type={type}
        value={String(values[name])}
        onChange={(e) => change(name, e.target.value)}
        maxLength={255}
      />
    </div>
  );
  if (step === 0)
    return (
      <div>
        <p className="eyebrow">Step 1</p>
        <h2 className="mt-3 text-2xl font-bold">What do you need?</h2>
        <div className="mt-7">
          {select("service_type", "Service required *", [
            "New elevator installation",
            "Maintenance / repair",
            "Modernization",
            "Technical support",
            "Other",
          ])}
        </div>
      </div>
    );
  if (step === 1)
    return (
      <div>
        <p className="eyebrow">Step 2</p>
        <h2 className="mt-3 text-2xl font-bold">Elevator and building</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {select("elevator_type", "Elevator type *", [
            "Passenger Elevator",
            "Goods Elevator",
            "Hospital Elevator",
            "Home Elevator",
            "Escalator",
            "Not sure",
          ])}
          {select("property_type", "Property type *", [
            "Residential",
            "Commercial",
            "Hospital / healthcare",
            "Hotel",
            "Industrial",
            "Retail",
            "Other",
          ])}
          {input("floors_stops", "Number of floors / stops")}
          {input("required_capacity", "Required capacity")}
          {select("existing_elevator", "Existing elevator? *", ["Yes", "No", "Not sure"])}
        </div>
      </div>
    );
  if (step === 2)
    return (
      <div>
        <p className="eyebrow">Step 3</p>
        <h2 className="mt-3 text-2xl font-bold">Project details</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {input("project_location", "Project location *")}
          {select("timeline", "Preferred timeline *", [
            "As soon as possible",
            "Within 1–3 months",
            "Within 3–6 months",
            "More than 6 months",
            "Planning stage",
          ])}
          <div className="md:col-span-2">
            <label className="field-label" htmlFor="requirements">
              Additional requirements
            </label>
            <Textarea
              id="requirements"
              value={values.requirements}
              onChange={(e) => change("requirements", e.target.value)}
              maxLength={2000}
              className="min-h-32"
            />
          </div>
          <label className="md:col-span-2 flex cursor-pointer items-center gap-3 border border-dashed border-border p-5 text-sm">
            <FileUp className="size-5 text-accent" />
            <span>{file ? file.name : "Attach a JPG, PNG or PDF (optional, maximum 10 MB)"}</span>
            <input
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </div>
    );
  return (
    <div>
      <p className="eyebrow">Step 4</p>
      <h2 className="mt-3 text-2xl font-bold">How can we contact you?</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {input("full_name", "Full name *")}
        {input("company_name", "Company name")}
        {input("phone", "Phone number *", "tel")}
        {input("whatsapp", "WhatsApp number", "tel")}
        {input("email", "Email address *", "email")}
        {select("preferred_contact", "Preferred contact method *", ["Phone", "WhatsApp", "Email"])}
        <label className="md:col-span-2 flex gap-3 text-sm leading-6 text-muted-foreground">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => change("consent", e.target.checked)}
            className="mt-1 size-4 accent-primary"
          />
          <span>
            I agree that Compass Elevators may use these details to respond to this enquiry.
          </span>
        </label>
      </div>
    </div>
  );
}
