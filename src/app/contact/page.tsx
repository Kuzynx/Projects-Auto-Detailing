import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Card, Container, Section } from "@/components/ui";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo, ContactQuickCards } from "@/components/contact/contact-details";
import { ServiceAreaCard } from "@/components/contact/service-area-card";
import { JsonLd, breadcrumbJsonLd, jsonLdIds } from "@/lib/seo/json-ld";
import { siteUrl } from "@/lib/seo/url";
import { buildMetadata } from "@/lib/seo/metadata";
import { bookingHref, siteConfig } from "@/config/site";

const title = "Contact";
const description = `Call, text or message ${siteConfig.name} in ${siteConfig.address.city}, ${siteConfig.address.state}. Quotes, work trucks, fleets and questions answered fast, usually the same day.`;

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
    url: siteUrl("/contact"),
    description,
    mainEntity: { "@id": jsonLdIds.business },
  },
  breadcrumbJsonLd([{ label: "Contact", href: "/contact" }]),
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />

      <PageHero
        eyebrow="Contact"
        title="Talk to a detailer"
        description="Real people, not a call center. Ask about a quote, a work truck or a fleet, or which package fits your car. We reply fast, usually the same day."
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
                . For everything else, this goes straight to{" "}
                {siteConfig.team[0]
                  ? `${siteConfig.team[0].name}, who handles booking and messages, and ${siteConfig.founder.name}`
                  : siteConfig.founder.name}
                .
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
          <ServiceAreaCard />
        </Container>
      </Section>

      <CtaBanner
        title="Rather skip the back and forth?"
        description="Choose your service, vehicle size and time online. It takes about 60 seconds."
      />
    </>
  );
}
