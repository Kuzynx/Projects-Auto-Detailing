"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarDays, Car, MapPin, Phone, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import {
  formatAppointment,
  formatVehicle,
  getCityName,
  getEstimateNote,
  getSizeLabel,
} from "@/lib/booking/format";
import { formatServicePrice, getService } from "@/data/services";
import { calculateEstimate } from "@/lib/booking/pricing";
import { requiresGarage, type BookingDraft } from "@/lib/booking/schema";
import { cn, formatPrice } from "@/lib/utils";

function Row({
  icon: Icon,
  label,
  children,
  muted,
}: {
  icon: typeof Car;
  label: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex gap-3 py-3.5">
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium tracking-wider text-ink-subtle uppercase">{label}</dt>
        <dd className={cn("mt-1 text-sm", muted ? "text-ink-subtle" : "text-ink")}>{children}</dd>
      </div>
    </div>
  );
}

/** Live summary beside the form. Recomputes the estimate on every change. */
export function BookingSummary({ draft, className }: { draft: BookingDraft; className?: string }) {
  const reduceMotion = useReducedMotion();
  const estimate = calculateEstimate({
    serviceSlug: draft.service,
    size: draft.size,
    addOnSlugs: draft.addOns,
  });
  const service = getService(draft.service);
  const vehicle = formatVehicle(draft);
  const when = formatAppointment(draft);
  const city = getCityName(draft);

  return (
    <aside
      aria-labelledby="bk-summary-heading"
      className={cn("rounded-lg border border-border bg-surface shadow-card", className)}
    >
      <div className="border-b border-border px-6 py-5">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
          Your detail
        </p>
        <h2 id="bk-summary-heading" className="mt-1 text-lg font-semibold text-ink">
          Booking summary
        </h2>
      </div>

      <dl className="divide-y divide-border px-6">
        <Row icon={Sparkles} label="Service" muted={!estimate.service}>
          {estimate.service ? (
            <span className="flex items-baseline justify-between gap-3">
              <span>{estimate.service.name}</span>
              <span className="font-display tabular-nums">
                {service
                  ? formatServicePrice(service, draft.size)
                  : formatPrice(estimate.service.price)}
              </span>
            </span>
          ) : (
            "Choose a service"
          )}
          {estimate.addOns.length > 0 && (
            <ul className="mt-2 space-y-1 text-ink-muted">
              {estimate.addOns.map((addOn) => (
                <li key={addOn.slug} className="flex items-baseline justify-between gap-3">
                  <span>+ {addOn.name}</span>
                  <span className="tabular-nums">{formatPrice(addOn.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </Row>
        <Row icon={Car} label="Vehicle">
          {getSizeLabel(draft.size)}
          {vehicle && <span className="mt-0.5 block text-ink-muted">{vehicle}</span>}
        </Row>
        <Row icon={CalendarDays} label="When" muted={!when}>
          {when ?? "Not scheduled yet"}
          {estimate.durationLabel && (
            <span className="mt-0.5 block text-ink-muted">
              About {estimate.durationLabel} on site
            </span>
          )}
        </Row>
        <Row icon={MapPin} label="Where">
          Mobile, we come to you
          {city && <span className="mt-0.5 block text-ink-muted">{city}</span>}
          {requiresGarage(draft.service) && (
            <span className="mt-0.5 block text-ink-muted">In your garage or covered space</span>
          )}
        </Row>
      </dl>

      <div className="border-t border-border bg-bg-elevated/60 px-6 py-5">
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm text-ink-muted">Estimated total</p>
          <p
            className="font-display text-3xl font-semibold text-ink tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={estimate.total}
                className="inline-block"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {formatPrice(estimate.total)}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
          {getEstimateNote(draft.service, draft.size)}
        </p>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-6 py-4 text-sm text-ink-muted">
        <Phone aria-hidden className="size-4 text-brand-400" />
        <span>
          Prefer to talk?{" "}
          <a
            href={siteConfig.phoneHref}
            className="text-ink underline-offset-4 hover:text-brand-300 hover:underline"
          >
            {siteConfig.phone}
          </a>
        </span>
      </div>
    </aside>
  );
}
