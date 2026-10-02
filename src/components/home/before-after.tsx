import Image from "next/image";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { bookingHref } from "@/config/site";
import { getService } from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";
import { Reveal } from "./reveal";
import { WipeIn } from "./wipe-in";
import { startingPrice, typicalDuration } from "./pricing";

const JOB = {
  serviceSlug: "premium-detail",
  caption: "Shelby GT350, mobile Premium Exterior Detail, customer's driveway",
  midWash: {
    src: "/images/work/shelby-gt350-rinse-wide.jpg",
    alt: "Ruby Red Shelby GT350 beaded with water after the rinse stage, parked in a residential driveway",
  },
  finished: {
    src: "/images/work/shelby-gt350-finish-wide.jpg",
    alt: "The same Shelby GT350 after the wash, deep red paint with mirror reflections along the rear quarter",
  },
};

function StageLabel({ children, tone }: { children: React.ReactNode; tone: "neutral" | "brand" }) {
  return (
    <span
      className={cn(
        "absolute top-3 left-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[11px] font-semibold tracking-[0.18em] uppercase backdrop-blur-md sm:top-4 sm:left-4",
        tone === "brand"
          ? "border-brand-400/50 bg-bg/70 text-brand-300"
          : "border-white/15 bg-bg/60 text-ink",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", tone === "brand" ? "bg-brand-400" : "bg-ink-muted")}
      />
      {children}
    </span>
  );
}

export function BeforeAfter() {
  const service = getService(JOB.serviceSlug);

  return (
    <Section tone="elevated" aria-labelledby="real-job-title" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-40 size-[40rem] rounded-full bg-brand-700/15 blur-[160px]"
      />
      <Container className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="From a recent job"
            title={
              <span id="real-job-title">
                Real driveway. <span className="text-gradient-brand">Real results.</span>
              </span>
            }
            description="No staged lighting, no filters. This is a customer's Shelby GT350, photographed mid-wash and again at handover, right where it lives."
          />

          {service && (
            <div className="mt-8 rounded-lg border border-border bg-surface/70 p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-lg font-semibold text-ink">{service.name}</p>
                <p className="text-sm text-ink-muted">
                  from{" "}
                  <span className="font-display text-base font-semibold text-ink">
                    {formatPrice(startingPrice(service))}
                  </span>
                  {typicalDuration(service) && (
                    <span className="text-ink-subtle"> · {typicalDuration(service)}</span>
                  )}
                </p>
              </div>
              <ul className="mt-4 space-y-2.5">
                {service.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={`${bookingHref}?service=${service.slug}`}
                className="group mt-6 w-full sm:w-auto"
              >
                Book this detail
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </ButtonLink>
            </div>
          )}
        </Reveal>

        <figure className="lg:col-span-7">
          <div className="relative">
            {/* Mid-wash: smaller, top-left, layered over the finished shot from sm up. */}
            <WipeIn className="relative z-10 sm:absolute sm:top-0 sm:left-0 sm:w-[52%]">
              <div className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:ring-4 sm:ring-bg-elevated">
                <Image
                  src={JOB.midWash.src}
                  alt={JOB.midWash.alt}
                  fill
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) 52vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <StageLabel tone="neutral">Mid-wash</StageLabel>
              </div>
            </WipeIn>

            {/* Finished: the hero of the pair. */}
            <WipeIn delay={0.35} className="mt-4 sm:mt-[16%] sm:ml-auto sm:w-[80%]">
              <div className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-brand-500/30 shadow-glow">
                <Image
                  src={JOB.finished.src}
                  alt={JOB.finished.alt}
                  fill
                  sizes="(min-width: 1280px) 620px, (min-width: 1024px) 46vw, (min-width: 640px) 80vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <StageLabel tone="brand">Finished</StageLabel>
              </div>
            </WipeIn>

            <span
              aria-hidden="true"
              className="absolute top-1/2 left-[52%] z-20 hidden size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-400/60 bg-bg/80 text-brand-300 backdrop-blur-md sm:grid"
            >
              <ArrowRight className="size-5 rotate-45" />
            </span>
          </div>

          <figcaption className="mt-5 flex items-center gap-2 text-sm text-ink-muted sm:justify-end">
            <MapPin className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
            {JOB.caption}
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
