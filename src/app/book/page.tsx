import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { BookingEntry } from "@/components/booking/booking-entry";
import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { bookingContactName } from "@/lib/booking/format";

const description = `Book mobile auto detailing with ${siteConfig.name} in ${siteConfig.address.city} and the ${siteConfig.region}. Pick a service, see your price and choose a time in about 60 seconds. We come to you.`;

export const metadata: Metadata = buildMetadata({
  title: "Book Your Detail",
  description,
  path: "/book",
});

/**
 * Accepts pre-selection links from the rest of the site:
 *   /book?service=<slug>&size=<car|suv|truck|sports|exotic|motorcycle>&addons=<slug,slug>
 * The query string is read on the client (see BookingEntry) so this page stays
 * fully static and works on static hosts.
 */
export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Online booking"
        title="Book your detail"
        description={`Takes about 60 seconds. ${bookingContactName} confirms by text within the hour.`}
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
