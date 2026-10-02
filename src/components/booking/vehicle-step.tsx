"use client";

import { getAddOn, vehicleSizes } from "@/data/services";
import { interiorConditions, paintConditions } from "@/lib/booking/schema";
import { cn } from "@/lib/utils";
import { CheckboxField, errorId, FieldError, fieldId, SelectField, TextField } from "./fields";
import type { StepProps } from "./step-types";

const withHints = (list: readonly { value: string; label: string; hint: string }[]) =>
  list.map((item) => ({ value: item.value, label: `${item.label}: ${item.hint}` }));

export function VehicleStep({ draft, errors, update }: StepProps) {
  const sizeError = errors.size;
  const petHairAddOn = getAddOn("pet-hair-removal");
  const odorAddOn = getAddOn("odor-elimination");

  return (
    <div className="space-y-8">
      <fieldset aria-describedby={sizeError ? errorId("size") : undefined}>
        <legend className="mb-3 text-sm font-medium text-ink">Vehicle size</legend>
        <div className="grid gap-2 rounded-lg border border-border bg-bg-elevated p-1.5 sm:grid-cols-3">
          {vehicleSizes.map((size, i) => {
            const checked = draft.size === size.id;
            return (
              <label
                key={size.id}
                className={cn(
                  "relative cursor-pointer rounded-md px-4 py-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand-400",
                  checked
                    ? "bg-surface-hover shadow-card ring-1 ring-brand-500/60"
                    : "hover:bg-white/[0.03]",
                )}
              >
                <input
                  type="radio"
                  name="size"
                  value={size.id}
                  id={(draft.size ? checked : i === 0) ? fieldId("size") : undefined}
                  checked={checked}
                  onChange={() => update({ size: size.id })}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "block font-display text-sm font-semibold",
                    checked ? "text-brand-300" : "text-ink",
                  )}
                >
                  {size.label}
                </span>
                <span className="mt-0.5 block text-xs text-ink-subtle">{size.examples}</span>
              </label>
            );
          })}
        </div>
        <FieldError name="size" message={sizeError} />
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">About the car</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="make"
            label="Make"
            value={draft.make}
            onValueChange={(make) => update({ make })}
            error={errors.make}
            placeholder="Porsche"
            autoComplete="off"
            maxLength={40}
          />
          <TextField
            name="model"
            label="Model"
            value={draft.model}
            onValueChange={(model) => update({ model })}
            error={errors.model}
            placeholder="911 Carrera"
            autoComplete="off"
            maxLength={60}
          />
          <TextField
            name="year"
            label="Year"
            optional
            value={draft.year}
            onValueChange={(year) => update({ year: year.replace(/\D/g, "").slice(0, 4) })}
            error={errors.year}
            placeholder="2022"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
          />
          <TextField
            name="color"
            label="Color"
            optional
            value={draft.color}
            onValueChange={(color) => update({ color })}
            error={errors.color}
            placeholder="Chalk grey"
            autoComplete="off"
            maxLength={30}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 text-sm font-medium text-ink">Current condition</legend>
        <p className="mb-4 text-sm text-ink-muted">
          An honest read helps us bring the right products and give you an accurate time.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            name="paintCondition"
            label="Paint"
            value={draft.paintCondition}
            onValueChange={(value) =>
              update({ paintCondition: value as typeof draft.paintCondition })
            }
            options={withHints(paintConditions)}
            placeholder="Choose the closest match"
            error={errors.paintCondition}
          />
          <SelectField
            name="interiorCondition"
            label="Interior"
            value={draft.interiorCondition}
            onValueChange={(value) =>
              update({ interiorCondition: value as typeof draft.interiorCondition })
            }
            options={withHints(interiorConditions)}
            placeholder="Choose the closest match"
            error={errors.interiorCondition}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <CheckboxField
            name="petHair"
            checked={draft.petHair}
            onCheckedChange={(petHair) => update({ petHair })}
            label="There's pet hair in the cabin"
            description={
              petHairAddOn ? `We'll suggest ${petHairAddOn.name} on the next step.` : undefined
            }
          />
          <CheckboxField
            name="smoke"
            checked={draft.smoke}
            onCheckedChange={(smoke) => update({ smoke })}
            label="It's been smoked in"
            description={
              odorAddOn ? `We'll suggest ${odorAddOn.name} on the next step.` : undefined
            }
          />
        </div>
      </fieldset>
    </div>
  );
}
