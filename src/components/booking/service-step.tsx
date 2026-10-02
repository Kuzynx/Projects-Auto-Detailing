"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import { services } from "@/data/services";
import { getSizeLabel } from "@/lib/booking/format";
import { requiresGarage } from "@/lib/booking/schema";
import { formatPrice } from "@/lib/utils";
import { errorId, FieldError, fieldId } from "./fields";
import { OptionCard } from "./option-card";
import type { StepProps } from "./step-types";

export function ServiceStep({ draft, errors, update }: StepProps) {
  const error = errors.service;
  return (
    <div>
      <p id="bk-service-hint" className="mb-4 text-sm text-ink-muted">
        Prices shown for a <span className="text-ink">{getSizeLabel(draft.size)}</span>. You can
        change your vehicle size on the next step.
      </p>
      <div
        role="radiogroup"
        aria-label="Service"
        aria-describedby={["bk-service-hint", error && errorId("service")]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={error ? true : undefined}
        className="grid gap-3 sm:grid-cols-2"
      >
        {services.map((service, i) => (
          <OptionCard
            key={service.slug}
            type="radio"
            name="service"
            value={service.slug}
            id={
              (draft.service ? draft.service === service.slug : i === 0)
                ? fieldId("service")
                : undefined
            }
            checked={draft.service === service.slug}
            onChange={() => update({ service: service.slug })}
            invalid={Boolean(error)}
          >
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-display text-base font-semibold text-ink">{service.name}</span>
              {service.badge && <Badge>{service.badge}</Badge>}
            </span>
            <span className="mt-1.5 block text-sm text-pretty text-ink-muted">
              {service.tagline}
            </span>
            <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="text-ink">
                <span className="text-ink-subtle">From </span>
                <span className="font-display font-semibold">
                  {formatPrice(service.price[draft.size])}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-ink-subtle">
                <Clock aria-hidden className="size-3.5" />
                {service.duration[draft.size]}
              </span>
              {requiresGarage(service.slug) && (
                <span className="text-ink-subtle">Needs a garage or covered space</span>
              )}
            </span>
          </OptionCard>
        ))}
      </div>
      <FieldError name="service" message={error} />
    </div>
  );
}
