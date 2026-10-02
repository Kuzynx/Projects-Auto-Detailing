import type { Metadata } from "next";
import { CtaBanner } from "@/components/layout/cta-banner";
import { PageHero } from "@/components/layout/page-hero";
import { AddOnList } from "@/components/pricing/add-on-list";
import { ComparisonMatrix } from "@/components/pricing/comparison-matrix";
import { MaintenanceCallout } from "@/components/pricing/maintenance-callout";
import { PriceFactors } from "@/components/pricing/price-factors";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { PricingSizeToggle } from "@/components/pricing/pricing-size-toggle";
import { SizeScope } from "@/components/pricing/size-scope";
import { breadcrumbJsonLd, providerJsonLd, siteUrl } from "@/components/services/structured-data";
import { Container, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { addOns, comparisonFeatures, getService, services, vehicleSizes } from "@/data/services";
import { JsonLd } from "@/lib/seo/json-ld";
import { formatPrice } from "@/lib/utils";

const title = "Pricing";
const description = `Published auto detailing prices in ${siteConfig.address.city} by vehicle size, from ${formatPrice(
  Math.min(...services.map((s) => s.price.sedan)),
)}. Compare packages, add-ons and maintenance plans. No surprise upsells.`;
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
  const plan = getService("maintenance-plan");
  const matrixServices = [...services].sort((a, b) => a.price.sedan - b.price.sedan);

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
                "@type": "Offer",
                name: `${service.name}, ${size.label}`,
                price: service.price[size.id],
                priceCurrency: "USD",
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
        description="Every price is published by vehicle size. What you see is what you pay for a car in normal condition, and anything extra is quoted before we start."
        image={ogImage}
        imageAlt="White Chevrolet Camaro ZL1 under low light in a collector garage"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />

      <SizeScope>
        <div className="sticky top-16 z-30 border-b border-border bg-bg/85 backdrop-blur-xl lg:top-20">
          <Container className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-sm font-semibold text-ink">
              Prices for your vehicle
              <span className="ml-2 hidden font-sans font-normal text-ink-subtle md:inline">
                Updates every price on this page
              </span>
            </p>
            <PricingSizeToggle />
          </Container>
        </div>

        <Section size="sm" aria-labelledby="packages">
          <Container>
            <SectionHeading
              eyebrow="Services"
              title={<span id="packages">Six services. One clear price each.</span>}
              description="Starting prices for your vehicle size. Book online and your price is locked at the time you book."
            />
            <div className="mt-12">
              <PricingPlans services={services} />
            </div>
          </Container>
        </Section>

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

        <Section aria-labelledby="add-ons">
          <Container className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
            <SectionHeading
              eyebrow="Add-ons"
              title={<span id="add-ons">Add exactly what you need</span>}
              description="Flat prices on any service and any vehicle size. Pick them at booking or ask on the day."
              className="lg:sticky lg:top-40 lg:self-start"
            />
            <AddOnList addOns={addOns} />
          </Container>
        </Section>

        {plan && (
          <Section size="sm" aria-labelledby="maintenance-plan" className="pt-0 sm:pt-0">
            <Container>
              <MaintenanceCallout plan={plan} />
            </Container>
          </Section>
        )}
      </SizeScope>

      <Section size="sm" className="pt-0 sm:pt-0">
        <Container>
          <PriceFactors />
        </Container>
      </Section>

      <CtaBanner
        title="Your price, locked in when you book."
        description="Pick a service and a time in about a minute. We confirm by text within the hour."
      />
    </>
  );
}
