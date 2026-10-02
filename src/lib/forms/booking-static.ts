/**
 * Static-hosting replacement for src/app/book/actions.ts. Same signature, no server.
 * Aliased in by next.config.ts when STATIC_EXPORT=true; never imported directly.
 */
import { siteConfig } from "@/config/site";
import { getAddOn, getService, vehicleSizes } from "@/data/services";
import { calculateEstimate } from "@/lib/booking/pricing";
import { generateBookingReference } from "@/lib/booking/reference";
import { requiresGarage, validateBooking, type BookingData } from "@/lib/booking/schema";
import { BOOKING_FORM_FIELDS, type BookingActionState } from "@/lib/booking/types";
import { formatPrice } from "@/lib/utils";
import { buildMailto, formEndpoint, openMailto, postToFormEndpoint } from "./static-submit";

function summarize(reference: string, booking: BookingData, total: number) {
  const service = getService(booking.service)?.name ?? booking.service;
  const size = vehicleSizes.find((v) => v.id === booking.size)?.label ?? booking.size;
  const addOns = booking.addOns.map((slug) => getAddOn(slug)?.name ?? slug);
  const vehicle = [booking.year, booking.make, booking.model, booking.color]
    .filter(Boolean)
    .join(" ");
  const city = booking.city === "Other" ? booking.cityOther : booking.city;
  const where = [booking.street, city, booking.zip].filter(Boolean).join(", ");
  const lines = [
    `Booking request ${reference}`,
    "",
    `Service: ${service} (${size})`,
    `Add-ons: ${addOns.length ? addOns.join(", ") : "none"}`,
    `Vehicle: ${vehicle || "not specified"}`,
    `Paint: ${booking.paintCondition}; interior: ${booking.interiorCondition}`,
    `Pet hair: ${booking.petHair ? "yes" : "no"}; smoke: ${booking.smoke ? "yes" : "no"}`,
    `When: ${booking.date} at ${booking.time}`,
    `Where: ${where}`,
    ...(requiresGarage(booking.service) ? ["Garage or covered space: confirmed"] : []),
    `Estimate: ${formatPrice(total)} (starting price)`,
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
  const { subject, body } = summarize(reference, booking, estimate.total);

  if (formEndpoint) {
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
