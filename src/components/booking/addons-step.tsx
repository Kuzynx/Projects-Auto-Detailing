"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import { addOns, getService } from "@/data/services";
import { getRecommendedAddOns } from "@/lib/booking/schema";
import { formatPrice } from "@/lib/utils";
import { errorId, FieldError, fieldId } from "./fields";
import { OptionCard } from "./option-card";
import type { StepProps } from "./step-types";

export function AddOnsStep({ draft, errors, update }: StepProps) {
  const service = getService(draft.service);
  // Suggested from the vehicle answers (pet hair, smoke), then the service's usual pairings.
  const recommended = new Set(getRecommendedAddOns(draft));
  const pairsWell = new Set(
    (service?.recommendedAddOns ?? []).filter((slug) => !recommended.has(slug)),
  );
  const rank = (slug: string) => (recommended.has(slug) ? 0 : pairsWell.has(slug) ? 1 : 2);
  const ordered = [...addOns].sort((a, b) => rank(a.slug) - rank(b.slug));
  const error = errors.addOns;

  function toggle(slug: string) {
    update({
      addOns: draft.addOns.includes(slug)
        ? draft.addOns.filter((s) => s !== slug)
        : [...draft.addOns, slug],
    });
  }

  return (
    <fieldset aria-describedby={error ? errorId("addOns") : undefined}>
      <legend className="sr-only">Add-ons</legend>
      <p className="mb-4 text-sm text-ink-muted">
        Optional. {service ? `Your ${service.name} is complete on its own; ` : ""}these are the
        upgrades customers add most.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ordered.map((addOn, i) => (
          <OptionCard
            key={addOn.slug}
            type="checkbox"
            name="addOns"
            value={addOn.slug}
            id={i === 0 ? fieldId("addOns") : undefined}
            checked={draft.addOns.includes(addOn.slug)}
            onChange={() => toggle(addOn.slug)}
            invalid={Boolean(error)}
            describedBy={error ? errorId("addOns") : undefined}
          >
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-display text-sm font-semibold text-ink sm:text-base">
                {addOn.name}
              </span>
              {recommended.has(addOn.slug) && <Badge>Recommended</Badge>}
              {pairsWell.has(addOn.slug) && <Badge tone="neutral">Pairs well</Badge>}
            </span>
            <span className="mt-1 block text-sm text-ink-muted">{addOn.description}</span>
            <span className="mt-3 flex items-center gap-4 text-sm">
              <span className="font-display font-semibold text-ink">
                +{formatPrice(addOn.price)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-ink-subtle">
                <Clock aria-hidden className="size-3.5" />
                {addOn.duration}
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
      <FieldError name="addOns" message={error} />
    </fieldset>
  );
}
