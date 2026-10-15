import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import solutions from "@/assets/elevator-solutions.jpg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { QuoteCta } from "@/components/site/QuoteCta";
import { contentService } from "@/services/contentService";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/blog")({
  loader: () => contentService.posts(),
  head: () => ({ meta: [{ title: "Blog & News | Compass Elevators Sri Lanka" }, { name: "description", content: "Articles, updates and guidance on elevator installation, maintenance and modernization from Compass Elevators." }, { property: "og:title", content: "Blog & News | Compass Elevators" }, { property: "og:description", content: "Elevator guidance and company updates." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Blog,
});
function Blog() {
  const posts = Route.useLoaderData();
  const { c } = useSite();
  return <PublicLayout><PageHero eyebrow="Blog" title={c("blog_title")} description={c("blog_desc")} />
    <section className="py-20"><div className="page-shell">
      {posts.length === 0 ? <p className="border border-dashed border-border p-12 text-center text-muted-foreground">New articles are coming soon.</p> :
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group border border-border bg-card">
          <div className="aspect-[16/10] overflow-hidden"><img src={p.cover || solutions} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
          <div className="p-6"><p className="eyebrow">{p.date ? new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</p><h2 className="mt-3 text-xl font-bold">{p.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{p.excerpt}</p><span className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">Read article <ArrowRight className="size-4" /></span></div>
        </Link>)}</div>}
    </div></section><QuoteCta /></PublicLayout>;
}
