/**
 * Static-hosting replacement for src/app/book/actions.ts. Same signature, no server.
 * Aliased in by next.config.ts when STATIC_EXPORT=true; never imported directly.
 */
import { siteConfig } from "@/config/site";
import { getAddOn, getService } from "@/data/services";
import {
  formatAppointment,
  formatServiceAddress,
  formatVehicle,
  getInteriorConditionLabel,
  getPaintConditionLabel,
  getSizeLabel,
  UTILITIES_CONFIRMED_LABEL,
} from "@/lib/booking/format";
import { calculateEstimate, formatEstimateTotal } from "@/lib/booking/pricing";
import { generateBookingReference } from "@/lib/booking/reference";
import { requiresGarage, validateBooking, type BookingData } from "@/lib/booking/schema";
import { isLikelyAutomated } from "@/lib/booking/spam";
import { BOOKING_FORM_FIELDS, type BookingActionState } from "@/lib/booking/types";
import { formatPrice } from "@/lib/utils";
import { buildMailto, formEndpoint, openMailto, postToFormEndpoint } from "./static-submit";

function summarize(reference: string, booking: BookingData, totalLabel: string) {
  const service = getService(booking.service)?.name ?? booking.service;
  const addOns = booking.addOns.map((slug) => getAddOn(slug)?.name ?? slug);
  const paint = getPaintConditionLabel(booking.paintCondition) ?? booking.paintCondition;
  const interior = getInteriorConditionLabel(booking.interiorCondition);
  const lines = [
    `Booking request ${reference}`,
    "",
    `Service: ${service} (${getSizeLabel(booking.size)})`,
    ...(addOns.length ? [`Add-ons: ${addOns.join(", ")}`] : []),
    `Vehicle: ${formatVehicle(booking) ?? "not specified"}`,
    // Motorcycles have no interior condition, pet hair or smoke answers.
    `Condition: paint ${paint}${interior ? `; interior ${interior}` : ""}`,
    ...(booking.petHair || booking.smoke
      ? [
          `Flags: ${[booking.petHair && "pet hair", booking.smoke && "smoke odor"].filter(Boolean).join(", ")}`,
        ]
      : []),
    `When: ${formatAppointment(booking) ?? booking.date}`,
    `Where: ${formatServiceAddress(booking)}`,
    ...(booking.utilitiesConfirmed ? [`${UTILITIES_CONFIRMED_LABEL}`] : []),
    ...(requiresGarage(booking.service) ? ["Garage or covered space: confirmed"] : []),
    `Estimate: ${totalLabel} (starting price)`,
    "",
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    booking.notes ? `Notes: ${booking.notes}` : "",
  ];
  return { subject: `Booking request ${reference}: ${service}`, body: lines.join("\n") };
}

export async function submitBooking(
  _prev: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const raw = formData.get(BOOKING_FORM_FIELDS.payload);
  let payload: unknown;
  try {
    payload = JSON.parse(typeof raw === "string" ? raw : "");
  } catch {
    return { ok: false, message: "We couldn't read your booking. Refresh the page and try again." };
  }

  const result = validateBooking(payload, new Date());
  if (!result.success) {
    return {
      ok: false,
      message: "A few details need another look. We've taken you to the first one.",
      fieldErrors: result.fieldErrors,
    };
  }

  const booking = result.data;
  const estimate = calculateEstimate({
    serviceSlug: booking.service,
    size: booking.size,
    addOnSlugs: booking.addOns,
  });
  const reference = generateBookingReference();
  const totalLabel = formatEstimateTotal(estimate) ?? formatPrice(estimate.total);
  const { subject, body } = summarize(reference, booking, totalLabel);

  if (formEndpoint) {
    // Same heuristics as the server action. Bots get a convincing success and nothing is
    // posted, so they don't use up the form provider's quota. (The mailto path below sends
    // nothing by itself, so it needs no gate.)
    if (isLikelyAutomated(formData)) {
      return { ok: true, reference, estimate, booking, delivery: "endpoint" };
    }
    const sent = await postToFormEndpoint({
      subject,
      replyTo: booking.email,
      fields: { reference, summary: body, ...booking },
    });
    if (sent) return { ok: true, reference, estimate, booking, delivery: "endpoint" };
    return {
      ok: false,
      message: `We couldn't send your request just now. Please try again, or call ${siteConfig.phone} and we'll book you over the phone.`,
    };
  }

  const mailtoHref = buildMailto(siteConfig.email, subject, body);
  openMailto(mailtoHref);
  return { ok: true, reference, estimate, booking, delivery: "mailto", mailtoHref };
}
