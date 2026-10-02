"use client";

import { vehicleSizes } from "@/data/services";
import { detailerName } from "@/lib/booking/format";
import { interiorConditions, isMotorcycle, paintConditions } from "@/lib/booking/schema";
import { errorId, CheckboxField, FieldError, fieldId, SelectField, TextField } from "./fields";
import { OptionCard } from "./option-card";
import type { StepProps } from "./step-types";

const withHints = (list: readonly { value: string; label: string; hint: string }[]) =>
  list.map((item) => ({ value: item.value, label: `${item.label}: ${item.hint}` }));

export function VehicleStep({ draft, errors, update }: StepProps) {
  const sizeError = errors.size;
  const motorcycle = isMotorcycle(draft.size);
  const noun = motorcycle ? "bike" : "car";

  return (
    <div className="space-y-8">
      <div>
        <p id="bk-size-label" className="mb-3 text-sm font-medium text-ink">
          Vehicle type
        </p>
        <div
          role="radiogroup"
          aria-labelledby="bk-size-label"
          aria-describedby={sizeError ? errorId("size") : undefined}
          aria-invalid={sizeError ? true : undefined}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {vehicleSizes.map((size, i) => {
            const checked = draft.size === size.id;
            return (
              <OptionCard
                key={size.id}
                type="radio"
                name="size"
                value={size.id}
                id={(draft.size ? checked : i === 0) ? fieldId("size") : undefined}
                checked={checked}
                onChange={() => update({ size: size.id })}
                invalid={Boolean(sizeError)}
                className="p-4 sm:p-4"
              >
                <span className="block font-display text-sm font-semibold text-ink">
                  {size.label}
                </span>
                <span className="mt-0.5 block text-xs text-ink-subtle">{size.examples}</span>
              </OptionCard>
            );
          })}
        </div>
        <FieldError name="size" message={sizeError} />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">About the {noun}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="make"
            label="Make"
            value={draft.make}
            onValueChange={(make) => update({ make })}
            error={errors.make}
            placeholder={motorcycle ? "Harley-Davidson" : "Toyota"}
            autoComplete="off"
            maxLength={40}
          />
          <TextField
            name="model"
            label="Model"
            value={draft.model}
            onValueChange={(model) => update({ model })}
            error={errors.model}
            placeholder={motorcycle ? "Street Glide" : "Camry"}
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
            placeholder={motorcycle ? "Vivid black" : "Silver"}
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
          {!motorcycle && (
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
          )}
        </div>
        {!motorcycle && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <CheckboxField
              name="petHair"
              checked={draft.petHair}
              onCheckedChange={(petHair) => update({ petHair })}
              label="There's pet hair in the cabin"
              description={`Helps ${detailerName} plan time and products.`}
            />
            <CheckboxField
              name="smoke"
              checked={draft.smoke}
              onCheckedChange={(smoke) => update({ smoke })}
              label="It's been smoked in"
              description={`Helps ${detailerName} plan time and products.`}
            />
          </div>
        )}
      </fieldset>
    </div>
  );
}
