import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Badge, ButtonLink } from "@/components/ui";
import { bookingUrl, serviceLocations, type Service } from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";
import { SizeValue } from "./size-value";

/** Pricing cards for every service. Prices follow the page-level size toggle. */
export function PricingPlans({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => {
        const featured = Boolean(service.featured);
        return (
          <li
            key={service.slug}
            className={cn(
              "relative flex flex-col rounded-lg border bg-surface p-6 shadow-card sm:p-8",
              featured ? "border-brand-500/50 shadow-glow" : "border-border",
            )}
          >
            {featured && (
              <div
                aria-hidden
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent"
              />
            )}
            <div className="flex min-h-6 items-center justify-between gap-3">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase">
                {serviceLocations[service.location].shortLabel}
              </p>
              {service.badge && (
                <Badge tone={featured ? "brand" : "neutral"}>{service.badge}</Badge>
              )}
            </div>
            <h3 className="mt-4 text-2xl font-semibold">{service.name}</h3>
            <p className="mt-2 text-sm text-pretty text-ink-muted">{service.tagline}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <p className="font-display text-5xl font-semibold tracking-tight text-ink tabular-nums">
                <SizeValue render={(size) => formatPrice(service.price[size])} />
              </p>
              <span className="text-sm text-ink-subtle">{service.priceSuffix ?? "starting"}</span>
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
              <Clock aria-hidden className="size-4 text-brand-400" />
              <span className="sr-only">Duration:</span>
              <SizeValue render={(size) => service.duration[size]} />
            </p>

            <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6 text-sm text-ink-muted">
              {service.highlights.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <SizeValue
                display="block"
                render={(size) => (
                  <ButtonLink
                    href={bookingUrl({ service: service.slug, size })}
                    variant={featured ? "primary" : "outline"}
                    className="w-full"
                    aria-label={`Book ${service.name}`}
                  >
                    Book {service.name.replace(/^The /, "")}
                  </ButtonLink>
                )}
              />
              <Link
                href={`/services/${service.slug}`}
                className="flex items-center justify-center gap-1.5 py-1 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-300"
              >
                Full details
                <span className="sr-only"> for {service.name}</span>
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
