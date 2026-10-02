"use client";

import { PencilLine } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getAddOn, getService } from "@/data/services";
import {
  formatAppointment,
  formatServiceAddress,
  formatVehicle,
  getCancellationPolicy,
  getDepositPolicy,
  getSizeLabel,
} from "@/lib/booking/format";
import { formatPhoneAsYouType } from "@/lib/booking/phone";
import {
  bookingSteps,
  requiresGarage,
  stepIndexOf,
  type BookingStepId,
} from "@/lib/booking/schema";
import { CheckboxField, TextAreaField, TextField } from "./fields";
import type { StepProps } from "./step-types";

interface ContactStepProps extends StepProps {
  onEdit: (step: number) => void;
}

export function ContactStep({ draft, errors, update, onEdit }: ContactStepProps) {
  const service = getService(draft.service);
  const deposit = requiresGarage(draft.service) ? getDepositPolicy() : null;
  type SummaryRow = { step: BookingStepId; label: string; value: string };
  const summaryRows = (
    [
      { step: "service", label: "Service", value: service?.name ?? "Not chosen" },
      {
        step: "vehicle",
        label: "Vehicle",
        value: [formatVehicle(draft), getSizeLabel(draft.size)].filter(Boolean).join(" · "),
      },
      {
        step: "addons",
        label: "Add-ons",
        value:
          draft.addOns
            .map((slug) => getAddOn(slug)?.name)
            .filter(Boolean)
            .join(", ") || "None",
      },
      { step: "schedule", label: "When", value: formatAppointment(draft) ?? "Not scheduled" },
      {
        step: "schedule",
        label: "Where",
        value: formatServiceAddress(draft),
      },
    ] satisfies SummaryRow[]
  ).filter((row: SummaryRow) => stepIndexOf(row.step) !== -1); // drop rows for hidden steps

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            className="sm:col-span-2"
            name="name"
            label="Full name"
            value={draft.name}
            onValueChange={(name) => update({ name })}
            error={errors.name}
            autoComplete="name"
            placeholder="Jordan Reyes"
            maxLength={80}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={draft.email}
            onValueChange={(email) => update({ email })}
            error={errors.email}
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            maxLength={254}
          />
          <TextField
            name="phone"
            label="Mobile phone"
            type="tel"
            value={draft.phone}
            onValueChange={(phone) => update({ phone: formatPhoneAsYouType(phone) })}
            error={errors.phone}
            autoComplete="tel-national"
            inputMode="tel"
            placeholder={`${siteConfig.phone.slice(0, 6)}555-0123`}
            maxLength={16}
          />
          <TextAreaField
            className="sm:col-span-2"
            name="notes"
            label="Anything we should know?"
            optional
            value={draft.notes}
            onValueChange={(notes) => update({ notes })}
            error={errors.notes}
            placeholder="Gate code, where the car is parked, a stain or scratch you want us to focus on."
            maxLength={1000}
            rows={3}
          />
        </div>
        <CheckboxField
          className="mt-4"
          name="smsConsent"
          checked={draft.smsConsent}
          onCheckedChange={(smsConsent) => update({ smsConsent })}
          error={errors.smsConsent}
          label="Text me to confirm and remind me about this appointment"
          description={`Messages come from ${siteConfig.name}. Message and data rates may apply. Reply STOP to opt out. Leave unchecked and we'll call instead.`}
        />
      </fieldset>

      <section
        aria-labelledby="bk-check-heading"
        className="rounded-lg border border-border bg-bg-elevated"
      >
        <h3
          id="bk-check-heading"
          className="border-b border-border px-5 py-4 font-display text-base font-semibold text-ink"
        >
          Check your booking
        </h3>
        <dl className="divide-y divide-border">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex items-start gap-4 px-5 py-3.5 text-sm">
              <dt className="w-20 shrink-0 text-ink-subtle">{row.label}</dt>
              <dd className="min-w-0 flex-1 text-ink">{row.value}</dd>
              <dd className="shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(stepIndexOf(row.step))}
                  className="inline-flex items-center gap-1 rounded-sm text-brand-300 hover:text-brand-400"
                >
                  <PencilLine aria-hidden className="size-3.5" />
                  Edit
                  <span className="sr-only">
                    {" "}
                    {row.label.toLowerCase()} ({bookingSteps[stepIndexOf(row.step)].label} step)
                  </span>
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="space-y-2 text-sm text-ink-subtle">
        <p>Nothing to pay online. You pay after the final walkthrough.</p>
        {deposit && <p>{deposit}</p>}
        <p>{getCancellationPolicy()}</p>
      </div>
    </div>
  );
}
