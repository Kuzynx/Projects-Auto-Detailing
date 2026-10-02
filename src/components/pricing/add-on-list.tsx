import { Clock } from "lucide-react";
import type { AddOn } from "@/data/services";
import { formatPrice } from "@/lib/utils";

/** Two-column price list of add-ons. */
export function AddOnList({ addOns }: { addOns: AddOn[] }) {
  return (
    <ul className="grid gap-x-10 rounded-lg border border-border bg-surface px-6 sm:px-8 md:grid-cols-2">
      {addOns.map((addOn) => (
        <li
          key={addOn.slug}
          className="flex items-start justify-between gap-6 border-b border-border py-5 last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
        >
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-ink">{addOn.name}</h3>
            <p className="mt-1 text-sm text-ink-muted">{addOn.description}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-subtle">
              <Clock aria-hidden className="size-3.5" />
              <span className="sr-only">Adds</span>
              {addOn.duration.replace(/^\+/, "")}
            </p>
          </div>
          <p className="shrink-0 font-display text-lg font-semibold text-ink tabular-nums">
            +{formatPrice(addOn.price)}
          </p>
        </li>
      ))}
    </ul>
  );
}
