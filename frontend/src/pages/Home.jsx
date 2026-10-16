import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Check,
  Headphones,
  HeartPulse,
  Home,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import hero from "@/assets/compass-hero.jpg";
import solutions from "@/assets/elevator-solutions.jpg";
import serviceImage from "@/assets/elevator-service.jpg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { QuoteCta } from "@/components/site/QuoteCta";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { contentService } from "@/services/contentService";
import { useSite } from "@/lib/site-context";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLoad } from "@/hooks/useLoad";
import { PageLoader } from "@/components/site/PageLoader";
const trust = [
  [ShieldCheck, "Safety-focused"],
  [Package, "Quality components"],
  [Headphones, "Professional support"],
  [Sparkles, "Responsive service"],
];
function HomePageView({ data }) {
  const { elevators, services, faqs } = data;
  const { company, c, img } = useSite();
  return (
    <PublicLayout>
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-primary text-primary-foreground">
        <img
          src={img("hero_image", hero)}
          alt="Modern elevator lobby overlooking Colombo"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/78 md:bg-gradient-to-r md:from-primary md:via-primary/86 md:to-primary/10" />
        <div className="elevator-lines" />
        <div className="page-shell relative flex min-h-[calc(100vh-5rem)] items-center py-20">
          <div className="max-w-3xl reveal">
            <p className="eyebrow text-accent-light">{c("hero_eyebrow")}</p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl">
              {c("hero_title_1")}
              <br />
              <span className="text-accent-light">{c("hero_title_2")}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-primary-foreground/78 md:text-lg">
              {c("hero_text")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/request-quote">
                  Request a Free Quote <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="lg">
                <Link to="/services">Explore Our Services</Link>
              </Button>
            </div>
            <a
              href={company.phoneHref}
              className="mt-6 inline-block text-sm font-semibold text-primary-foreground/75"
            >
              Call {company.phone}
            </a>
          </div>
        </div>
      </section>
      <section className="border-b border-border bg-card">
        <div className="page-shell grid grid-cols-2 lg:grid-cols-4">
          {trust.map(([Icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-3 border-border px-3 py-6 first:pl-0 even:border-l lg:border-l"
            >
              <Icon className="size-5 text-accent" />
              <span className="text-xs font-bold uppercase text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 md:py-28">
        <div className="page-shell grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative">
            <img
              loading="lazy"
              src={img("intro_image", solutions)}
              alt="Passenger, goods and home elevator solutions"
              width={1920}
              height={1024}
              className="aspect-[5/4] w-full object-cover shadow-2xl"
            />
            <div className="absolute bottom-0 right-0 border-l-4 border-accent bg-primary p-5 text-primary-foreground">
              <p className="text-3xl font-bold">↑</p>
              <p className="mt-1 text-xs font-bold uppercase">
                Built around
                <br />
                your building
              </p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow={c("intro_eyebrow")} title={c("intro_title")} />
            <p className="mt-6 leading-8 text-muted-foreground">{c("intro_p1")}</p>
            <p className="mt-4 leading-8 text-muted-foreground">{c("intro_p2")}</p>
            <Button asChild variant="link" className="mt-5 px-0">
              <Link to="/about">
                About Compass Elevators <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-secondary py-20 md:py-28">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Elevator range"
            title="Solutions for different environments"
            description="Choose a solution based on how your building operates, who uses it and what needs to be moved."
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {elevators.map((item, i) => {
              const icons = { 0: Building2, 1: Package, 2: HeartPulse, 3: Home, 4: Sparkles };
              const Icon = icons[i] ?? Building2;
              return (
                <Link
                  to={`/elevators/${item.slug}`}
                  key={item.slug}
                  className="group bg-card p-7 transition-colors hover:bg-background"
                >
                  <Icon className="size-7 text-accent" />
                  <p className="mt-8 text-xs font-bold uppercase text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                  <span className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
                    Learn more{" "}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20 md:py-28">
        <div className="page-shell grid gap-12 lg:grid-cols-[1fr_.9fr]">
          <div>
            <SectionHeading eyebrow={c("services_eyebrow")} title={c("services_title")} />
            <div className="mt-10 divide-y divide-border border-y border-border">
              {services.map((s, i) => (
                <Link
                  to={`/services/${s.slug}`}
                  key={s.slug}
                  className="group grid grid-cols-[3rem_1fr_auto] items-start gap-4 py-6"
                >
                  <span className="font-display text-sm font-bold text-accent">0{i + 1}</span>
                  <span>
                    <strong className="block font-display text-lg">{s.title}</strong>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {s.summary}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          <img
            loading="lazy"
            src={img("services_image", serviceImage)}
            alt="Elevator technician carrying out maintenance"
            width={1600}
            height={1072}
            className="h-full min-h-96 w-full object-cover"
          />
        </div>
      </section>
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Why Compass"
            title="A service mindset built around safe, dependable movement"
            light
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Safety-led approach",
              "Quality-focused solutions",
              "Experienced technical support",
              "Responsive communication",
              "Solutions for different buildings",
              "Long-term service mindset",
            ].map((x) => (
              <div className="border-l border-primary-foreground/20 pl-5" key={x}>
                <Check className="size-5 text-accent-light" />
                <h3 className="mt-5 text-lg font-bold">{x}</h3>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/65">
                  Thoughtful planning and practical support shaped around your building’s real
                  operating needs.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 md:py-28">
        <div className="page-shell">
          <SectionHeading eyebrow="Simple process" title="From enquiry to elevator solution" />
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              "Tell us about your requirement",
              "Site review & consultation",
              "Solution & quotation",
              "Installation / service delivery",
            ].map((x, i) => (
              <div key={x} className="border-t-2 border-accent pt-5">
                <span className="font-display text-3xl font-bold text-border">0{i + 1}</span>
                <h3 className="mt-5 font-bold">{x}</h3>
              </div>
            ))}
          </div>
          <Button asChild className="mt-10" size="lg">
            <Link to="/request-quote">
              Start Your Enquiry <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
      {faqs.length > 0 && (
        <section className="bg-secondary py-20">
          <div className="page-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <SectionHeading eyebrow="Common questions" title="Clear answers before you begin" />
            <Accordion type="single" collapsible>
              {faqs.map(({ q, a }, i) => (
                <AccordionItem key={q + i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-base">{q}</AccordionTrigger>
                  <AccordionContent className="leading-7 text-muted-foreground">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
      <QuoteCta />
    </PublicLayout>
  );
}

export default function HomePage() {
  usePageMeta(
    "Compass Elevators | Elevator Installation & Maintenance Sri Lanka",
    "Compass Elevators provides elevator installation, maintenance, repair and modernization solutions for residential and commercial properties in Sri Lanka.",
  );
  const { data } = useLoad(() =>
    Promise.all([
      contentService.elevators(),
      contentService.services(),
      contentService.faqs(),
    ]).then(([elevators, services, faqs]) => ({ elevators, services, faqs })),
  );
  if (!data) return <PageLoader />;
  return <HomePageView data={data} />;
}
