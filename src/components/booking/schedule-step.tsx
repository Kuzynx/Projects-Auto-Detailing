"use client";

import { useMemo, useState } from "react";
import { Info, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getService } from "@/data/services";
import { detailerName, serviceAreaLabel } from "@/lib/booking/format";
import { OTHER_CITY, REQUIRES_CUSTOMER_UTILITIES, requiresGarage } from "@/lib/booking/schema";
import {
  formatClock,
  formatDateLong,
  formatHoursForDate,
  getBookingWindow,
  getClosedWeekdays,
  getDateUnavailableReason,
  getJobDuration,
  getTimeSlots,
  NEXT_DAY_CUTOFF_HOUR,
  type IsoDate,
} from "@/lib/booking/slots";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { CheckboxField, errorId, FieldError, fieldId, SelectField, TextField } from "./fields";
import type { StepProps } from "./step-types";

const cityOptions = [...siteConfig.serviceArea, OTHER_CITY].map((city) => ({
  value: city,
  label: city === OTHER_CITY ? "Other (we'll confirm coverage)" : city,
}));

export function ScheduleStep({ draft, errors, update }: StepProps) {
  // The clock is read once per visit to this step; the server re-checks on submit.
  const [now] = useState(() => new Date());
  const bookingWindow = useMemo(() => getBookingWindow(now), [now]);
  const service = getService(draft.service);

  const slots = useMemo(
    () =>
      draft.date
        ? getTimeSlots({
            date: draft.date,
            serviceSlug: draft.service,
            size: draft.size,
            addOnSlugs: draft.addOns,
          })
        : [],
    [draft.date, draft.service, draft.size, draft.addOns],
  );
  const job = getJobDuration({
    serviceSlug: draft.service,
    size: draft.size,
    addOnSlugs: draft.addOns,
  });
  const hoursForDate = draft.date ? formatHoursForDate(draft.date) : null;

  function getUnavailableReason(date: IsoDate) {
    const reason = getDateUnavailableReason(date, now);
    if (reason === "closed") return "Closed";
    if (reason) return "Unavailable";
    return null;
  }

  const needsGarage = requiresGarage(draft.service);
  const closedDays = getClosedWeekdays();

  return (
    <div className="space-y-10">
      <p className="flex items-start gap-3 rounded-lg border border-border bg-bg-elevated p-4 text-sm text-ink-muted">
        <Truck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-400" />
        <span>
          <span className="font-medium text-ink">We come to you.</span> Home, office or apartment
          lot anywhere in {serviceAreaLabel}. You provide a hose spigot and an outlet;{" "}
          {detailerName} brings the rest.
        </span>
      </p>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">Service address</legend>
        <div className="grid gap-4 sm:grid-cols-6">
          <TextField
            className="sm:col-span-6"
            name="street"
            label="Street address"
            value={draft.street}
            onValueChange={(street) => update({ street })}
            error={errors.street}
            autoComplete="street-address"
            placeholder="123 Main St"
            maxLength={120}
          />
          <SelectField
            className="sm:col-span-4"
            name="city"
            label="City"
            value={draft.city}
            onValueChange={(city) => update({ city })}
            options={cityOptions}
            placeholder="Choose your city"
            error={errors.city}
          />
          <TextField
            className="sm:col-span-2"
            name="zip"
            label="ZIP code"
            value={draft.zip}
            onValueChange={(zip) => update({ zip: zip.replace(/[^\d-]/g, "").slice(0, 10) })}
            error={errors.zip}
            autoComplete="postal-code"
            inputMode="numeric"
            placeholder={siteConfig.address.zip}
            maxLength={10}
          />
          {draft.city === OTHER_CITY && (
            <TextField
              className="sm:col-span-6"
              name="cityOther"
              label="Which city?"
              value={draft.cityOther}
              onValueChange={(cityOther) => update({ cityOther })}
              error={errors.cityOther}
              autoComplete="address-level2"
              hint="Just outside our usual area? We often still make it work and will confirm by text."
              maxLength={60}
            />
          )}
        </div>

        {REQUIRES_CUSTOMER_UTILITIES && (
          <CheckboxField
            className="mt-6"
            name="utilitiesConfirmed"
            checked={draft.utilitiesConfirmed}
            onCheckedChange={(utilitiesConfirmed) => update({ utilitiesConfirmed })}
            error={errors.utilitiesConfirmed}
            label="There's an outdoor water spigot and a power outlet within reach of where the car will be parked"
            description={`${detailerName} connects his hose and tools to them.`}
          />
        )}

        {needsGarage && service && (
          <div className="mt-6 space-y-3">
            <p className="flex items-start gap-2.5 rounded-md border border-brand-500/30 bg-brand-500/[0.06] p-3.5 text-sm text-ink-muted">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <span>
                <span className="font-medium text-ink">
                  {service.name} needs a garage or covered space.
                </span>{" "}
                We do the work at your address, out of direct sun and wind, so the finish cures
                clean and even.
              </span>
            </p>
            <CheckboxField
              name="garageConfirmed"
              checked={draft.garageConfirmed}
              onCheckedChange={(garageConfirmed) => update({ garageConfirmed })}
              error={errors.garageConfirmed}
              label="I have a garage or covered space where the work can be done"
              description={`No covered space? Call ${siteConfig.phone} and we'll talk through options.`}
            />
          </div>
        )}
      </fieldset>

      {/* Date and time */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <p id="bk-date-label" className="mb-1 text-sm font-medium text-ink">
            Date
          </p>
          <p id="bk-date-hint" className="mb-3 text-sm text-ink-subtle">
            Book by {formatClock(NEXT_DAY_CUTOFF_HOUR * 60)} for next-day appointments.
            {closedDays.length > 0 && ` Closed ${closedDays.join(" and ")}s.`}
          </p>
          <Calendar
            id={fieldId("date")}
            labelledBy="bk-date-label"
            describedBy={["bk-date-hint", errors.date && errorId("date")].filter(Boolean).join(" ")}
            invalid={Boolean(errors.date)}
            value={draft.date}
            onChange={(date) => update({ date })}
            min={bookingWindow.earliest}
            max={bookingWindow.latest}
            getUnavailableReason={getUnavailableReason}
          />
          <FieldError name="date" message={errors.date} />
        </div>

        <div>
          <p id="bk-time-label" className="mb-1 text-sm font-medium text-ink">
            {job.dayBased ? "Arrival time" : "Start time"}
          </p>
          <p id="bk-time-hint" className="mb-3 text-sm text-ink-subtle">
            {!draft.date
              ? "Choose a date to see open times."
              : job.dayBased
                ? `${service?.name ?? "This service"} takes ${service?.duration[draft.size] ?? "a full day"}. We arrive at opening and work through to completion, and we'll confirm any follow-up days by text.`
                : `${formatDateLong(draft.date)}${hoursForDate ? `, open ${hoursForDate}` : ""}. Times shown leave room to finish before close.`}
          </p>
          {draft.date && (
            <div
              role="radiogroup"
              aria-labelledby="bk-time-label"
              aria-describedby={["bk-time-hint", errors.time && errorId("time")]
                .filter(Boolean)
                .join(" ")}
              aria-invalid={errors.time ? true : undefined}
              className={cn(
                "grid gap-2",
                slots.length > 1 ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-3" : "grid-cols-1",
              )}
            >
              {slots.map((slot, i) => {
                const checked = draft.time === slot.value;
                return (
                  <label
                    key={slot.value}
                    className={cn(
                      "flex h-12 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium tabular-nums transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand-400 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-bg",
                      checked
                        ? "border-brand-500 bg-brand-500 text-bg"
                        : "border-border-strong bg-bg-elevated text-ink hover:border-brand-500/60",
                      errors.time && !checked && "border-danger/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="time"
                      value={slot.value}
                      id={(draft.time ? checked : i === 0) ? fieldId("time") : undefined}
                      checked={checked}
                      onChange={() => update({ time: slot.value })}
                      className="sr-only"
                    />
                    {slot.label}
                  </label>
                );
              })}
            </div>
          )}
          <FieldError name="time" message={errors.time} />
        </div>
      </div>
    </div>
  );
}
