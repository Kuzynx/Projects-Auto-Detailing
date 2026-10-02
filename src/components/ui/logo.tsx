import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Intrinsic size of /images/logo-transparent.png (trimmed shield badge). */
const LOGO_WIDTH = 947;
const LOGO_HEIGHT = 929;

type LogoSize = "sm" | "md" | "lg";

/**
 * Rendered heights. The badge is almost square, so width follows via `w-auto`.
 * `sizes` is the widest rendered width so the optimizer serves a crisp 2x file.
 */
const sizing: Record<LogoSize, { className: string; sizes: string }> = {
  sm: { className: "h-11", sizes: "48px" },
  md: { className: "h-12 lg:h-16", sizes: "(min-width: 1024px) 66px, 50px" },
  lg: { className: "h-32 sm:h-36", sizes: "148px" },
};

interface LogoProps {
  className?: string;
  /** sm = compact bars, md = site header (48px mobile, 64px desktop), lg = footer (~140px). */
  size?: LogoSize;
  /** Set only where the logo is above the fold (the site header). */
  priority?: boolean;
}

/**
 * The client's shield badge on a transparent background. Purely presentational:
 * when wrapping it in a link, the image alt already names the link.
 */
export function Logo({ className, size = "md", priority = false }: LogoProps) {
  const s = sizing[size];
  return (
    <Image
      src={siteConfig.logoTransparent}
      alt={siteConfig.name}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      sizes={s.sizes}
      priority={priority}
      className={cn("w-auto shrink-0 select-none", s.className, className)}
      draggable={false}
    />
  );
}
