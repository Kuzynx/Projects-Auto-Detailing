import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Repeat } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { bookingUrl, type Service } from "@/data/services";
import { formatPrice } from "@/lib/utils";
import { SizeValue } from "./size-value";

/** Recurring-plan promo. Price follows the page-level size toggle. */
export function MaintenanceCallout({ plan }: { plan: Service }) {
  return (
    <div className="relative isolate overflow-hidden rounded-xl border border-border-strong bg-surface shadow-card">
      <Image
        src={plan.image}
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
            <Repeat aria-hidden className="size-4" />
            {plan.name}
          </p>
          <h2
            id="maintenance-plan"
            className="mt-4 text-3xl font-semibold text-balance sm:text-4xl"
          >
            Keep it perfect for{" "}
            <span className="text-gradient-brand">
              <SizeValue render={(size) => formatPrice(plan.price[size])} />
            </span>{" "}
            a visit.
          </h2>
          <p className="mt-4 text-pretty text-ink-muted">{plan.description}</p>
          <ul className="mt-6 grid gap-2.5 text-sm text-ink sm:grid-cols-2">
            {plan.includes.slice(0, 6).map((item) => (
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
                href={bookingUrl({ service: plan.slug, size })}
                size="lg"
                className="w-full"
              >
                Start a plan
              </ButtonLink>
            )}
          />
          <Link
            href={`/services/${plan.slug}`}
            className="inline-flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-300"
          >
            How the plan works
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
