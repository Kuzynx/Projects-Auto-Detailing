import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { bookingUrl, type ComparisonFeature, type Service } from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";
import { SizeValue } from "./size-value";

interface ComparisonMatrixProps {
  services: Service[];
  features: ComparisonFeature[];
}

const stickyCell = "sticky left-0 z-10 bg-surface shadow-[1px_0_0_var(--color-border)]";

/** Feature-by-package table. First column stays pinned while the table scrolls sideways on small screens. */
export function ComparisonMatrix({ services, features }: ComparisonMatrixProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <div
        className="overflow-x-auto overscroll-x-contain"
        role="region"
        aria-labelledby="compare-caption"
        tabIndex={0}
      >
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <caption id="compare-caption" className="sr-only">
            What each service includes, compared side by side
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className={cn(
                  stickyCell,
                  "w-48 px-5 py-5 align-bottom font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase",
                )}
              >
                Feature
              </th>
              {services.map((service) => (
                <th
                  key={service.slug}
                  scope="col"
                  className={cn(
                    "px-4 py-5 align-bottom font-normal",
                    service.featured && "bg-brand-500/[0.06]",
                  )}
                >
                  {service.badge && service.featured && (
                    <span className="mb-2 block font-display text-[10px] font-semibold tracking-[0.18em] text-brand-300 uppercase">
                      {service.badge}
                    </span>
                  )}
                  <Link
                    href={`/services/${service.slug}`}
                    className="block font-display text-sm font-semibold text-ink hover:text-brand-300"
                  >
                    {service.name}
                  </Link>
                  <span className="mt-1 block font-display text-lg font-semibold text-ink tabular-nums">
                    <SizeValue render={(size) => formatPrice(service.price[size])} />
                    {service.priceSuffix && (
                      <span className="ml-1 font-sans text-xs font-normal text-ink-subtle">
                        /visit
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.label} className="group/row border-b border-border last:border-b-0">
                <th
                  scope="row"
                  className={cn(
                    stickyCell,
                    "px-5 py-3.5 font-medium text-ink-muted group-hover/row:text-ink",
                  )}
                >
                  {feature.label}
                </th>
                {services.map((service) => {
                  const value = feature.values[service.slug];
                  return (
                    <td
                      key={service.slug}
                      className={cn(
                        "px-4 py-3.5 text-ink-muted group-hover/row:bg-white/[0.02]",
                        service.featured && "bg-brand-500/[0.06]",
                      )}
                    >
                      {value === true ? (
                        <>
                          <Check aria-hidden className="size-5 text-brand-400" />
                          <span className="sr-only">Included</span>
                        </>
                      ) : typeof value === "string" ? (
                        <span className="text-ink">{value}</span>
                      ) : (
                        <>
                          <Minus aria-hidden className="size-4 text-ink-subtle/60" />
                          <span className="sr-only">Not included</span>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t border-border">
              <th scope="row" className={cn(stickyCell, "px-5 py-3.5 font-medium text-ink-muted")}>
                Time on the car
              </th>
              {services.map((service) => (
                <td
                  key={service.slug}
                  className={cn("px-4 py-3.5 text-ink", service.featured && "bg-brand-500/[0.06]")}
                >
                  <SizeValue render={(size) => service.duration[size]} />
                </td>
              ))}
            </tr>
            <tr>
              <td className={cn(stickyCell, "px-5 py-5")}>
                <span className="sr-only">Book</span>
              </td>
              {services.map((service) => (
                <td
                  key={service.slug}
                  className={cn("px-4 py-5", service.featured && "bg-brand-500/[0.06]")}
                >
                  <SizeValue
                    display="inline"
                    render={(size) => (
                      <Link
                        href={bookingUrl({ service: service.slug, size })}
                        className={cn(
                          "inline-flex h-9 items-center rounded-full px-4 font-display text-xs font-semibold transition-colors",
                          service.featured
                            ? "bg-brand-500 text-bg hover:bg-brand-400"
                            : "border border-border-strong text-ink hover:border-brand-500 hover:text-brand-300",
                        )}
                      >
                        Book<span className="sr-only"> {service.name}</span>
                      </Link>
                    )}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="border-t border-border px-5 py-3 text-xs text-ink-subtle md:hidden">
        Swipe the table sideways to compare all packages.
      </p>
    </div>
  );
}
