import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { QuoteCta } from "@/components/site/QuoteCta";
import { contentService } from "@/services/contentService";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLoad } from "@/hooks/useLoad";
import { PageLoader } from "@/components/site/PageLoader";
import NotFound from "@/pages/NotFound";
function PostView({ p }) {
  return (
    <PublicLayout>
      <article className="py-16 md:py-24">
        <div className="page-shell max-w-3xl">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"
          >
            <ArrowLeft className="size-4" />
            All articles
          </Link>
          <p className="eyebrow">
            {p.date
              ? new Date(p.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
            {p.author ? ` · ${p.author}` : ""}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{p.title}</h1>
          {p.cover && (
            <img src={p.cover} alt={p.title} className="mt-10 aspect-[16/9] w-full object-cover" />
          )}
          <div className="mt-10 space-y-5 text-lg leading-8 text-muted-foreground">
            {p.content
              .split(/\n{2,}|\n/)
              .filter(Boolean)
              .map((t, i) =>
                t.startsWith("## ") ? (
                  <h2 key={i} className="pt-4 text-2xl font-bold text-foreground">
                    {t.slice(3)}
                  </h2>
                ) : (
                  <p key={i}>{t}</p>
                ),
              )}
          </div>
        </div>
      </article>
      <QuoteCta />
    </PublicLayout>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data: p, loading } = useLoad(() => contentService.post(slug), [slug]);
  usePageMeta(
    p ? p.seoTitle || `${p.title} | Compass Elevators` : "Article not found",
    p ? p.seoDescription || p.excerpt || "Article from Compass Elevators." : "Article unavailable.",
  );
  if (loading) return <PageLoader />;
  if (!p) return <NotFound />;
  return <PostView p={p} />;
}
