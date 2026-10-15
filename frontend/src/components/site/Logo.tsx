import mark from "@/assets/compass-mark.png";
import { Link } from "@tanstack/react-router";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link to="/" className="flex items-center gap-2.5" aria-label="Compass Elevators home">
    <img src={mark} alt="" width={48} height={48} className="h-11 w-11 object-contain" />
    <span className={inverse ? "text-primary-foreground" : "text-primary"}>
      <strong className="block font-display text-[1.05rem] leading-none uppercase">Compass</strong>
      <span className="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.28em] text-accent">Elevators</span>
    </span>
  </Link>;
}
