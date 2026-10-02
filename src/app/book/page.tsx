import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { BookingFlow } from "@/components/booking/booking-flow";
import { PageHero } from "@/components/layout/page-hero";
import { Container, Section } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { parseBookingSearchParams } from "@/lib/booking/search-params";
import { stepIndexOf } from "@/lib/booking/schema";

const description = `Book mobile or studio auto detailing with ${siteConfig.name} in ${siteConfig.address.city}, ${siteConfig.address.state}. Pick a service, see your price and choose a time in about 60 seconds.`;

export const metadata: Metadata = buildMetadata({
  title: "Book Your Detail",
  description,
  path: "/book",
});

/**
 * Accepts pre-selection links from the rest of the site:
 *   /book?service=<slug>&size=<sedan|suv|truck>&addons=<slug,slug>
 */
export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const { draft, hasService } = parseBookingSearchParams(await searchParams);
  // Remount the flow when the pre-selection changes via client navigation.
  const key = [draft.service, draft.size, draft.addOns.join(",")].join("|");

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
          <BookingFlow
            key={key}
            initialDraft={draft}
            initialStep={hasService ? stepIndexOf("vehicle") : 0}
          />
        </Container>
      </Section>
    </>
  );
}
