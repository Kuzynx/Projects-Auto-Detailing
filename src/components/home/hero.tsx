import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { bookingHref, siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { heroUnderlapClass } from "@/components/layout/nav-utils";
import { cn, formatPrice } from "@/lib/utils";
import { RatingStars } from "./rating-stars";
import styles from "./home.module.css";

const { googleRating, reviewCount } = siteConfig.stats;

export function Hero() {
  const spotlight =
    services.find((s) => s.badge === "Most popular") ?? services.find((s) => s.featured);

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate flex min-h-[90svh] items-center overflow-hidden bg-bg",
        heroUnderlapClass,
      )}
    >
      {/* Background photo with a slow push-in. */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero-garage.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover object-[70%_50%] ${styles.kenburns}`}
        />
      </div>

      {/* Layered gradients so the copy always reads. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/80 to-bg/10 sm:via-bg/65 lg:to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/30 to-bg/40" />
        <div className="absolute -top-40 -left-40 size-[38rem] rounded-full bg-brand-600/20 blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-brand-500/40 to-transparent" />
      </div>

      <Container className="relative py-28 sm:py-32 lg:py-36">
        <div className="max-w-3xl">
          <div className="[animation-delay:100ms] motion-safe:animate-fade-up">
            <Eyebrow>The {siteConfig.region}&apos;s premium mobile detailing</Eyebrow>
          </div>

          <div className="[animation-delay:220ms] motion-safe:animate-fade-up">
            <h1
              id="hero-title"
              className="mt-6 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
            >
              <span className="bg-linear-to-b from-white via-ink to-ink-muted bg-clip-text text-transparent">
                Showroom finish.
              </span>{" "}
              <span className="text-gradient-brand">Delivered to your driveway.</span>
            </h1>
          </div>

          <div className="[animation-delay:340ms] motion-safe:animate-fade-up">
            <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
              {siteConfig.name} brings certified detailers, professional-grade products and a
              checklist for every panel to your home or office. Ceramic coatings and paint
              correction are done right in your garage.
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3 [animation-delay:460ms] motion-safe:animate-fade-up sm:flex-row sm:items-center">
            <ButtonLink href={bookingHref} size="lg" className="group">
              Book your detail
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="outline"
              size="lg"
              className="bg-bg/30 backdrop-blur-sm"
            >
              See services &amp; pricing
            </ButtonLink>
          </div>

          <div className="[animation-delay:580ms] motion-safe:animate-fade-up">
            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-2.5">
                <RatingStars rating={googleRating} />
                <span>
                  <span className="font-semibold text-ink">{googleRating.toFixed(1)}</span> from{" "}
                  {reviewCount} Google reviews
                </span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-400" aria-hidden="true" />
                Fully insured
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-brand-400" aria-hidden="true" />
                3-year coating warranty
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Most-booked package callout, desktop only. */}
      {spotlight && (
        <div className="absolute right-8 bottom-24 hidden xl:block 2xl:right-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <div className="[animation-delay:800ms] motion-safe:animate-fade-up">
            <Link
              href={`${bookingHref}?service=${spotlight.slug}`}
              className="group block w-72 rounded-lg border border-white/10 bg-bg/55 p-5 shadow-card backdrop-blur-xl transition-colors hover:border-brand-500/50"
            >
              <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-brand-300 uppercase">
                Most booked
              </p>
              <p className="mt-2 font-display text-lg font-semibold text-ink">{spotlight.name}</p>
              <p className="mt-1 text-sm text-ink-muted">{spotlight.tagline}</p>
              <p className="mt-4 flex items-center justify-between text-sm">
                <span className="text-ink-muted">
                  from{" "}
                  <span className="font-display text-base font-semibold text-ink">
                    {formatPrice(spotlight.price.sedan)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 font-display font-semibold text-brand-300">
                  Book
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </p>
            </Link>
          </div>
        </div>
      )}

      {/* Scroll cue. */}
      <a
        href="#home-stats"
        aria-label="Scroll to explore"
        className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-ink-subtle uppercase transition-colors hover:text-ink sm:flex"
      >
        <span className="flex h-9 w-5.5 justify-center rounded-full border border-white/25 pt-1.5 transition-colors group-hover:border-brand-400">
          <span className={`block h-1.5 w-1 rounded-full bg-brand-400 ${styles.scrollDot}`} />
        </span>
        Scroll
      </a>
    </section>
  );
}
