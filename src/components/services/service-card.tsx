import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, MapPin } from "lucide-react";
import { Badge, ButtonLink } from "@/components/ui";
import {
  bookingUrl,
  formatServicePrice,
  serviceCategories,
  serviceLocations,
  vehicleSizes,
  type Service,
  type VehicleSize,
} from "@/data/services";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  /** When set, show the price and duration for this vehicle size instead of "from". */
  size?: VehicleSize;
  /** Heading level for the service name. Defaults to h3. */
  headingLevel?: "h2" | "h3";
  className?: string;
}

export function ServiceCard({
  service,
  size,
  headingLevel: Heading = "h3",
  className,
}: ServiceCardProps) {
  const activeSize = size ?? "car";
  const samePriceEverywhere = vehicleSizes.every((v) => service.price[v.id] === service.price.car);
  const showSuffix = service.priceSuffix && !service.priceNote?.[activeSize];
  const category = serviceCategories.find((c) => c.id === service.category)?.label;
  const detailsHref = `/services/${service.slug}`;
  const featured = Boolean(service.featured);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border bg-surface shadow-card transition-all duration-300",
        featured
          ? "border-brand-500/40 shadow-glow hover:border-brand-400/70"
          : "border-border hover:-translate-y-0.5 hover:border-border-strong",
        className,
      )}
    >
      {featured && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent"
        />
      )}

      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 320px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {service.badge && (
            <Badge tone={featured ? "brand" : "neutral"} className="backdrop-blur-md">
              {service.badge}
            </Badge>
          )}
        </div>
        <div className="absolute right-4 bottom-3 left-4 flex items-center justify-between gap-3 text-xs text-ink-muted">
          <span className="font-display tracking-wider uppercase">{category}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden className="size-3.5" />
            {serviceLocations[service.location].shortLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Heading className="text-xl font-semibold text-ink">
          <Link
            href={detailsHref}
            className="after:absolute after:inset-0 after:z-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-400"
          >
            {service.name}
          </Link>
        </Heading>
        <p className="mt-2 text-sm text-pretty text-ink-muted">{service.tagline}</p>

        <div className="mt-5 flex items-end justify-between gap-4 border-y border-border py-4">
          <div>
            <p className="text-xs text-ink-subtle">
              {size
                ? vehicleSizes.find((v) => v.id === size)?.label
                : samePriceEverywhere
                  ? "Any vehicle"
                  : vehicleSizes.find((v) => v.id === "car")?.label}
            </p>
            <p className="font-display text-3xl font-semibold tracking-tight text-ink">
              {formatServicePrice(service, activeSize)}
              {showSuffix && (
                <span className="ml-1.5 font-sans text-sm font-normal tracking-normal text-ink-subtle">
                  {service.priceSuffix}
                </span>
              )}
            </p>
          </div>
          <p className="inline-flex items-center gap-1.5 pb-1 text-sm text-ink-muted">
            <Clock aria-hidden className="size-4 text-brand-400" />
            <span>
              <span className="sr-only">Duration: </span>
              {service.duration[activeSize]}
            </span>
          </p>
        </div>
        {!size && !samePriceEverywhere && (
          <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
            {vehicleSizes
              .filter((v) => v.id !== "car")
              .map((v) => `${v.label} ${formatServicePrice(service, v.id)}`)
              .join("  ·  ")}
          </p>
        )}

        <ul className="mt-5 space-y-2.5 text-sm text-ink-muted">
          {service.highlights.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3 pt-6">
          <ButtonLink
            href={bookingUrl({ service: service.slug, size })}
            size="sm"
            variant={featured ? "primary" : "outline"}
            aria-label={`Book ${service.name}`}
          >
            Book
          </ButtonLink>
          <Link
            href={detailsHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-300"
            aria-label={`View details for ${service.name}`}
          >
            View details
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
