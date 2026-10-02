import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Container, Section, SectionHeading } from "@/components/ui";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { GalleryStatic } from "@/components/gallery/gallery-static";
import { orderGalleryItems } from "@/components/gallery/gallery-tile";
import { CompareSlider } from "@/components/gallery/compare-slider";
import { InstagramStrip } from "@/components/gallery/instagram-strip";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { clientGalleryItems, compareShowcase } from "@/data/gallery";

const title = "Gallery";
const description = `Real mobile detailing jobs by ${siteConfig.name} in ${siteConfig.address.city}, ${siteConfig.address.state} and across the ${siteConfig.region}: washes, exterior details and inside-and-outside packages.`;

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/gallery",
  image: "/images/work/shelby-gt350-finish-wide.jpg",
  imageAlt: "Ruby Red Shelby GT350 with a glossy finish after a mobile wash",
});

/** Only real client photos are shown as our work. Stock imagery never appears here. */
const items = orderGalleryItems(clientGalleryItems);

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Gallery", item: absoluteUrl("/gallery") },
          ],
        }}
      />

      <PageHero
        eyebrow="Gallery"
        title="Our work"
        description={`Real ${siteConfig.name} jobs, photographed in customers' driveways. Tap any photo for the full-size view.`}
        image="/images/work/shelby-gt350-finish-wide.jpg"
        imageAlt="Ruby Red Shelby GT350 with a glossy finish after a mobile wash"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <Section aria-labelledby="gallery-heading">
        <Container>
          <h2 id="gallery-heading" className="sr-only">
            Project gallery
          </h2>
          <Suspense fallback={<GalleryStatic items={items} />}>
            <GalleryBrowser items={items} />
          </Suspense>
          <p className="mt-8 text-center text-sm text-pretty text-ink-muted">
            Every photo here is a real {siteConfig.name} job. More added as we go,{" "}
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-300 underline-offset-4 hover:underline"
            >
              follow us on Instagram
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </Container>
      </Section>

      <Section tone="elevated" aria-labelledby="compare-heading" className="border-t border-border">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading
              eyebrow="Before and after"
              title={<span id="compare-heading">Drag the line. See the difference.</span>}
              description="Two frames from the same mobile job, same car, same afternoon. Drag the handle or use the arrow keys to compare."
            />
            <div className="mx-auto w-full max-w-md md:mx-0 md:justify-self-end">
              {compareShowcase.map((entry) => (
                <CompareSlider key={entry.id} item={entry} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <InstagramStrip items={items} />

      <CtaBanner
        title="Want your car in the next batch?"
        description="Tell us what you drive and how dirty it is. We will recommend the right package and a time that works."
      />
    </>
  );
}
