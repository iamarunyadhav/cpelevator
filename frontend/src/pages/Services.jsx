import { Link } from "react-router-dom";
import { ArrowRight, Headphones, RefreshCw, Settings, Wrench } from "lucide-react";
import serviceImage from "@/assets/elevator-service.jpg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { QuoteCta } from "@/components/site/QuoteCta";
import { contentService } from "@/services/contentService";
import { useSite } from "@/lib/site-context";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLoad } from "@/hooks/useLoad";
import { PageLoader } from "@/components/site/PageLoader";
function ServicesView({ data }) {
  const services = data;
  const { c, img } = useSite();
  const icons = { 0: Settings, 1: Wrench, 2: RefreshCw, 3: Headphones };
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Service & support"
        title={c("services_page_title")}
        description={c("services_page_desc")}
      />
      <section className="py-20">
        <div className="page-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <img
            src={img("services_page_image", serviceImage)}
            width={1600}
            height={1072}
            alt="Elevator maintenance technician"
            className="h-full min-h-96 w-full object-cover"
          />
          <div className="divide-y divide-border border-y border-border">
            {services.map((s, i) => {
              const Icon = icons[i] ?? Settings;
              return (
                <Link
                  to={`/services/${s.slug}`}
                  key={s.slug}
                  className="group grid grid-cols-[2.5rem_1fr_auto] gap-4 py-7"
                >
                  <Icon className="size-6 text-accent" />
                  <span>
                    <strong className="block font-display text-xl">{s.title}</strong>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {s.summary}
                    </span>
                  </span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <QuoteCta />
    </PublicLayout>
  );
}

export default function Services() {
  usePageMeta(
    "Elevator Services Sri Lanka | Compass Elevators",
    "Elevator installation, preventive maintenance, repairs, modernization and technical support.",
  );
  const { data } = useLoad(() => contentService.services());
  if (!data) return <PageLoader />;
  return <ServicesView data={data} />;
}
