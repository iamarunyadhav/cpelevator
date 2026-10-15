import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSite } from "@/lib/site-context";
export function QuoteCta(){const {company,c}=useSite();return <section className="bg-primary"><div className="page-shell grid items-center gap-8 py-16 md:grid-cols-[1fr_auto] md:py-20"><div><p className="eyebrow text-accent-light">Let’s talk</p><h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary-foreground md:text-5xl">{c("cta_title")}</h2><p className="mt-5 max-w-2xl text-primary-foreground/70">{c("cta_text")}</p></div><div className="flex flex-col gap-3 sm:flex-row md:flex-col"><Button asChild size="lg" variant="secondary"><Link to="/request-quote">Request a Quote <ArrowRight/></Link></Button><Button asChild size="lg" variant="outlineLight"><a href={company.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp Us</a></Button></div></div></section>}
