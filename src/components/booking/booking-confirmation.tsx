"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CalendarPlus, Check, Copy, Phone } from "lucide-react";
import { ButtonLink, buttonClasses, Eyebrow } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { getService } from "@/data/services";
import {
  bookingContactName,
  getEstimateNote,
  detailerName,
  formatAppointment,
  formatServiceAddress,
  formatVehicle,
  getCancellationPolicy,
  getSizeLabel,
} from "@/lib/booking/format";
import { requiresGarage } from "@/lib/booking/schema";
import { buildIcs, googleCalendarUrl, icsDataUrl, zonedDateTimeToUtc } from "@/lib/booking/ics";
import {
  findTimeSlot,
  getJobDuration,
  parseTimeValue,
  weeklyHours,
  weekdayOf,
} from "@/lib/booking/slots";
import type { BookingActionSuccess } from "@/lib/booking/types";
import { formatPrice } from "@/lib/utils";

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Calendar entry: the job length, or opening to close for day-based work. */
function useCalendarEvent({ reference, booking }: BookingActionSuccess) {
  return useMemo(() => {
    const service = getService(booking.service);
    const slot = findTimeSlot({
      serviceSlug: booking.service,
      size: booking.size,
      addOnSlugs: booking.addOns,
      date: booking.date,
      time: booking.time,
    });
    const job = getJobDuration({
      serviceSlug: booking.service,
      size: booking.size,
      addOnSlugs: booking.addOns,
    });
    const startMinutes = parseTimeValue(booking.time) ?? 0;
    const close = weeklyHours[weekdayOf(booking.date)]?.close ?? startMinutes + 60;
    const lengthMinutes =
      slot?.kind === "arrival"
        ? Math.max(60, close - startMinutes)
        : Math.max(60, Math.min(job.minutes, close - startMinutes));

    const start = zonedDateTimeToUtc(booking.date, booking.time);
    const end = new Date(start.getTime() + lengthMinutes * 60_000);
    const title = `${service?.name ?? "Detail"} with ${siteConfig.name}`;
    const description = [
      `Booking reference: ${reference}`,
      `Vehicle: ${formatVehicle(booking) ?? getSizeLabel(booking.size)}`,
      `Questions or changes: ${siteConfig.phone}`,
    ].join("\n");
    const location = formatServiceAddress(booking);
    const host = new URL(siteConfig.url).hostname;

    const ics = buildIcs({
      uid: `${reference}@${host}`,
      start,
      end,
      title,
      description,
      location,
      url: siteConfig.url,
      organizerName: siteConfig.name,
    });
    return {
      icsHref: icsDataUrl(ics),
      googleHref: googleCalendarUrl({ start, end, title, description, location }),
    };
  }, [reference, booking]);
}

export function BookingConfirmation({ result }: { result: BookingActionSuccess }) {
  const { reference, booking, estimate } = result;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const calendar = useCalendarEvent(result);
  const service = getService(booking.service);
  const when = formatAppointment(booking);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the reference is still visible and selectable.
    }
  }

  const founder = detailerName;
  const contactMethod = booking.smsConsent ? `text ${booking.phone}` : `call ${booking.phone}`;
  const nextSteps = [
    {
      title: `${bookingContactName} confirms your time`,
      body: `${bookingContactName} will ${contactMethod} within the hour during business hours. A confirmation email is on its way to ${booking.email}.`,
    },
    {
      title: "Day-before reminder",
      body: requiresGarage(booking.service)
        ? `You'll get ${founder}'s arrival time. Clear the garage or covered space so he can work all the way around the car; he brings water, power and lighting.`
        : `You'll get ${founder}'s arrival window. Leave about three feet of clearance around the car; he arrives with everything, including water and power.`,
    },
    {
      title: "Walkthrough, then the work",
      body: `${founder} walks the car with you and confirms the final price before any work begins. You pay after the final walkthrough.`,
    },
  ];

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="relative border-b border-border bg-bg-elevated px-6 py-10 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklab,var(--color-brand-500)_18%,transparent),transparent)]"
          />
          <motion.span
            initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
            className="relative mx-auto grid size-16 place-items-center rounded-full bg-brand-500 text-bg shadow-glow"
          >
            <Check aria-hidden className="size-8" strokeWidth={2.5} />
          </motion.span>
          <Eyebrow className="relative mt-6 justify-center">Request received</Eyebrow>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="relative mt-3 text-3xl font-semibold text-balance outline-none sm:text-4xl"
          >
            You&apos;re on the schedule, {firstName(booking.name)}.
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-pretty text-ink-muted">
            We&apos;ve held {when ?? "your slot"} for your {service?.name ?? "detail"}.{" "}
            {bookingContactName} will {contactMethod} within the hour to confirm.
          </p>

          <div className="relative mt-8 inline-flex items-center gap-3 rounded-full border border-border-strong bg-bg py-2 pr-2 pl-5">
            <span className="text-xs tracking-wider text-ink-subtle uppercase">Reference</span>
            <span className="font-mono text-lg font-semibold tracking-widest text-brand-300">
              {reference}
            </span>
            <button
              type="button"
              onClick={copyReference}
              className="grid size-9 place-items-center rounded-full text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
              aria-label={copied ? "Reference copied" : "Copy booking reference"}
            >
              {copied ? (
                <Check aria-hidden className="size-4 text-success" />
              ) : (
                <Copy aria-hidden className="size-4" />
              )}
            </button>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? "Booking reference copied to clipboard." : ""}
          </p>

          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={calendar.icsHref}
              download={`${reference.toLowerCase()}.ics`}
              className={buttonClasses("primary", "md")}
            >
              <CalendarPlus aria-hidden className="size-4" />
              Add to calendar
            </a>
            <a
              href={calendar.googleHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("outline", "md")}
            >
              Google Calendar<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="grid gap-10 px-6 py-10 sm:px-12 md:grid-cols-2">
          <section aria-labelledby="bk-done-details">
            <h3 id="bk-done-details" className="font-display text-base font-semibold text-ink">
              Your booking
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Service", service?.name ?? booking.service],
                [
                  "Vehicle",
                  [formatVehicle(booking), getSizeLabel(booking.size)].filter(Boolean).join(" · "),
                ],
                ...(estimate.addOns.length > 0
                  ? [["Add-ons", estimate.addOns.map((a) => a.name).join(", ")]]
                  : []),
                ["When", when ?? booking.date],
                ["Where", formatServiceAddress(booking)],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <dt className="w-20 shrink-0 text-ink-subtle">{label}</dt>
                  <dd className="min-w-0 text-ink">{value}</dd>
                </div>
              ))}
              <div className="flex gap-4 border-t border-border pt-3">
                <dt className="w-20 shrink-0 text-ink-subtle">Estimate</dt>
                <dd className="text-ink">
                  <span className="font-display text-lg font-semibold">
                    {formatPrice(estimate.total)}
                  </span>
                  <span className="block text-xs text-ink-subtle">
                    {getEstimateNote(booking.service, booking.size)}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {result.delivery === "mailto" && result.mailtoHref && (
            <section
              aria-labelledby="bk-done-mail"
              className="rounded-lg border border-brand-500/40 bg-brand-500/10 p-5"
            >
              <h3 id="bk-done-mail" className="font-display text-base font-semibold text-ink">
                One more step: send the email
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                We opened your email app with this request filled in. Press send and we&apos;ll
                confirm by text. If nothing opened, use the button below.
              </p>
              <a
                href={result.mailtoHref}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-bg transition hover:bg-brand-400"
              >
                Open booking email
              </a>
            </section>
          )}

          <section aria-labelledby="bk-done-next">
            <h3 id="bk-done-next" className="font-display text-base font-semibold text-ink">
              What happens next
            </h3>
            <ol className="mt-4 space-y-5">
              {nextSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-full border border-brand-500/50 font-display text-xs font-semibold text-brand-300"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{step.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="border-t border-border bg-bg-elevated/60 px-6 py-6 sm:px-12">
          <p className="text-sm text-ink-subtle">{getCancellationPolicy()}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/" variant="secondary" size="sm">
              Back to home
            </ButtonLink>
            <ButtonLink href="/services" variant="ghost" size="sm">
              Explore services
            </ButtonLink>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink sm:ml-auto"
            >
              <Phone aria-hidden className="size-4 text-brand-400" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
