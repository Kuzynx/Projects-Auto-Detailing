/** Display helpers shared by the summary card, confirmation screen and emails. */
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { getService, priceFactors, vehicleSizes, type VehicleSize } from "@/data/services";
import {
  interiorConditions,
  isExotic,
  OTHER_CITY,
  paintConditions,
  type BookingDraft,
} from "./schema";
import { findTimeSlot, formatClock, formatDateLong, parseTimeValue } from "./slots";

/** "Victorville and the High Desert", from siteConfig. */
export const serviceAreaLabel = `${siteConfig.address.city} and the ${siteConfig.region}`;

/** Who details the car: the founder. */
export const detailerName: string = siteConfig.founder.name;

/**
 * Who confirms bookings by text: the first team member (the manager), falling
 * back to the founder when there is no team.
 */
export const bookingContactName: string =
  (siteConfig.team as readonly { name: string }[])[0]?.name ?? siteConfig.founder.name;

/** Default note under every estimate. */
export const DEFAULT_ESTIMATE_NOTE =
  "Starting price. Your final quote is confirmed on site after a quick inspection, before any work begins.";

/** Shown for exotic vehicles, whose prices are "starting at" / "+". */
export const EXOTIC_ESTIMATE_NOTE =
  "Exotic pricing starts at the amount shown; final quote confirmed on site.";

/** "$15–$30" from the catalog's price factor for extremely dirty work vehicles, if any. */
function workVehicleSurcharge(): string | null {
  const factor = priceFactors.find((f) => f.amount && /work vehicle/i.test(f.title));
  return factor?.amount ? factor.amount.replace(/^\+/, "") : null;
}

/**
 * Note shown under the estimate in the summary, confirmation and emails.
 * Exotic sizes and work vehicles get their own wording; everything else the default.
 */
export function getEstimateNote(serviceSlug: string, size: VehicleSize): string {
  const service = getService(serviceSlug);
  if (isExotic(size) || (service && service.priceNote?.[size])) return EXOTIC_ESTIMATE_NOTE;
  const surcharge = workVehicleSurcharge();
  if (service?.category === "work" && surcharge) {
    return `Starting price; extremely dirty construction, farm or work vehicles may add ${surcharge}, quoted on site.`;
  }
  return DEFAULT_ESTIMATE_NOTE;
}

export function getSizeLabel(size: VehicleSize): string {
  return vehicleSizes.find((s) => s.id === size)?.label ?? size;
}

export function getPaintConditionLabel(value: string): string | null {
  return paintConditions.find((c) => c.value === value)?.label ?? null;
}

export function getInteriorConditionLabel(value: string): string | null {
  return interiorConditions.find((c) => c.value === value)?.label ?? null;
}

/** "2021 Porsche 911, Chalk" or null when make and model are empty. */
export function formatVehicle(
  d: Pick<BookingDraft, "year" | "make" | "model" | "color">,
): string | null {
  const name = [d.year, d.make, d.model]
    .map((v) => v.trim())
    .filter(Boolean)
    .join(" ");
  if (!name) return null;
  return d.color.trim() ? `${name}, ${d.color.trim()}` : name;
}

export function getCityName(d: Pick<BookingDraft, "city" | "cityOther">): string {
  return d.city === OTHER_CITY ? d.cityOther.trim() : d.city.trim();
}

/** "14522 Bear Valley Rd, Victorville, CA 92392": where we'll do the work. */
export function formatServiceAddress(
  d: Pick<BookingDraft, "street" | "city" | "cityOther" | "zip">,
): string {
  const city = getCityName(d);
  const cityLine = [city, `${siteConfig.address.state} ${d.zip.trim()}`.trim()]
    .filter(Boolean)
    .join(", ");
  return [d.street.trim(), cityLine].filter(Boolean).join(", ");
}

/** "Saturday, October 10, 2026 at 9:00 AM" (or "..., arrival at 7:00 AM"). */
export function formatAppointment(
  d: Pick<BookingDraft, "service" | "size" | "addOns" | "date" | "time">,
): string | null {
  if (!d.date) return null;
  const dateLabel = formatDateLong(d.date);
  if (!d.time) return dateLabel;
  const slot = findTimeSlot({
    serviceSlug: d.service,
    size: d.size,
    addOnSlugs: d.addOns,
    date: d.date,
    time: d.time,
  });
  const minutes = parseTimeValue(d.time);
  const timeLabel = minutes === null ? d.time : formatClock(minutes);
  if (slot?.kind === "arrival") return `${dateLabel}, arrival at ${timeLabel}`;
  return `${dateLabel} at ${timeLabel}`;
}

function findFaqAnswer(pattern: RegExp): string | null {
  return faqs.find((f) => f.category === "booking" && pattern.test(f.question))?.answer ?? null;
}

/** Reschedule and cancellation policy, read from the FAQ data so copy stays in one place. */
export function getCancellationPolicy(): string {
  return (
    findFaqAnswer(/cancel|reschedul/i) ??
    `Need to change your appointment? Call ${siteConfig.phone} and we'll find a new time.`
  );
}

/** Deposit policy for correction and coating services, from the FAQ data. */
export function getDepositPolicy(): string | null {
  return findFaqAnswer(/deposit/i);
}
