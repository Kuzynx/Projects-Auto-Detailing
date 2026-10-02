import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/*
 * Pre-sized transparent WebP copies of the shield badge, generated with sharp from
 * /images/logo-transparent.png (947x929, kept for OG images and the manifest).
 * The static export serves source files untouched, so the source size is what ships.
 *   160w (21 KB): header and menu, rendered up to 64px tall (2.4x density at 64px).
 *   320w (56 KB): footer, rendered up to 144px tall (2.2x density).
 */
const sources = {
  small: { src: "/images/logo-small.webp", width: 160, height: 157 },
  large: { src: "/images/logo-small@2x.webp", width: 320, height: 314 },
} as const;

type LogoSize = "sm" | "md" | "lg";

/** Rendered heights. The badge is almost square, so width follows via `w-auto`. */
const sizing: Record<LogoSize, { className: string; sizes: string; source: keyof typeof sources }> =
  {
    sm: { className: "h-11", sizes: "48px", source: "small" },
    md: { className: "h-12 lg:h-16", sizes: "(min-width: 1024px) 66px, 50px", source: "small" },
    lg: { className: "h-32 sm:h-36", sizes: "148px", source: "large" },
  };

interface LogoProps {
  className?: string;
  /** sm = compact bars, md = site header (48px mobile, 64px desktop), lg = footer (~140px). */
  size?: LogoSize;
  /** Load immediately instead of lazily. Use for the above-the-fold header logo. */
  eager?: boolean;
  /** Adds a <link rel="preload"> (Next 16 replacement for `priority`). Rarely needed. */
  preload?: boolean;
}

/**
 * The client's shield badge on a transparent background. Purely presentational:
 * when wrapping it in a link, the image alt already names the link.
 */
export function Logo({ className, size = "md", eager = false, preload = false }: LogoProps) {
  const s = sizing[size];
  const img = sources[s.source];
  return (
    <Image
      src={img.src}
      alt={siteConfig.name}
      width={img.width}
      height={img.height}
      sizes={s.sizes}
      preload={preload}
      loading={eager || preload ? "eager" : "lazy"}
      className={cn("w-auto shrink-0 select-none", s.className, className)}
      draggable={false}
    />
  );
}
