import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, buttonClasses } from "@/components/ui";
import { InstagramIcon, socialHandle } from "@/components/contact/brand-icons";
import { siteConfig } from "@/config/site";
import type { GalleryItem } from "@/data/gallery";

/** Instagram call-to-action with a strip of recent frames. Links out; no embeds or tracking. */
export function InstagramStrip({ items }: { items: GalleryItem[] }) {
  const handle = socialHandle(siteConfig.social.instagram);
  const frames = items.slice(0, 6);

  return (
    <section
      aria-labelledby="instagram-heading"
      className="relative overflow-hidden border-y border-border bg-bg-elevated py-16 sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-40"
      />
      <Container className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow className="mb-4">Behind the polish</Eyebrow>
            <h2 id="instagram-heading" className="text-3xl font-semibold text-balance sm:text-4xl">
              Fresh work, every week, on Instagram.
            </h2>
            <p className="mt-3 text-ink-muted">
              Paint readings, 50/50 shots and the cars we meet in driveways across the{" "}
              {siteConfig.region}. Follow <span className="font-semibold text-ink">{handle}</span>{" "}
              to see it before it hits the gallery.
            </p>
          </div>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("outline", "lg", "self-start md:self-auto")}
          >
            <InstagramIcon className="size-5" />
            Follow {handle}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <ul className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {frames.map((item, i) => (
            <li key={item.id} className={i >= 3 ? "hidden lg:block" : undefined}>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-md border border-border bg-surface"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 200px, (min-width: 1024px) 16vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <ArrowUpRight className="size-6 text-ink" />
                </span>
                <span className="sr-only">View on Instagram (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
