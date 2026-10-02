import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Card, Container, Section } from "@/components/ui";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo, ContactQuickCards } from "@/components/contact/contact-details";
import { MapCard } from "@/components/contact/map-card";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";
import { bookingHref, siteConfig } from "@/config/site";

const title = "Contact";
const description = `Call, text or message ${siteConfig.name} in ${siteConfig.address.city}, ${siteConfig.address.state}. Quotes, fleet accounts and questions answered by a detailer, typically within 1 business hour.`;

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/contact",
});

const contactJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.name}`,
    url: absoluteUrl("/contact"),
    description,
    mainEntity: {
      "@type": "AutoWash",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        postalCode: siteConfig.address.zip,
        addressCountry: siteConfig.address.country,
      },
      areaServed: siteConfig.serviceArea.map((name) => ({ "@type": "City", name })),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        areaServed: "US",
        availableLanguage: ["English"],
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Contact", item: absoluteUrl("/contact") },
    ],
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />

      <PageHero
        eyebrow="Contact"
        title="Talk to a detailer"
        description="Real people, not a call center. Ask about a quote, a fleet account or that one scratch that bugs you. Typical reply within 1 business hour."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <Section size="sm" className="pt-10 sm:pt-14">
        <Container className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <ContactQuickCards />
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <Card className="p-6 hover:border-border sm:p-8 lg:sticky lg:top-28 lg:p-10">
              <h2 className="text-2xl font-semibold sm:text-3xl">Send us a message</h2>
              <p className="mt-2 mb-8 text-pretty text-ink-muted">
                Ready to book instead?{" "}
                <Link
                  href={bookingHref}
                  className="font-medium text-brand-300 underline-offset-4 hover:underline"
                >
                  Pick a time online
                </Link>
                . For everything else, this goes straight to our team.
              </p>
              <ContactForm />
            </Card>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <ContactInfo />
          </div>
        </Container>
      </Section>

      <Section size="sm" className="pt-0 sm:pt-0">
        <Container>
          <MapCard />
        </Container>
      </Section>

      <CtaBanner
        title="Rather skip the back and forth?"
        description="Choose your service, vehicle size and time online. It takes about 60 seconds."
      />
    </>
  );
}
