import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

/** Previous / next service navigation. */
export function ServicePager({ prev, next }: { prev?: Service; next?: Service }) {
  return (
    <nav aria-label="More services" className="grid gap-4 sm:grid-cols-2">
      {prev ? <PagerLink service={prev} direction="prev" /> : <span aria-hidden />}
      {next && <PagerLink service={next} direction="next" />}
    </nav>
  );
}

function PagerLink({ service, direction }: { service: Service; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/services/${service.slug}`}
      rel={direction}
      className={cn(
        "group relative flex min-h-32 items-end overflow-hidden rounded-lg border border-border p-6 transition-colors hover:border-brand-500/50",
        isNext && "sm:justify-end sm:text-right",
      )}
    >
      <Image
        src={service.image}
        alt=""
        fill
        sizes="(min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40 motion-reduce:transition-none"
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 from-bg via-bg/80 to-bg/30",
          isNext ? "bg-gradient-to-l" : "bg-gradient-to-r",
        )}
      />
      <span className="relative">
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase",
            isNext && "flex-row-reverse",
          )}
        >
          {isNext ? (
            <ArrowRight aria-hidden className="size-4" />
          ) : (
            <ArrowLeft aria-hidden className="size-4" />
          )}
          {isNext ? "Next service" : "Previous service"}
        </span>
        <span className="mt-2 block font-display text-xl font-semibold text-ink sm:text-2xl">
          {service.name}
        </span>
      </span>
    </Link>
  );
}
