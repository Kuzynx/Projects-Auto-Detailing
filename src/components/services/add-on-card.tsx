import { Clock, Plus } from "lucide-react";
import type { AddOn } from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";

/** Compact add-on tile: name, one-line description, price and time. */
export function AddOnCard({ addOn, className }: { addOn: AddOn; className?: string }) {
  return (
    <div
      className={cn(
        "group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border border-border-strong text-brand-400 transition-colors group-hover:border-brand-500/50"
        >
          <Plus className="size-4" />
        </span>
        <p className="font-display text-lg font-semibold text-ink">
          <span className="sr-only">Price: </span>+{formatPrice(addOn.price)}
        </p>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-ink">{addOn.name}</h3>
      <p className="mt-1 flex-1 text-sm text-ink-muted">{addOn.description}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-subtle">
        <Clock aria-hidden className="size-3.5" />
        <span className="sr-only">Adds </span>
        {addOn.duration.replace(/^\+/, "")}
      </p>
    </div>
  );
}
