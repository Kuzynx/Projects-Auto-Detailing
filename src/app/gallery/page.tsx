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
import { compareShowcase, galleryItems } from "@/data/gallery";

const title = "Gallery";
const description = `Ceramic coatings, paint correction and full details from ${siteConfig.name} in ${siteConfig.address.city}, ${siteConfig.address.state}. Browse ${galleryItems.length} recent projects, from daily drivers to supercars.`;

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/gallery",
  image: "/images/work/shelby-gt350-finish-wide.jpg",
  imageAlt: "Ruby Red Shelby GT350 with a glossy finish after a mobile wash",
});

const items = orderGalleryItems(galleryItems);

/** Instagram strip: alternate client work with studio favorites (first three show on mobile). */
const instagramIds = ["g00e", "g06", "g00b", "g04", "g00c", "g25"];
const instagramItems = instagramIds.flatMap((id) => items.filter((item) => item.id === id));

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
        description="Every car here was inspected, measured and finished by our own technicians. Filter by service, then tap any photo for the full-size view."
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
        </Container>
      </Section>

      <Section tone="elevated" aria-labelledby="compare-heading" className="border-t border-border">
        <Container>
          <SectionHeading
            eyebrow="Before and after"
            title={<span id="compare-heading">Drag the line. See the difference.</span>}
            description="The first comparison is two frames from one of our mobile jobs. The other two illustrate the typical change from correction and coating work."
          />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
            {compareShowcase.map((entry) => (
              <CompareSlider key={entry.id} item={entry} />
            ))}
          </div>
        </Container>
      </Section>

      <InstagramStrip items={instagramItems} />

      <CtaBanner
        title="Want your car in the next batch?"
        description="Tell us what you drive and what is bugging you about the finish. We will recommend the right service and a time that works."
      />
    </>
  );
}
