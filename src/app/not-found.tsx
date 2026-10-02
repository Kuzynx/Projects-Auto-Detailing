import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { bookingHref, siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

/** Featured services first, topped up from the full catalog, so there are always three. */
const suggestions = [
  ...services.filter((s) => s.featured),
  ...services.filter((s) => !s.featured),
].slice(0, 3);

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 h-[32rem] w-[56rem] -translate-x-1/2 bg-radial from-brand-500/15 to-transparent to-70%"
      />

      <Container className="flex flex-col items-center text-center">
        <p
          aria-hidden="true"
          className="animate-fade-up bg-linear-to-b from-ink via-ink-muted to-ink-subtle/20 bg-clip-text font-display text-[7rem] leading-none font-bold tracking-[-0.06em] text-transparent sm:text-[10rem] lg:text-[12rem]"
        >
          404
        </p>
        <Eyebrow className="mt-2 animate-fade-up [animation-delay:60ms]">Page not found</Eyebrow>
        <h1 className="mt-5 max-w-2xl animate-fade-up text-3xl font-semibold text-balance [animation-delay:120ms] sm:text-5xl">
          This page took a wrong turn.
        </h1>
        <p className="mt-5 max-w-xl animate-fade-up text-base text-pretty text-ink-muted [animation-delay:180ms] sm:text-lg">
          The link may be out of date, or the page has moved. Your car still deserves better than a
          dead end, so here is where most people are headed.
        </p>

        <div className="mt-10 flex w-full animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:w-auto sm:flex-row">
          <ButtonLink href={bookingHref} size="lg">
            Book a detail
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/services" variant="outline" size="lg">
            Explore services
          </ButtonLink>
          <ButtonLink href="/" variant="ghost" size="lg">
            Back to home
          </ButtonLink>
        </div>

        <div className="mt-16 w-full max-w-4xl animate-fade-up [animation-delay:300ms]">
          <h2 className="font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase">
            Popular services
          </h2>
          <ul className="mt-5 grid gap-3 text-left sm:grid-cols-3">
            {suggestions.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface/70 p-5 shadow-card backdrop-blur transition-colors hover:border-brand-500/50 hover:bg-surface-hover"
                >
                  <span className="flex items-start justify-between gap-3 font-display text-base font-semibold text-ink">
                    {service.name}
                    <ArrowUpRight
                      className="size-4 shrink-0 text-ink-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-300"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-2 text-sm text-ink-muted">{service.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 text-sm text-ink-muted">
          Rather talk it through?{" "}
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-1.5 font-medium text-brand-300 underline-offset-4 hover:underline"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            Call {siteConfig.phone}
          </a>
        </p>
      </Container>
    </section>
  );
}
