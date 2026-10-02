import type { Metadata } from "next";
import { CtaBanner } from "@/components/layout/cta-banner";
import { PageHero } from "@/components/layout/page-hero";
import { AddOnList } from "@/components/pricing/add-on-list";
import { ComparisonMatrix } from "@/components/pricing/comparison-matrix";
import { PriceFactors } from "@/components/pricing/price-factors";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { PricingSizeToggle } from "@/components/pricing/pricing-size-toggle";
import { ServiceCallout } from "@/components/pricing/service-callout";
import { SizeScope } from "@/components/pricing/size-scope";
import {
  breadcrumbJsonLd,
  offerPriceJsonLd,
  providerJsonLd,
  siteUrl,
} from "@/components/services/structured-data";
import { Container, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { addOns, comparisonFeatures, priceRange, services, vehicleSizes } from "@/data/services";
import { JsonLd } from "@/lib/seo/json-ld";
import { formatPrice } from "@/lib/utils";

const title = "Pricing";
const description = `Published mobile detailing prices in ${siteConfig.address.city} and the ${siteConfig.region} by vehicle type, from ${formatPrice(
  Math.min(...services.map((s) => priceRange(s).min)),
)}. Compare the Basic, Premium and Full Deluxe packages and Working Truck service. No surprise upsells.`;
const ogImage = "/images/hero-garage.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: "/pricing",
    images: [
      { url: ogImage, alt: "White Chevrolet Camaro ZL1 under low light in a collector garage" },
    ],
  },
};

export default function PricingPage() {
  const packages = services.filter((s) => s.category !== "work");
  const workTruck = services.find((s) => s.category === "work");
  const matrixServices = [...services].sort((a, b) => a.price.car - b.price.car);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: `${siteConfig.name} pricing`,
            url: siteUrl("/pricing"),
            itemListElement: services.flatMap((service) =>
              vehicleSizes.map((size) => ({
                ...offerPriceJsonLd(service, size.id),
                "@type": "Offer",
                name: `${service.name}, ${size.label}`,
                url: siteUrl(`/services/${service.slug}`),
                itemOffered: { "@type": "Service", name: service.name, provider: providerJsonLd() },
              })),
            ),
          },
        ]}
      />

      <PageHero
        eyebrow="Pricing"
        title="Transparent pricing. No surprise upsells."
        description="Every price is published by vehicle type, from motorcycles to exotics. Anything extra, like heavy soil or a very dirty work truck, is quoted before we start."
        image={ogImage}
        imageAlt="White Chevrolet Camaro ZL1 under low light in a collector garage"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />

      <SizeScope>
        <div className="sticky top-16 z-30 border-b border-border bg-bg/85 backdrop-blur-xl lg:top-20">
          <Container className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            <p className="font-display text-sm font-semibold text-ink">
              Prices for your vehicle
              <span className="ml-2 hidden font-sans font-normal text-ink-subtle lg:inline">
                Updates every price on this page
              </span>
            </p>
            <PricingSizeToggle />
          </Container>
        </div>

        <Section size="sm" aria-labelledby="packages">
          <Container>
            <SectionHeading
              eyebrow="Packages"
              title={<span id="packages">Three packages. One clear price each.</span>}
              description="Pick your vehicle type above and every price on this page updates. All services are mobile; we come to you."
            />
            <div className="mt-12">
              <PricingPlans services={packages} />
            </div>
          </Container>
        </Section>

        {workTruck && (
          <Section size="sm" aria-labelledby="work-vehicles" className="pt-0 sm:pt-0">
            <Container>
              <ServiceCallout
                service={workTruck}
                titleId="work-vehicles"
                title="Any work vehicle starts at"
                ctaLabel="Book a work truck wash"
              />
            </Container>
          </Section>
        )}

        <Section tone="elevated" aria-labelledby="compare">
          <Container>
            <SectionHeading
              eyebrow="Compare"
              title={<span id="compare">Exactly what you get, side by side</span>}
              description="No vague tiers. Every step we do, and which service includes it."
            />
            <div className="mt-12">
              <ComparisonMatrix services={matrixServices} features={comparisonFeatures} />
            </div>
          </Container>
        </Section>

        {addOns.length > 0 && (
          <Section aria-labelledby="add-ons">
            <Container className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
              <SectionHeading
                eyebrow="Add-ons"
                title={<span id="add-ons">Add exactly what you need</span>}
                description="Flat prices on any service and any vehicle type. Pick them at booking."
                className="lg:sticky lg:top-40 lg:self-start"
              />
              <AddOnList addOns={addOns} />
            </Container>
          </Section>
        )}
      </SizeScope>

      <Section size="sm">
        <Container>
          <PriceFactors />
        </Container>
      </Section>

      <CtaBanner
        title="Know your price? Pick a time."
        description="Booking takes about a minute, and we come to you."
      />
    </>
  );
}
