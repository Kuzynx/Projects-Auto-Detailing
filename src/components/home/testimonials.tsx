import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { testimonials } from "@/data/testimonials";
import { RatingStars } from "./rating-stars";
import { Reveal } from "./reveal";
import { TestimonialCarousel } from "./testimonial-carousel";

const { googleRating, reviewCount } = siteConfig.stats;

export function Testimonials() {
  return (
    <Section size="lg" aria-labelledby="reviews-title" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-brand-500/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-40 size-[36rem] rounded-full bg-brand-700/10 blur-[150px]"
      />
      <Container className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Reviews</Eyebrow>
          <h2
            id="reviews-title"
            className="mt-4 text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl"
          >
            Owners say it <span className="text-gradient-brand">better than we can.</span>
          </h2>
          <div className="mt-8 rounded-lg border border-border bg-surface/60 p-6">
            <div className="flex items-end gap-3">
              <span className="font-display text-5xl font-semibold tracking-tight text-ink">
                {googleRating.toFixed(1)}
              </span>
              <span className="pb-1.5 text-sm text-ink-muted">out of 5</span>
            </div>
            <RatingStars rating={googleRating} className="mt-3" starClassName="size-5" />
            <p className="mt-3 text-sm text-ink-muted">
              Average from <span className="font-semibold text-ink">{reviewCount}</span> Google
              reviews
            </p>
            <a
              href={siteConfig.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand-300 transition-colors hover:text-ink"
            >
              Read them on Google
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-8 lg:pt-4">
          <TestimonialCarousel testimonials={testimonials} />
        </Reveal>
      </Container>
    </Section>
  );
}
