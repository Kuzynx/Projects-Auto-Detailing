"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolled = () => window.scrollY > 12;
const getServerScrolled = () => false;

/**
 * Background layer for the sticky header. Transparent (with a soft top scrim so
 * links stay legible over hero imagery) until the page scrolls, then a frosted
 * black bar with a chrome-to-purple hairline. Kept separate so the header itself
 * stays a Server Component and never gets a backdrop-filter containing block.
 */
export function HeaderBackdrop() {
  const scrolled = useSyncExternalStore(subscribe, getScrolled, getServerScrolled);

  return (
    <div
      aria-hidden="true"
      data-scrolled={scrolled || undefined}
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-b from-black/70 via-black/35 to-transparent transition-opacity duration-500",
          scrolled ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 bg-bg/75 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-px max-w-xl bg-linear-to-r from-transparent via-brand-500/60 to-transparent" />
      </div>
    </div>
  );
}
