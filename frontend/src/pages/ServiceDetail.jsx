import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import serviceImage from "@/assets/elevator-service.jpg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { contentService } from "@/services/contentService";
import { useSite } from "@/lib/site-context";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLoad } from "@/hooks/useLoad";
import { PageLoader } from "@/components/site/PageLoader";
import NotFound from "@/pages/NotFound";
function DetailView({ s }) {
  const { img } = useSite();
  return (
    <PublicLayout>
      <PageHero eyebrow="Elevator service" title={s.title} description={s.summary} />
      <section className="py-20">
        <div className="page-shell grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">How we help</p>
            <h2 className="mt-4 text-3xl font-bold">Practical support, clearly coordinated</h2>
            {(s.long
              ? s.long.split(/\n+/)
              : [
                  "Each building and elevator system requires a considered approach. We review the requirement, explain appropriate options and coordinate the agreed work with safety and reliable operation in mind.",
                ]
            ).map((t, i) => (
              <p key={i} className="mt-6 leading-8 text-muted-foreground">
                {t}
              </p>
            ))}
            <div className="mt-8 space-y-4">
              {[
                "Requirement review and consultation",
                "Clear scope and recommended next steps",
                "Work planned around the building environment",
                "Ongoing service communication",
              ].map((x) => (
                <p className="flex gap-3" key={x}>
                  <CheckCircle2 className="mt-1 size-5 text-accent" />
                  {x}
                </p>
              ))}
            </div>
            <Button asChild className="mt-9">
              <Link to="/request-quote">
                Enquire about this service <ArrowRight />
              </Link>
            </Button>
          </div>
          <img
            src={s.image || img("service_detail_image", serviceImage)}
            width={1600}
            height={1072}
            alt={`${s.title} by Compass Elevators`}
            className="h-full min-h-96 w-full object-cover"
          />
        </div>
      </section>
    </PublicLayout>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: s, loading } = useLoad(
    () => contentService.services().then((list) => list.find((i) => i.slug === slug) ?? null),
    [slug],
  );
  usePageMeta(
    s ? `${s.title} | Compass Elevators` : "Service not found",
    s?.summary ?? "Elevator service unavailable.",
  );
  if (loading) return <PageLoader />;
  if (!s) return <NotFound />;
  return <DetailView s={s} />;
}
