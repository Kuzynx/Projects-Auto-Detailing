"use client";

import { useCallback, useEffect, useId, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";
import { RatingStars } from "./rating-stars";

const AUTOPLAY_MS = 7000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Hydration-safe: the server snapshot (false) is used while hydrating, then the real value. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

/**
 * Accessible carousel (WAI-ARIA APG pattern): labelled region with roledescription,
 * slides as groups, prev/next and dot controls, arrow-key support, and autoplay that
 * pauses on hover, on focus, when the visitor presses pause, or when they prefer reduced motion.
 */
export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const reduce = usePrefersReducedMotion();
  const id = useId();
  const count = testimonials.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  const playing = !stopped && !reduce && !hovered && !focused && count > 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [playing, count]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  }

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onKeyDown={onKeyDown}
      // Pointer (not mouse) events, ignoring touch: a tap fires mouseenter with no matching
      // mouseleave, which would pause autoplay for good on touch screens.
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setHovered(false);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      className="relative"
    >
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 right-0 size-28 text-brand-500/10 sm:size-40"
        strokeWidth={1}
      />

      {/* Slides share one grid cell so the region keeps the height of the tallest quote. */}
      <div id={`${id}-slides`} aria-live={playing ? "off" : "polite"} className="relative grid">
        {testimonials.map((t, i) => {
          const active = i === index;
          return (
            <figure
              key={t.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "col-start-1 row-start-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                active
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0",
              )}
            >
              <div className="flex items-center gap-3">
                <RatingStars rating={t.rating} starClassName="size-5" />
                <span className="sr-only">Rated {t.rating} out of 5</span>
                <span className="font-display text-xs font-semibold tracking-[0.18em] text-ink-subtle uppercase">
                  {t.source} review
                </span>
              </div>
              <blockquote className="mt-6">
                <p className="font-display text-2xl leading-snug font-medium tracking-tight text-balance text-ink sm:text-3xl lg:text-[2.5rem] lg:leading-[1.2]">
                  <span aria-hidden="true" className="text-brand-400">
                    &ldquo;
                  </span>
                  {t.quote}
                  <span aria-hidden="true" className="text-brand-400">
                    &rdquo;
                  </span>
                </p>
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-full border border-brand-500/40 bg-brand-500/10 font-display text-sm font-semibold text-brand-300"
                >
                  {t.name.charAt(0)}
                </span>
                <span className="flex flex-col">
                  <span className="font-display font-semibold text-ink">
                    {t.name} <span className="font-normal text-ink-subtle">· {t.location}</span>
                  </span>
                  <span className="text-sm text-ink-muted">
                    {t.vehicle} · {t.service}
                  </span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2" role="group" aria-label="Choose a review">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show review ${i + 1} of ${count}, from ${t.name}`}
              aria-current={i === index ? "true" : undefined}
              aria-controls={`${id}-slides`}
              className="group grid h-8 cursor-pointer place-items-center"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-all duration-500",
                  i === index ? "w-10 bg-brand-400" : "w-4 bg-white/20 group-hover:bg-white/40",
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!reduce && (
            <button
              type="button"
              onClick={() => setStopped((s) => !s)}
              aria-label={stopped ? "Start automatic slide show" : "Stop automatic slide show"}
              className="grid size-11 cursor-pointer place-items-center rounded-full text-ink-subtle transition-colors hover:text-ink"
            >
              {stopped ? (
                <Play className="size-4" aria-hidden="true" />
              ) : (
                <Pause className="size-4" aria-hidden="true" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous review"
            aria-controls={`${id}-slides`}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-border-strong text-ink transition-colors hover:border-brand-400 hover:text-brand-300"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next review"
            aria-controls={`${id}-slides`}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-border-strong text-ink transition-colors hover:border-brand-400 hover:text-brand-300"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
