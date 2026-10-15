import { Link } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSite } from "@/lib/site-context";

const links = [["/","Home"],["/about","About Us"],["/elevators","Elevators"],["/services","Services"],["/projects","Projects"],["/blog","Blog"],["/contact","Contact"]] as const;
export function SiteHeader() {
 const { company } = useSite();
 return <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
  <div className="page-shell flex h-20 items-center justify-between">
   <Logo />
   <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
    {links.map(([to,label])=><Link key={to} to={to} className="nav-link" activeProps={{className:"nav-link nav-link-active"}}>{label}</Link>)}
   </nav>
   <div className="hidden items-center gap-3 lg:flex">
    <a href={company.phoneHref} className="flex items-center gap-2 text-sm font-semibold text-primary"><Phone className="size-4" />{company.phone}</a>
    <Button asChild size="lg"><Link to="/request-quote">Get a Quote</Link></Button>
   </div>
   <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button></SheetTrigger>
    <SheetContent className="flex flex-col"><SheetHeader><SheetTitle><Logo /></SheetTitle></SheetHeader>
     <nav className="mt-8 flex flex-col" aria-label="Mobile navigation">{links.map(([to,label])=><SheetClose asChild key={to}><Link to={to} className="border-b border-border py-4 text-lg font-semibold text-foreground">{label}</Link></SheetClose>)}</nav>
     <div className="mt-auto grid gap-3"><Button asChild variant="outline"><a href={company.phoneHref}>Call {company.phone}</a></Button><Button asChild variant="secondary"><a href={company.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a></Button><Button asChild><Link to="/request-quote">Request a Quote</Link></Button></div>
    </SheetContent></Sheet>
  </div>
 </header>;
}
