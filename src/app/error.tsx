"use client";

import { useEffect } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button, ButtonLink, Container, Eyebrow } from "@/components/ui";

export default function RouteError({
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
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 h-[30rem] w-[52rem] -translate-x-1/2 bg-radial from-brand-500/15 to-transparent to-70%"
      />

      <Container className="flex flex-col items-center text-center">
        <Eyebrow>Unexpected error</Eyebrow>
        <h1 className="mt-5 max-w-2xl text-3xl font-semibold text-balance sm:text-5xl">
          Something went wrong on our end.
        </h1>
        <p className="mt-5 max-w-xl text-base text-pretty text-ink-muted sm:text-lg">
          This page hit a snag while loading. Try again in a moment. If it keeps happening, call us
          and we will get you booked in by phone.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" onClick={() => retry()}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <ButtonLink href="/" variant="outline" size="lg">
            Back to home
          </ButtonLink>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex h-13 items-center justify-center gap-2 px-4 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            <Phone className="size-4" aria-hidden="true" />
            {siteConfig.phone}
          </a>
        </div>

        {error.digest && (
          <p className="mt-10 font-mono text-xs text-ink-subtle">
            Reference: <span className="select-all">{error.digest}</span>
          </p>
        )}
      </Container>
    </section>
  );
}
