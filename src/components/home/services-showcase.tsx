import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Truck } from "lucide-react";
import { Badge, Container, Section, SectionHeading } from "@/components/ui";
import { getService, services, type Service } from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";
import { startingPrice, vehicleClassList } from "./pricing";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

const FEATURED_SLUG = "full-deluxe";
const TRUCK_SLUG = "working-truck";
/** Client-supplied price factor for the Working Truck service (docs/SERVICES-SPEC.md). */
const TRUCK_NOTE =
  "Extremely dirty trucks, SUVs and work vehicles add $15–$30, quoted on site before we start.";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

type Variant = "featured" | "standard" | "wide";

/**
 * Desktop bento (3 columns): the featured package fills columns 1-2 of rows 1-2, the other
 * packages stack in column 3, and Working Truck runs full width underneath.
 */
function bento() {
  const featured = services.find((s) => s.featured) ?? getService(FEATURED_SLUG);
  const truck = getService(TRUCK_SLUG);
  const rest = services.filter((s) => s !== featured && s !== truck);
  const tiles: { service: Service; variant: Variant }[] = [];
  if (featured) tiles.push({ service: featured, variant: "featured" });
  rest.forEach((service) => tiles.push({ service, variant: "standard" }));
  if (truck) tiles.push({ service: truck, variant: "wide" });
  return tiles;
}

const spans: Record<Variant, string> = {
  featured: "md:col-span-2 lg:row-span-2",
  standard: "col-span-1",
  wide: "md:col-span-2 lg:col-span-3",
};

export function ServicesShowcase() {
  const tiles = bento();
  const count = NUMBER_WORDS[services.length] ?? String(services.length);

  return (
    <Section aria-labelledby="services-title" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <Container className="relative">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Services"
            title={
              <span id="services-title">
                {count} packages. <span className="text-gradient-brand">One standard.</span>
              </span>
            }
            description={`From a proper hand wash to a full inside-and-out detail, plus a package built for working trucks. ${vehicleClassList()}, all welcome. Published starting prices, no surprise upsells, and the same checklist on every vehicle.`}
          />
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-brand-300 transition-colors hover:text-ink"
          >
            Compare packages
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.07}
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-3"
        >
          {tiles.map(({ service, variant }) => (
            <RevealItem as="li" key={service.slug} className={spans[variant]}>
              <ServiceTile service={service} variant={variant} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

function Price({ service, large }: { service: Service; large?: boolean }) {
  return (
    <p className="flex items-baseline gap-1.5 text-sm text-ink-muted">
      from
      <span className={cn("font-display font-semibold text-ink", large ? "text-2xl" : "text-lg")}>
        {formatPrice(startingPrice(service))}
      </span>
      {service.priceSuffix && <span>{service.priceSuffix}</span>}
    </p>
  );
}

function ServiceTile({ service, variant }: { service: Service; variant: Variant }) {
  const featured = variant === "featured";
  const wide = variant === "wide";

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative isolate flex h-full overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-card transition-all duration-500",
        "hover:border-brand-500/60 hover:shadow-glow focus-visible:border-brand-500/60 focus-visible:shadow-glow",
        wide
          ? "min-h-[17rem] flex-col justify-end gap-6 sm:p-8 lg:min-h-0 lg:flex-row lg:items-end lg:justify-between"
          : "flex-col justify-end",
        featured && "min-h-[24rem] sm:p-8 lg:min-h-0",
        variant === "standard" && "min-h-[17rem] lg:min-h-0",
      )}
    >
      <Image
        src={service.image}
        alt=""
        fill
        sizes={
          featured
            ? "(min-width: 1024px) 66vw, 100vw"
            : wide
              ? "100vw"
              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        }
        className={cn(
          "-z-20 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]",
          featured ? "opacity-90" : "opacity-45 grayscale-[35%]",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10",
          featured && "bg-linear-to-t from-bg via-bg/60 to-bg/5",
          variant === "standard" && "bg-linear-to-t from-bg via-bg/80 to-bg/40",
          wide && "bg-linear-to-t from-bg via-bg/85 to-bg/50 lg:bg-linear-to-r",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-brand-700/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="absolute top-5 right-5 left-5 flex items-start justify-between gap-3 sm:top-6 sm:right-6 sm:left-6">
        {wide ? (
          <Badge className="bg-bg/60 backdrop-blur-md">
            <Truck className="size-3" aria-hidden="true" />
            Working trucks welcome
          </Badge>
        ) : service.badge ? (
          <Badge className="bg-bg/60 backdrop-blur-md">{service.badge}</Badge>
        ) : (
          <span />
        )}
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 bg-bg/40 text-ink backdrop-blur-md transition-all duration-300 group-hover:border-brand-400 group-hover:bg-brand-500 group-hover:text-bg">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>

      <div className={cn(wide && "lg:max-w-xl")}>
        <h3
          className={cn(
            "font-semibold text-ink",
            featured || wide ? "text-2xl sm:text-3xl" : "text-xl",
          )}
        >
          {service.name}
        </h3>
        <p
          className={cn(
            "mt-2 text-pretty text-ink-muted",
            featured || wide ? "max-w-md text-base" : "text-sm",
          )}
        >
          {service.tagline}
        </p>
        {!wide && (
          <div className="mt-4">
            <Price service={service} large={featured} />
          </div>
        )}
      </div>

      {wide && (
        <div className="flex flex-col gap-2 lg:max-w-sm lg:items-end lg:text-right">
          <Price service={service} large />
          <p className="text-sm text-pretty text-ink-subtle">{TRUCK_NOTE}</p>
        </div>
      )}
    </Link>
  );
}
