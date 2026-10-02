import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { bookingUrl, formatServicePrice, type Service } from "@/data/services";
import { SizeValue } from "./size-value";

interface ServiceCalloutProps {
  service: Service;
  titleId: string;
  title: React.ReactNode;
  ctaLabel: string;
}

/** Full-width promo for one service. Price follows the page-level size toggle. */
export function ServiceCallout({ service, titleId, title, ctaLabel }: ServiceCalloutProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-xl border border-border-strong bg-surface shadow-card">
      <Image
        src={service.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 1200px, 100vw"
        className="-z-20 object-cover opacity-40 lg:object-[70%_center]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/90 to-bg/40"
      />
      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-14">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
            <Truck aria-hidden className="size-4" />
            {service.name}
          </p>
          <h2 id={titleId} className="mt-4 text-3xl font-semibold text-balance sm:text-4xl">
            {title}{" "}
            <span className="text-gradient-brand">
              <SizeValue render={(size) => formatServicePrice(service, size)} />
            </span>
            .
          </h2>
          <p className="mt-4 text-pretty text-ink-muted">{service.description}</p>
          <ul className="mt-6 grid gap-2.5 text-sm text-ink sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <SizeValue
            display="block"
            render={(size) => (
              <ButtonLink
                href={bookingUrl({ service: service.slug, size })}
                size="lg"
                className="w-full"
              >
                {ctaLabel}
              </ButtonLink>
            )}
          />
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-300"
          >
            Full details
            <span className="sr-only"> for {service.name}</span>
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
