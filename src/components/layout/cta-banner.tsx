import { useId } from "react";
import { ArrowRight, BadgeCheck, Phone, ShieldCheck, Star } from "lucide-react";
import { ButtonLink, Container, Eyebrow, buttonClasses } from "@/components/ui";
import { bookingHref, siteConfig } from "@/config/site";

export interface CtaBannerProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
}

const { googleRating, reviewCount } = siteConfig.stats;

/** Closing call to action used at the foot of most pages, just above the footer. */
export function CtaBanner({
  title = "Ready for a showroom finish?",
  description = `Pick your service and a time that suits you. We come to your home or office anywhere in greater ${siteConfig.address.city}, or you can drop the car at our studio.`,
  primaryLabel = "Book your detail",
  primaryHref = bookingHref,
}: CtaBannerProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className="relative isolate overflow-hidden border-t border-border py-24 sm:py-32"
    >
      {/* Purple bloom rising from below, a masked grid, and a chrome hairline. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black_10%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-72 left-1/2 -z-10 h-[40rem] w-[72rem] -translate-x-1/2 bg-radial from-brand-500/35 to-transparent to-70%"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 left-1/2 -z-10 h-56 w-[30rem] -translate-x-1/2 bg-radial from-brand-300/20 to-transparent to-70%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-2xl bg-linear-to-r from-transparent via-ink/40 to-transparent"
      />

      <Container className="flex flex-col items-center text-center">
        <Eyebrow>Book online, day or night</Eyebrow>
        <h2
          id={titleId}
          className="mt-5 max-w-3xl text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl"
        >
          {title}
        </h2>
        {description && (
          <div className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
            {description}
          </div>
        )}

        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <ButtonLink href={primaryHref} size="lg" className="group">
            {primaryLabel}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </ButtonLink>
          <a href={siteConfig.phoneHref} className={buttonClasses("outline", "lg")}>
            <Phone className="size-4" aria-hidden="true" />
            <span>
              <span className="sr-only">Call </span>
              {siteConfig.phone}
            </span>
          </a>
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-ink-muted">
          <li className="flex items-center gap-2.5">
            <span className="flex gap-0.5 text-amber-400" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" strokeWidth={0} />
              ))}
            </span>
            <span>
              <span className="font-display font-semibold text-ink">{googleRating.toFixed(1)}</span>
              <span className="sr-only"> out of 5</span> from {reviewCount.toLocaleString("en-US")}{" "}
              Google reviews
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-400" aria-hidden="true" />
            Fully insured
          </li>
          <li className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-brand-400" aria-hidden="true" />
            3-year coating warranty
          </li>
        </ul>
      </Container>
    </section>
  );
}
