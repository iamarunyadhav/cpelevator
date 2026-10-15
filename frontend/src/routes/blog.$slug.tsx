import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { QuoteCta } from "@/components/site/QuoteCta";
import { contentService } from "@/services/contentService";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => { const p = await contentService.post(params.slug); if (!p) throw notFound(); return p; },
  head: ({ loaderData }) => {
    const title = loaderData ? (loaderData.seoTitle || `${loaderData.title} | Compass Elevators`) : "Article not found";
    const desc = loaderData ? (loaderData.seoDescription || loaderData.excerpt || "Article from Compass Elevators.") : "Article unavailable.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: Post,
});
function Post() {
  const p = Route.useLoaderData();
  return <PublicLayout><article className="py-16 md:py-24"><div className="page-shell max-w-3xl">
    <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" />All articles</Link>
    <p className="eyebrow">{p.date ? new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}{p.author ? ` · ${p.author}` : ""}</p>
    <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{p.title}</h1>
    {p.cover && <img src={p.cover} alt={p.title} className="mt-10 aspect-[16/9] w-full object-cover" />}
    <div className="mt-10 space-y-5 text-lg leading-8 text-muted-foreground">{p.content.split(/\n{2,}|\n/).filter(Boolean).map((t, i) => t.startsWith("## ") ? <h2 key={i} className="pt-4 text-2xl font-bold text-foreground">{t.slice(3)}</h2> : <p key={i}>{t}</p>)}</div>
  </div></article><QuoteCta /></PublicLayout>;
}
