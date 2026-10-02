"use client";

import { useMemo, useState } from "react";
import { Building2, Info, MapPin, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getService } from "@/data/services";
import { studioAddress } from "@/lib/booking/format";
import { isStudioOnly, OTHER_CITY } from "@/lib/booking/schema";
import {
  formatClock,
  formatDateLong,
  formatHoursForDate,
  getBookingWindow,
  getDateUnavailableReason,
  getJobDuration,
  getTimeSlots,
  NEXT_DAY_CUTOFF_HOUR,
  type IsoDate,
} from "@/lib/booking/slots";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { errorId, FieldError, fieldId, SelectField, TextField } from "./fields";
import { OptionCard } from "./option-card";
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
  const studioOnly = isStudioOnly(draft.service);

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

  const locationError = errors.locationType;

  return (
    <div className="space-y-10">
      {/* Location */}
      <div>
        <p id="bk-location-label" className="mb-3 text-sm font-medium text-ink">
          Where should we detail it?
        </p>
        <div
          role="radiogroup"
          aria-labelledby="bk-location-label"
          aria-describedby={locationError ? errorId("locationType") : undefined}
          aria-invalid={locationError ? true : undefined}
          className="grid gap-3 sm:grid-cols-2"
        >
          <OptionCard
            type="radio"
            name="locationType"
            value="mobile"
            id={draft.locationType === "mobile" ? fieldId("locationType") : undefined}
            checked={draft.locationType === "mobile"}
            onChange={() => update({ locationType: "mobile" })}
            disabled={studioOnly}
            invalid={Boolean(locationError)}
          >
            <Truck aria-hidden className="mb-3 size-5 text-brand-400" />
            <span className="block font-display text-base font-semibold text-ink">
              Mobile, we come to you
            </span>
            <span className="mt-1 block text-sm text-ink-muted">
              Home, office or apartment lot. We bring water, power and lighting.
            </span>
          </OptionCard>
          <OptionCard
            type="radio"
            name="locationType"
            value="studio"
            id={draft.locationType === "studio" ? fieldId("locationType") : undefined}
            checked={draft.locationType === "studio"}
            onChange={() => update({ locationType: "studio" })}
            invalid={Boolean(locationError)}
          >
            <Building2 aria-hidden className="mb-3 size-5 text-brand-400" />
            <span className="block font-display text-base font-semibold text-ink">
              Studio drop-off
            </span>
            <span className="mt-1 block text-sm text-ink-muted">
              Our climate-controlled {siteConfig.address.city} studio, with controlled lighting and
              filtered air.
            </span>
          </OptionCard>
        </div>
        {studioOnly && service && (
          <p className="mt-3 flex items-start gap-2.5 rounded-md border border-brand-500/30 bg-brand-500/[0.06] p-3.5 text-sm text-ink-muted">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
            <span>
              <span className="font-medium text-ink">{service.name} is studio only.</span> It needs
              dust-free air and color-matched lighting to get a flawless result, so we&apos;ve
              selected studio drop-off for you.
            </span>
          </p>
        )}
        <FieldError name="locationType" message={locationError} />
      </div>

      {draft.locationType === "mobile" ? (
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
              placeholder="1200 Barton Hills Dr"
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
              placeholder="78704"
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
                hint="Outside our usual area? We often still make it work and will confirm by text."
                maxLength={60}
              />
            )}
          </div>
        </fieldset>
      ) : (
        <div className="flex items-start gap-4 rounded-lg border border-border bg-bg-elevated p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-400">
            <MapPin aria-hidden className="size-5" />
          </span>
          <div className="min-w-0 text-sm">
            <p className="font-display text-base font-semibold text-ink">
              {siteConfig.name} Studio
            </p>
            <p className="mt-1 text-ink-muted">{studioAddress}</p>
            <ul className="mt-2 space-y-0.5 text-ink-subtle">
              {siteConfig.hours.map((row) => (
                <li key={row.days}>
                  {row.days}: {row.close ? `${row.open} – ${row.close}` : row.open}
                </li>
              ))}
            </ul>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studioAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-brand-300 underline-offset-4 hover:underline"
            >
              Get directions<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      )}

      {/* Date and time */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <p id="bk-date-label" className="mb-1 text-sm font-medium text-ink">
            Date
          </p>
          <p id="bk-date-hint" className="mb-3 text-sm text-ink-subtle">
            Book by {formatClock(NEXT_DAY_CUTOFF_HOUR * 60)} for next-day appointments. Closed
            Sundays.
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
            {job.dropOff ? "Drop-off time" : "Start time"}
          </p>
          <p id="bk-time-hint" className="mb-3 text-sm text-ink-subtle">
            {!draft.date
              ? "Choose a date to see open times."
              : job.dropOff
                ? `${service?.name ?? "This service"} takes ${service?.duration[draft.size] ?? "more than a day"}. Drop off at opening and we'll text you when it's ready.`
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
