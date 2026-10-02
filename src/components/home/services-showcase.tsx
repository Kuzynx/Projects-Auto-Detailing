import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge, Container, Section, SectionHeading } from "@/components/ui";
import { services, type Service } from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

/**
 * Bento order on desktop (4 columns, 3 rows): featured, small, small, featured, small, small.
 * Auto-placement then lands the second featured tile in columns 3-4 of rows 2-3, so the grid
 * interlocks with no gaps. Falls back to catalog order if the featured count ever changes.
 */
function bentoOrder(list: Service[]) {
  const featured = list.filter((s) => s.featured);
  const rest = list.filter((s) => !s.featured);
  if (featured.length !== 2 || rest.length !== 4) return list;
  return [featured[0], rest[0], rest[1], featured[1], rest[2], rest[3]];
}

export function ServicesShowcase() {
  const ordered = bentoOrder(services);

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
                Six services. <span className="text-gradient-brand">One standard.</span>
              </span>
            }
            description="From a proper hand wash to a multi-year ceramic coating. Published starting prices, no surprise upsells, and the same checklist on every car."
          />
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 font-display text-sm font-semibold text-brand-300 transition-colors hover:text-ink"
          >
            View all services
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.07}
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-4"
        >
          {ordered.map((service) => (
            <RevealItem
              as="li"
              key={service.slug}
              className={cn(service.featured ? "md:col-span-2 lg:row-span-2" : "col-span-1")}
            >
              <ServiceTile service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

function ServiceTile({ service }: { service: Service }) {
  const featured = Boolean(service.featured);

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-card transition-all duration-500",
        "hover:border-brand-500/60 hover:shadow-glow focus-visible:border-brand-500/60 focus-visible:shadow-glow",
        featured ? "min-h-[24rem] sm:p-8 lg:min-h-0" : "min-h-[17rem] lg:min-h-0",
      )}
    >
      <Image
        src={service.image}
        alt=""
        fill
        sizes={
          featured
            ? "(min-width: 1024px) 50vw, 100vw"
            : "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        }
        className={cn(
          "-z-20 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]",
          featured ? "opacity-90" : "opacity-45 grayscale-[35%]",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 bg-linear-to-t",
          featured ? "from-bg via-bg/60 to-bg/5" : "from-bg via-bg/80 to-bg/40",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-brand-700/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="absolute top-5 right-5 left-5 flex items-start justify-between gap-3 sm:top-6 sm:right-6 sm:left-6">
        {service.badge ? (
          <Badge className="bg-bg/60 backdrop-blur-md">{service.badge}</Badge>
        ) : (
          <span />
        )}
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 bg-bg/40 text-ink backdrop-blur-md transition-all duration-300 group-hover:border-brand-400 group-hover:bg-brand-500 group-hover:text-bg">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>

      <h3 className={cn("font-semibold text-ink", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
        {service.name}
      </h3>
      <p
        className={cn(
          "mt-2 text-pretty text-ink-muted",
          featured ? "max-w-md text-base" : "text-sm",
        )}
      >
        {service.tagline}
      </p>
      <p className="mt-4 flex items-baseline gap-1.5 text-sm text-ink-muted">
        from
        <span
          className={cn("font-display font-semibold text-ink", featured ? "text-2xl" : "text-lg")}
        >
          {formatPrice(service.price.sedan)}
        </span>
      </p>
    </Link>
  );
}
