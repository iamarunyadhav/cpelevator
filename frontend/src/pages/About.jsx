import { Link } from "react-router-dom";
import { ArrowRight, Building2, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import serviceImage from "@/assets/elevator-service.jpg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { QuoteCta } from "@/components/site/QuoteCta";
import { Button } from "@/components/ui/button";
import { useSite } from "@/lib/site-context";
import { usePageMeta } from "@/hooks/usePageMeta";
export default function About() {
  usePageMeta(
    "About Compass Elevators | Elevator Specialists Sri Lanka",
    "Learn about Compass Elevators’ practical approach to safe installations, maintenance and modernization.",
  );
  const { c, img } = useSite();
  const items = [
    { Icon: ShieldCheck, title: c("about_b1_title"), text: c("about_b1_text") },
    { Icon: Building2, title: c("about_b2_title"), text: c("about_b2_text") },
    { Icon: HeartHandshake, title: c("about_b3_title"), text: c("about_b3_text") },
    { Icon: Users, title: c("about_b4_title"), text: c("about_b4_text") },
  ];
  return (
    <PublicLayout>
      <PageHero eyebrow="Our company" title={c("about_title")} description={c("about_desc")} />
      <section className="py-20 md:py-28">
        <div className="page-shell grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold md:text-5xl">{c("about_heading")}</h2>
            <p className="mt-6 leading-8 text-muted-foreground">{c("about_p1")}</p>
            <p className="mt-4 leading-8 text-muted-foreground">{c("about_p2")}</p>
            <Button asChild className="mt-8">
              <Link to="/request-quote">
                Discuss your requirement <ArrowRight />
              </Link>
            </Button>
          </div>
          <img
            src={img("about_image", serviceImage)}
            loading="lazy"
            width={1600}
            height={1072}
            alt="Technical elevator service and maintenance"
            className="h-full min-h-96 w-full object-cover"
          />
        </div>
      </section>
      <section className="bg-secondary py-20">
        <div className="page-shell grid gap-px border border-border bg-border md:grid-cols-2">
          {items.map(({ Icon, title, text }) => (
            <div className="bg-card p-8" key={title}>
              <Icon className="size-7 text-accent" />
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <QuoteCta />
    </PublicLayout>
  );
}
