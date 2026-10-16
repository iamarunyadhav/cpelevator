import { MessageCircle } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useSite } from "@/lib/site-context";
export function PublicLayout({ children }) {
  const { company } = useSite();
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <a
        href={company.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Message Compass Elevators on WhatsApp"
        className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-success text-success-foreground shadow-xl transition-transform hover:-translate-y-1"
      >
        <MessageCircle className="size-6" />
      </a>
    </>
  );
}
