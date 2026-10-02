import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { CtaBanner } from "@/components/layout/cta-banner";
import { PageHero } from "@/components/layout/page-hero";
import { AddOnCard } from "@/components/services/add-on-card";
import { DecisionHelper } from "@/components/services/decision-helper";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceFilter } from "@/components/services/service-filter";
import {
  breadcrumbJsonLd,
  serviceSummaryJsonLd,
  siteUrl,
} from "@/components/services/structured-data";
import { ButtonLink, Container, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { addOns, getService, priceRange, services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatPrice } from "@/lib/utils";

const title = "Detailing Services";
const description = `Mobile hand washes, exterior details, inside-and-out packages and work truck washes across ${siteConfig.address.city} and the ${siteConfig.region}. Published prices for cars, SUVs, trucks, sports cars, exotics and motorcycles.`;
const ogImage = "/images/detail-foam-porsche.jpg";

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/services",
  image: ogImage,
  imageAlt: "Black Porsche covered in foam during a hand wash",
});

const pullQuote = testimonials.find((t) => t.id === "t6") ?? testimonials.at(0);

export default function ServicesPage() {
  const basic = getService("basic-wash");
  const washPrice = basic ? basic.price.car : Math.min(...services.map((s) => priceRange(s).min));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ label: "Services", href: "/services" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${siteConfig.name} detailing services`,
            url: siteUrl("/services"),
            itemListElement: services.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: serviceSummaryJsonLd(service),
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Services"
        title="Services built around how you actually use your car"
        description={`From a proper hand wash at ${formatPrice(washPrice)} for a car to a full inside-and-out detail. Every price is published by vehicle type, and ${siteConfig.founder.name} does the work himself, at your place.`}
        image={ogImage}
        imageAlt="Black Porsche covered in foam during a hand wash"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <Section size="sm" aria-labelledby="all-services">
        <Container>
          <h2 id="all-services" className="sr-only">
            All services
          </h2>
          <ServiceFilter
            items={services.map((service) => ({
              key: service.slug,
              category: service.category,
              node: <ServiceCard service={service} />,
            }))}
          />
        </Container>
      </Section>

      <Section tone="elevated" aria-labelledby="decision-helper" className="overflow-clip">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
        />
        <Container className="relative grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow className="mb-4">Not sure which package?</Eyebrow>
            <h2
              id="decision-helper"
              className="text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl"
            >
              Three questions. One honest answer.
            </h2>
            <p className="mt-4 text-base text-pretty text-ink-muted sm:text-lg">
              We would rather sell you the right service than the biggest one. Tell us about the car
              and we will point you to what it actually needs.
            </p>
            <p className="mt-6 text-sm text-ink-subtle">
              Still unsure? Text or call{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-semibold text-ink underline decoration-brand-500/60 underline-offset-4 hover:text-brand-300"
              >
                {siteConfig.phone}
              </a>{" "}
              and a detailer will look at photos for free.
            </p>
          </div>
          <DecisionHelper />
        </Container>
      </Section>

      {addOns.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Add-ons"
                title="Finish it your way"
                description="Bolt any of these onto a service. Flat prices, any vehicle type, added at booking."
              />
              <ButtonLink href="/pricing" variant="outline" className="self-start md:self-auto">
                Compare all prices
              </ButtonLink>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {addOns.map((addOn) => (
                <li key={addOn.slug}>
                  <AddOnCard addOn={addOn} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : (
        <Section size="sm">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-surface p-6 sm:p-8 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  Compare every package side by side
                </h2>
                <p className="mt-2 text-ink-muted">
                  Prices for all six vehicle types and exactly what each package includes.
                </p>
              </div>
              <ButtonLink href="/pricing" variant="outline">
                See full pricing
              </ButtonLink>
            </div>
          </Container>
        </Section>
      )}

      {pullQuote && (
        <Section size="sm" className="border-t border-border">
          <Container>
            <figure className="relative mx-auto max-w-4xl text-center">
              <Quote aria-hidden className="mx-auto size-10 text-brand-500/60" />
              <blockquote className="mt-6 font-display text-2xl leading-snug font-medium text-balance text-ink sm:text-3xl lg:text-4xl">
                &ldquo;{pullQuote.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-sm text-ink-muted">
                <span className="font-semibold text-ink">{pullQuote.name}</span>,{" "}
                {pullQuote.location}
                <span className="mx-2 text-ink-subtle" aria-hidden>
                  /
                </span>
                {pullQuote.vehicle}, {pullQuote.service}
              </figcaption>
            </figure>
          </Container>
        </Section>
      )}

      <CtaBanner
        title="Know what you need? Lock in a time."
        description="Booking takes about a minute, and we come to you."
      />
    </>
  );
}
