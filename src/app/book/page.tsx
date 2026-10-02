import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { BookingEntry } from "@/components/booking/booking-entry";
import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/ui";
import { siteConfig } from "@/config/site";

const description = `Book mobile or studio auto detailing with ${siteConfig.name} in ${siteConfig.address.city}, ${siteConfig.address.state}. Pick a service, see your price and choose a time in about 60 seconds.`;

export const metadata: Metadata = buildMetadata({
  title: "Book Your Detail",
  description,
  path: "/book",
});

/**
 * Accepts pre-selection links from the rest of the site:
 *   /book?service=<slug>&size=<sedan|suv|truck>&addons=<slug,slug>
 * The query string is read on the client (see BookingEntry) so this page stays
 * fully static and works on static hosts.
 */
export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Online booking"
        title="Book your detail"
        description="Takes about 60 seconds. We confirm by text within the hour."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Book" }]}
      />
      <Section size="sm">
        <Container>
          <BookingEntry />
        </Container>
      </Section>
    </>
  );
}
