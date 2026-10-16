import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import solutions from "@/assets/elevator-solutions.jpg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { QuoteCta } from "@/components/site/QuoteCta";
import { Button } from "@/components/ui/button";
import { contentService } from "@/services/contentService";
import { useSite } from "@/lib/site-context";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLoad } from "@/hooks/useLoad";
import { PageLoader } from "@/components/site/PageLoader";
import NotFound from "@/pages/NotFound";
function DetailView({ x }) {
  const { img } = useSite();
  return (
    <PublicLayout>
      <PageHero eyebrow={x.category} title={x.name} description={x.summary} />
      <section className="py-20">
        <div className="page-shell grid gap-12 lg:grid-cols-2">
          <img
            src={x.image || img("elevator_detail_image", solutions)}
            width={1920}
            height={1024}
            alt={`${x.name} visual reference`}
            className="h-full min-h-96 w-full object-cover"
          />
          <div>
            <p className="eyebrow">Planned for purpose</p>
            <h2 className="mt-4 text-3xl font-bold">
              A solution shaped around how your building operates
            </h2>
            {(x.long
              ? x.long.split(/\n+/)
              : [
                  "Our team considers expected use, building configuration, movement needs and the finish required before recommending a suitable system.",
                ]
            ).map((t, i) => (
              <p key={i} className="mt-6 leading-8 text-muted-foreground">
                {t}
              </p>
            ))}
            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <div>
                <h3 className="font-bold">Applications</h3>
                <ul className="mt-4 space-y-3">
                  {x.applications.map((a) => (
                    <li className="flex gap-2 text-sm text-muted-foreground" key={a}>
                      <Check className="size-4 text-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Key benefits</h3>
                <ul className="mt-4 space-y-3">
                  {x.benefits.map((a) => (
                    <li className="flex gap-2 text-sm text-muted-foreground" key={a}>
                      <Check className="size-4 text-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button asChild className="mt-9">
              <Link to="/request-quote">
                Request a quote <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <QuoteCta />
    </PublicLayout>
  );
}

export default function ElevatorDetail() {
  const { slug } = useParams();
  const { data: x, loading } = useLoad(
    () => contentService.elevators().then((list) => list.find((i) => i.slug === slug) ?? null),
    [slug],
  );
  usePageMeta(
    x ? `${x.name} Sri Lanka | Compass Elevators` : "Elevator not found",
    x?.summary ?? "Elevator solution unavailable.",
  );
  if (loading) return <PageLoader />;
  if (!x) return <NotFound />;
  return <DetailView x={x} />;
}
