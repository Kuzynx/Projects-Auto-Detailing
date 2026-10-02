/** Display helpers shared by the summary card, confirmation screen and emails. */
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { vehicleSizes, type VehicleSize } from "@/data/services";
import { interiorConditions, OTHER_CITY, paintConditions, type BookingDraft } from "./schema";
import { findTimeSlot, formatClock, formatDateLong, parseTimeValue } from "./slots";

export const studioAddress = `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.zip}`;

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

/** "1200 Barton Hills Dr, Austin, TX 78704" for mobile, the studio address otherwise. */
export function formatServiceAddress(
  d: Pick<BookingDraft, "locationType" | "street" | "city" | "cityOther" | "zip">,
): string {
  if (d.locationType === "studio") return studioAddress;
  const city = getCityName(d);
  const cityLine = [city, `${siteConfig.address.state} ${d.zip.trim()}`.trim()]
    .filter(Boolean)
    .join(", ");
  return [d.street.trim(), cityLine].filter(Boolean).join(", ");
}

export function getLocationTypeLabel(type: BookingDraft["locationType"]): string {
  return type === "studio" ? "Studio drop-off" : "Mobile, we come to you";
}

/** "Saturday, October 10, 2026 at 9:00 AM" (or "... Drop-off 8:00 AM"). */
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
  if (slot?.kind === "drop-off") return `${dateLabel}, drop-off at ${timeLabel}`;
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

/** Deposit policy for studio services, from the FAQ data. */
export function getDepositPolicy(): string | null {
  return findFaqAnswer(/deposit/i);
}
