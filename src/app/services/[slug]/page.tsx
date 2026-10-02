import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, MapPin, Plus, Sparkles } from "lucide-react";
import { CtaBanner } from "@/components/layout/cta-banner";
import { PageHero } from "@/components/layout/page-hero";
import { BookingSidebar } from "@/components/services/booking-sidebar";
import { ServiceFaq } from "@/components/services/service-faq";
import { ServicePager } from "@/components/services/service-pager";
import { breadcrumbJsonLd, serviceJsonLd } from "@/components/services/structured-data";
import { Badge, Container, Eyebrow, Section } from "@/components/ui";
import { siteConfig } from "@/config/site";
import {
  addOns,
  bookingUrl,
  getAddOn,
  getService,
  priceRange,
  serviceCategories,
  serviceLocations,
  serviceProcess,
  services,
  type AddOn,
  type Service,
} from "@/data/services";
import { JsonLd } from "@/lib/seo/json-ld";
import { formatPrice } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const { min } = priceRange(service);
  const description = `${service.tagline} From ${formatPrice(min)}${service.priceSuffix ? ` ${service.priceSuffix}` : ""} in ${siteConfig.address.city}, ${siteConfig.address.state}. ${serviceLocations[service.location].label} service by certified detailers.`;
  const path = `/services/${service.slug}`;

  return {
    title: service.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${service.name} | ${siteConfig.name}`,
      description,
      url: path,
      images: [{ url: service.image, alt: service.name }],
    },
  };
}

function SectionTitle({
  id,
  eyebrow,
  children,
}: {
  id: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h2 id={id} className="text-2xl font-semibold text-balance sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === service.slug);
  const prev = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];

  const category =
    serviceCategories.find((c) => c.id === service.category)?.label ?? service.category;
  const location = serviceLocations[service.location];
  const steps = serviceProcess[service.category];
  const { min } = priceRange(service);

  const pairedServices = (service.pairsWith ?? [])
    .map((s) => getService(s))
    .filter((s): s is Service => Boolean(s));
  const pairedAddOns = (service.pairsWith ?? [])
    .map((s) => getAddOn(s))
    .filter((a): a is AddOn => Boolean(a));

  const recommendedSlugs = [
    ...new Set([...pairedAddOns.map((a) => a.slug), ...service.recommendedAddOns]),
  ];
  const recommended = recommendedSlugs
    .map((s) => getAddOn(s))
    .filter((a): a is AddOn => Boolean(a));
  const more = addOns.filter((a) => !recommendedSlugs.includes(a.slug));

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={category}
        title={service.name}
        description={service.tagline}
        image={service.image}
        imageAlt={service.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
          {service.badge && <Badge>{service.badge}</Badge>}
          <span className="inline-flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-ink">
              From {formatPrice(min)}
            </span>
            {service.priceSuffix && <span>{service.priceSuffix}</span>}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4 text-brand-400" />
            {service.duration.sedan === service.duration.truck
              ? service.duration.sedan
              : `${service.duration.sedan} to ${service.duration.truck}`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-4 text-brand-400" />
            {location.label} service
          </span>
        </div>
      </PageHero>

      <Section size="sm" className="sm:pt-20">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 xl:gap-20">
          <div className="min-w-0 space-y-16 sm:space-y-20">
            {/* Mobile quick-book strip; the full configurator follows the content. */}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4 lg:hidden">
              <div>
                <p className="text-xs text-ink-subtle">Starting from</p>
                <p className="font-display text-2xl font-semibold">
                  {formatPrice(min)}
                  {service.priceSuffix && (
                    <span className="ml-1 font-sans text-xs font-normal text-ink-subtle">
                      {service.priceSuffix}
                    </span>
                  )}
                </p>
              </div>
              <a
                href="#book"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-500 px-5 font-display text-sm font-semibold text-bg transition-colors hover:bg-brand-400"
              >
                Configure and book
                <ArrowRight aria-hidden className="size-4" />
              </a>
            </div>

            <section aria-labelledby="overview">
              <h2 id="overview" className="sr-only">
                Overview
              </h2>
              <p className="font-display text-xl leading-relaxed font-medium text-pretty text-ink sm:text-2xl">
                {service.description}
              </p>
              <p className="mt-6 flex items-start gap-3 text-sm text-ink-muted">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <span>
                  <span className="font-semibold text-ink">{location.label}.</span>{" "}
                  {location.description}
                </span>
              </p>
            </section>

            <section aria-labelledby="included">
              <SectionTitle id="included" eyebrow="What's included">
                Every {service.name} includes
              </SectionTitle>
              <div
                className={
                  service.recentJob
                    ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_220px] md:items-start"
                    : undefined
                }
              >
                <ul className={service.recentJob ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-md border border-border bg-surface px-4 py-3.5 text-sm text-ink sm:text-base"
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-400"
                      >
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                {service.recentJob && (
                  <figure className="overflow-hidden rounded-lg border border-border bg-surface">
                    <div className="relative">
                      <Image
                        src={service.recentJob.image}
                        alt={service.recentJob.alt}
                        width={service.recentJob.width}
                        height={service.recentJob.height}
                        sizes="(min-width: 768px) 220px, 100vw"
                        className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
                      />
                      <Badge tone="neutral" className="absolute top-3 left-3 backdrop-blur-md">
                        Recent job
                      </Badge>
                    </div>
                    <figcaption className="px-4 py-3 text-xs text-ink-muted">
                      {service.recentJob.caption}
                    </figcaption>
                  </figure>
                )}
              </div>
            </section>

            <section aria-labelledby="ideal-for">
              <SectionTitle id="ideal-for" eyebrow="Ideal for">
                Who books this most
              </SectionTitle>
              <ul className="flex flex-wrap gap-2">
                {service.idealFor.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border-strong bg-white/[0.03] px-4 py-2 text-sm font-medium text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="process">
              <SectionTitle id="process" eyebrow="How we do it">
                The process, step by step
              </SectionTitle>
              <ol className="relative space-y-6 border-l border-border pl-8">
                {steps.map((step, i) => (
                  <li key={step.title} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-0 -left-[calc(2rem+0.875rem+0.5px)] grid size-7 place-items-center rounded-full border border-brand-500/50 bg-bg font-display text-xs font-semibold text-brand-300"
                    >
                      {i + 1}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm text-pretty text-ink-muted sm:text-base">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="aftercare">
              <SectionTitle id="aftercare" eyebrow="Aftercare">
                Keep the finish longer
              </SectionTitle>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.aftercare.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-md bg-bg-elevated p-4 text-sm text-ink-muted"
                  >
                    <Sparkles aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="faq">
              <SectionTitle id="faq" eyebrow="Questions">
                {service.name} FAQ
              </SectionTitle>
              <ServiceFaq items={service.faq} />
              <p className="mt-4 text-sm text-ink-subtle">
                More answers on our{" "}
                <Link
                  href="/faq"
                  className="font-semibold text-ink-muted underline decoration-brand-500/60 underline-offset-4 hover:text-brand-300"
                >
                  FAQ page
                </Link>
                .
              </p>
            </section>

            {(pairedServices.length > 0 || pairedAddOns.length > 0) && (
              <section aria-labelledby="pairs-with">
                <SectionTitle id="pairs-with" eyebrow="Pairs well with">
                  Get more from this visit
                </SectionTitle>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {pairedServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex h-full items-center gap-4 rounded-lg border border-border bg-surface p-3 pr-5 transition-colors hover:border-brand-500/50"
                      >
                        <span className="relative size-20 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={s.image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display font-semibold text-ink">
                            {s.name}
                          </span>
                          <span className="mt-0.5 block text-sm text-ink-muted">
                            From {formatPrice(s.price.sedan)}
                            {s.priceSuffix ? ` ${s.priceSuffix}` : ""}
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 text-ink-subtle transition-all group-hover:translate-x-0.5 group-hover:text-brand-400"
                        />
                      </Link>
                    </li>
                  ))}
                  {pairedAddOns.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={bookingUrl({ service: service.slug, addons: [a.slug] })}
                        className="group flex h-full items-center gap-4 rounded-lg border border-border bg-surface p-3 pr-5 transition-colors hover:border-brand-500/50"
                      >
                        <span
                          aria-hidden
                          className="grid size-20 shrink-0 place-items-center rounded-md bg-brand-500/10 text-brand-400"
                        >
                          <Plus className="size-6" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display font-semibold text-ink">
                            {a.name}
                          </span>
                          <span className="mt-0.5 block text-sm text-ink-muted">
                            Add-on, +{formatPrice(a.price)} · {a.description}
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="size-4 shrink-0 text-ink-subtle transition-all group-hover:translate-x-0.5 group-hover:text-brand-400"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside
            id="book"
            aria-label={`Book ${service.name}`}
            className="scroll-mt-24 [scrollbar-width:thin] lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:rounded-lg"
          >
            <BookingSidebar
              service={{
                slug: service.slug,
                name: service.name,
                price: service.price,
                duration: service.duration,
                location: service.location,
                priceSuffix: service.priceSuffix,
              }}
              recommended={recommended}
              more={more}
            />
          </aside>
        </Container>
      </Section>

      <Section size="sm" className="border-t border-border">
        <Container>
          <ServicePager prev={prev} next={next} />
        </Container>
      </Section>

      <CtaBanner
        title={`Ready to book your ${service.name}?`}
        description="Pick a time online in about a minute. We confirm by text within the hour."
        primaryLabel="Book this service"
        primaryHref={bookingUrl({ service: service.slug })}
      />
    </>
  );
}
