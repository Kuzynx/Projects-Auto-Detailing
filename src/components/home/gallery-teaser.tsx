import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { galleryItems } from "@/data/gallery";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

const MAX_TILES = 4;

/** Desktop column count matched to the number of photos, so no row ends with an empty cell. */
const DESKTOP_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/**
 * Only the business's own job photos (`source: "client"`). Stock imagery is never captioned
 * as a job here; it stays limited to atmospheric backgrounds elsewhere on the page.
 */
const clientWork = galleryItems.filter((item) => item.source === "client").slice(0, MAX_TILES);

export function GalleryTeaser() {
  if (clientWork.length === 0) return null;

  return (
    <Section aria-labelledby="gallery-title">
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our work"
            title={
              <span id="gallery-title">
                Finishes worth <span className="text-gradient-brand">a second look.</span>
              </span>
            }
            description="Real jobs, photographed on site. No staged lighting, no stock photos, just the vehicle where it lives."
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
          stagger={0.08}
          className={cn(
            "mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4",
            clientWork.length === 1 && "grid-cols-1",
            DESKTOP_COLUMNS[clientWork.length],
          )}
        >
          {clientWork.map((item) => (
            <RevealItem as="li" key={item.id} className="aspect-[3/4]">
              <figure className="group relative h-full overflow-hidden rounded-lg border border-border bg-surface">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-bg/90 via-bg/10 to-transparent transition-opacity duration-500 [@media(hover:hover)]:opacity-70 [@media(hover:hover)]:group-hover:opacity-100"
                />
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
