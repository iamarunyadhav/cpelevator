import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { useSite } from "@/lib/site-context";
export function SiteFooter() {
  const { company } = useSite();
  const socials = [
    ["Facebook", company.facebook],
    ["Instagram", company.instagram],
    ["LinkedIn", company.linkedin],
    ["YouTube", company.youtube],
  ].filter(([, u]) => u);
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="page-shell grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo inverse />
          <p className="mt-6 max-w-lg text-sm leading-7 text-primary-foreground/70">
            {company.footer}
          </p>
          {company.emergency && (
            <p className="mt-4 max-w-lg text-sm font-semibold text-primary-foreground/85">
              {company.emergency}
            </p>
          )}
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-primary-foreground/70">
              {socials.map(([n, u]) => (
                <a
                  key={n}
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-foreground"
                >
                  {n}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="footer-title">Explore</h2>
          <div className="mt-5 grid gap-3 text-sm text-primary-foreground/70">
            <Link to="/elevators">Elevators</Link>
            <Link to="/services">Services</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <h2 className="footer-title">Contact</h2>
          <div className="mt-5 grid gap-4 text-sm text-primary-foreground/70">
            <a className="flex gap-3" href={company.phoneHref}>
              <Phone className="size-4 shrink-0 text-accent" />
              {company.phone}
            </a>
            <a className="flex gap-3" href={company.emailHref}>
              <Mail className="size-4 shrink-0 text-accent" />
              {company.email}
            </a>
            <p className="flex gap-3">
              <MapPin className="size-4 shrink-0 text-accent" />
              {company.address.join(", ")}
            </p>
            {company.hours && (
              <p className="flex gap-3">
                <Clock className="size-4 shrink-0 text-accent" />
                {company.hours}
              </p>
            )}
            <Link
              to="/contact"
              className="flex items-center gap-1 font-bold text-primary-foreground"
            >
              Directions & details <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-primary-foreground/55 sm:flex-row sm:justify-between">
          <p>{company.copyright}</p>
          <p>Engineered for safety. Built for everyday reliability.</p>
        </div>
      </div>
    </footer>
  );
}
