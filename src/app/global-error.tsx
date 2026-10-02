"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import "./globals.css";

/**
 * Last-resort boundary for errors thrown by the root layout itself. It replaces
 * the whole document, so it renders its own <html>/<body>, imports the global
 * tokens, and avoids the shared layout components (they may be what failed).
 * Fonts fall back to the system stack defined in globals.css.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center bg-bg px-4 text-ink">
        <title>{`Something went wrong | ${siteConfig.name}`}</title>
        <main className="relative isolate w-full max-w-xl py-24 text-center">
          <div
            aria-hidden="true"
            className="absolute -top-24 left-1/2 -z-10 h-80 w-[40rem] max-w-[100vw] -translate-x-1/2 bg-radial from-brand-500/20 to-transparent to-70%"
          />
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
            {siteConfig.name}
          </p>
          <h1 className="mt-5 text-3xl font-semibold text-balance sm:text-5xl">
            Something went wrong on our end.
          </h1>
          <p className="mt-5 text-base text-pretty text-ink-muted sm:text-lg">
            The site hit an unexpected error. Try again in a moment, or call us and we will book you
            in by phone.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-13 cursor-pointer items-center justify-center rounded-full bg-brand-500 px-8 font-display text-base font-semibold text-bg transition-colors hover:bg-brand-400"
            >
              Try again
            </button>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex h-13 items-center justify-center rounded-full border border-border-strong px-8 font-display text-base font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-300"
            >
              Call {siteConfig.phone}
            </a>
          </div>
          {error.digest && (
            <p className="mt-10 font-mono text-xs text-ink-subtle">
              Reference: <span className="select-all">{error.digest}</span>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
