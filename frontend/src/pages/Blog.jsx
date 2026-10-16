import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import solutions from "@/assets/elevator-solutions.jpg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { QuoteCta } from "@/components/site/QuoteCta";
import { contentService } from "@/services/contentService";
import { useSite } from "@/lib/site-context";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLoad } from "@/hooks/useLoad";
import { PageLoader } from "@/components/site/PageLoader";
function BlogView({ data }) {
  const posts = data;
  const { c } = useSite();
  return (
    <PublicLayout>
      <PageHero eyebrow="Blog" title={c("blog_title")} description={c("blog_desc")} />
      <section className="py-20">
        <div className="page-shell">
          {posts.length === 0 ? (
            <p className="border border-dashed border-border p-12 text-center text-muted-foreground">
              New articles are coming soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group border border-border bg-card"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={p.cover || solutions}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="eyebrow">
                      {p.date
                        ? new Date(p.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                    <h2 className="mt-3 text-xl font-bold">{p.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <span className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">
                      Read article <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <QuoteCta />
    </PublicLayout>
  );
}

export default function Blog() {
  usePageMeta(
    "Blog & News | Compass Elevators Sri Lanka",
    "Articles, updates and guidance on elevator installation, maintenance and modernization from Compass Elevators.",
  );
  const { data } = useLoad(() => contentService.posts());
  if (!data) return <PageLoader />;
  return <BlogView data={data} />;
}
