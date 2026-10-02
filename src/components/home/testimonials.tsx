import { ArrowUpRight } from "lucide-react";
import { ButtonLink, Container, Eyebrow, Section } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { testimonials } from "@/data/testimonials";
import { Reveal } from "./reveal";
import { TestimonialCarousel } from "./testimonial-carousel";

/**
 * Real customer reviews from `@/data/testimonials`. While that list is empty (a new
 * business), this renders a small invitation to leave one of the first reviews instead.
 */
export function Testimonials() {
  if (testimonials.length === 0) return <FirstReviewsCta />;

  return (
    <Section size="lg" aria-labelledby="reviews-title" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-brand-500/40 to-transparent"
      />
      <Container className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Reviews</Eyebrow>
          <h2
            id="reviews-title"
            className="mt-4 text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl"
          >
            In our customers&apos; <span className="text-gradient-brand">own words.</span>
          </h2>
          <GoogleLink className="mt-6">Read them on Google</GoogleLink>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-8 lg:pt-4">
          <TestimonialCarousel testimonials={testimonials} />
        </Reveal>
      </Container>
    </Section>
  );
}

function FirstReviewsCta() {
  return (
    <Section size="sm" aria-labelledby="first-reviews-title">
      <Container>
        <Reveal className="relative overflow-hidden rounded-xl border border-border bg-surface px-6 py-10 sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 size-72 rounded-full bg-brand-600/15 blur-[100px]"
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Reviews</Eyebrow>
              <h2
                id="first-reviews-title"
                className="mt-4 text-2xl font-semibold text-balance sm:text-3xl"
              >
                Had your car detailed by {siteConfig.founder.name}?{" "}
                <span className="text-gradient-brand">Leave one of our first reviews.</span>
              </h2>
              <p className="mt-3 text-sm text-pretty text-ink-muted sm:text-base">
                {siteConfig.name} is a young business, and every honest review helps the next
                customer decide. It takes a minute and means a lot.
              </p>
            </div>
            <ButtonLink
              href={siteConfig.social.google}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="group shrink-0 self-start md:self-auto"
            >
              Write a Google review
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function GoogleLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href={siteConfig.social.google}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand-300 transition-colors hover:text-ink ${className ?? ""}`}
    >
      {children}
      <ArrowUpRight
        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
