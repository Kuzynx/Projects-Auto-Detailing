import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge, ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { galleryItems } from "@/data/gallery";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

interface TeaserItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  service: string;
  /** Photographed on a real client job (vs. library imagery). */
  ourWork?: boolean;
}

/** Photos from a real client job lead the grid. */
const ourWork: TeaserItem[] = [
  {
    id: "work-gt350-finish",
    src: "/images/work/shelby-gt350-finish.jpg",
    alt: "Ruby Red Shelby GT350 after a mobile wash, glossy paint reflecting the street in a residential driveway",
    title: "Shelby GT350, finished",
    service: "Signature Wash & Protect",
    ourWork: true,
  },
  {
    id: "work-gt350-two-bucket",
    src: "/images/work/shelby-gt350-two-bucket.jpg",
    alt: "Two wash buckets and a spray bottle beside the rear quarter of a red Shelby GT350 during a hand wash",
    title: "Two-bucket method",
    service: "Signature Wash & Protect",
    ourWork: true,
  },
];

/** Library picks for the remaining slots: three landscape frames and one portrait. */
const libraryIds = ["g06", "g12", "g17", "g08"];

/**
 * Desktop layout: three columns on a five-row track, so every column totals the same height.
 *   col 1: tall (rows 1-3) + short (rows 4-5)
 *   col 2: tall (rows 1-3) + short (rows 4-5)
 *   col 3: short (rows 1-2) + tall (rows 3-5)
 */
const slots = [
  "lg:col-start-1 lg:row-start-1 lg:row-span-3",
  "lg:col-start-2 lg:row-start-1 lg:row-span-3",
  "lg:col-start-3 lg:row-start-1 lg:row-span-2",
  "lg:col-start-1 lg:row-start-4 lg:row-span-2",
  "lg:col-start-2 lg:row-start-4 lg:row-span-2",
  "lg:col-start-3 lg:row-start-3 lg:row-span-3",
];

function teaserItems(): TeaserItem[] {
  const library = libraryIds
    .map((id) => galleryItems.find((item) => item.id === id))
    .filter((item) => item !== undefined)
    .map(({ id, src, alt, title, service }) => ({ id, src, alt, title, service }));
  return [...ourWork, ...library].slice(0, slots.length);
}

export function GalleryTeaser() {
  const items = teaserItems();

  return (
    <Section aria-labelledby="gallery-title">
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            title={
              <span id="gallery-title">
                Finishes worth <span className="text-gradient-brand">a second look.</span>
              </span>
            }
            description="Daily drivers, weekend cars and everything between. Starting with a recent driveway job."
          />
          <ButtonLink
            href="/gallery"
            variant="outline"
            className="group shrink-0 self-start md:self-auto"
          >
            View the full gallery
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </ButtonLink>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.07}
          className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-3 lg:grid-rows-[repeat(5,6.5rem)] xl:grid-rows-[repeat(5,7.5rem)]"
        >
          {items.map((item, i) => (
            <RevealItem
              as="li"
              key={item.id}
              className={cn("aspect-[4/5] lg:aspect-auto", slots[i])}
            >
              <figure className="group relative h-full overflow-hidden rounded-lg border border-border bg-surface">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-bg/90 via-bg/10 to-transparent transition-opacity duration-500 [@media(hover:hover)]:opacity-70 [@media(hover:hover)]:group-hover:opacity-100"
                />
                {item.ourWork && (
                  <Badge className="absolute top-3 left-3 bg-bg/70 backdrop-blur-md sm:top-4 sm:left-4">
                    Our work
                  </Badge>
                )}
                <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                  <p className="font-display text-sm font-semibold text-ink sm:text-base">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted transition-all duration-500 sm:text-sm [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                    {item.service}
                  </p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
