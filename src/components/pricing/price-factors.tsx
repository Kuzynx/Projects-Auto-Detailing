import { Info } from "lucide-react";
import { priceFactors } from "@/data/services";

/** Honest note on what can change a quote. */
export function PriceFactors() {
  return (
    <aside
      aria-labelledby="price-factors"
      className="rounded-lg border border-border bg-bg-elevated p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-300"
        >
          <Info className="size-5" />
        </span>
        <div>
          <h2 id="price-factors" className="font-display text-xl font-semibold">
            What can change the price
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-pretty text-ink-muted sm:text-base">
            Published prices cover a vehicle in normal daily-driver condition. Anything extra is
            quoted on site.{" "}
            <span className="font-semibold text-ink">
              We always quote it before work starts, never after.
            </span>
          </p>
        </div>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {priceFactors.map((factor) => (
          <div key={factor.title} className="rounded-lg border border-border bg-surface p-4">
            <dt className="flex items-baseline justify-between gap-3 font-display text-sm font-semibold text-ink">
              {factor.title}
              {factor.amount && (
                <span className="shrink-0 text-brand-300 tabular-nums">{factor.amount}</span>
              )}
            </dt>
            <dd className="mt-1 text-sm text-ink-muted">{factor.description}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
