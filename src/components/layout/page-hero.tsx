import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";
import { heroUnderlapClass } from "./nav-utils";

export interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Background image from /public/images. */
  image?: string;
  imageAlt?: string;
  /** Breadcrumb trail, last item is the current page. */
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

type Crumb = { label: string; href?: string };

function Breadcrumbs({ items }: { items: Crumb[] }) {
  // Always lead with Home so every trail is anchored, unless the caller already did.
  const trail: Crumb[] = items[0]?.href === "/" ? items : [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-6 animate-fade-up">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 text-ink-subtle" aria-hidden="true" />}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="text-ink-muted transition-colors hover:text-ink">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Cinematic inner-page hero. Slides under the transparent header, takes an
 * optional full-bleed photo (the page's LCP image, so it is preloaded)
 * and falls back to a grid with a purple bloom when there is no photo.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[26rem] items-end overflow-hidden border-b border-border sm:min-h-[30rem] lg:min-h-[max(34rem,56vh)]",
        heroUnderlapClass,
      )}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            preload
            sizes="100vw"
            className="-z-30 object-cover"
          />
          {/* Legibility: heavy floor fade, left-side vignette for the copy, and a top scrim for the header. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-linear-to-t from-bg via-bg/70 to-bg/30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-linear-to-r from-bg/90 via-bg/45 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-20 h-40 bg-linear-to-b from-bg/70 to-transparent"
          />
        </>
      ) : (
        <>
          <div aria-hidden="true" className="absolute inset-0 -z-30 bg-bg" />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-grid [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black_20%,transparent_75%)]"
          />
        </>
      )}

      {/* Purple bloom and a chrome hairline along the bottom edge. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute -top-48 left-1/2 -z-10 h-[34rem] w-[64rem] -translate-x-1/2 bg-radial to-transparent to-70%",
          image ? "from-brand-500/15" : "from-brand-500/25",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-ink/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-px w-72 -translate-x-1/2 bg-linear-to-r from-transparent via-brand-400/80 to-transparent"
      />

      <Container className="pt-28 pb-14 sm:pb-16 lg:pt-36 lg:pb-20">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && (
          <Eyebrow className="mb-5 animate-fade-up [animation-delay:60ms]">{eyebrow}</Eyebrow>
        )}
        <h1 className="max-w-4xl animate-fade-up text-4xl leading-[1.05] font-semibold text-balance [animation-delay:120ms] sm:text-5xl lg:text-6xl xl:text-7xl">
          {title}
        </h1>
        {description && (
          <div
            className={cn(
              "mt-5 max-w-2xl animate-fade-up text-base leading-relaxed text-pretty [animation-delay:180ms] sm:mt-6 sm:text-lg",
              image ? "text-ink/85" : "text-ink-muted",
            )}
          >
            {description}
          </div>
        )}
        {children && (
          <div className="mt-8 animate-fade-up [animation-delay:240ms] sm:mt-10">{children}</div>
        )}
      </Container>
    </section>
  );
}
