"use server";

import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { sendEmail } from "@/lib/email";
import {
  renderBusinessNotificationEmail,
  renderCustomerConfirmationEmail,
} from "@/lib/booking/email-templates";
import { calculateEstimate } from "@/lib/booking/pricing";
import { generateBookingReference } from "@/lib/booking/reference";
import { validateBooking } from "@/lib/booking/schema";
import { clientIpFrom, takeBookingSlot, UNKNOWN_IP } from "@/lib/booking/rate-limit";
import { isLikelyAutomated } from "@/lib/booking/spam";
import { BOOKING_FORM_FIELDS, type BookingActionState } from "@/lib/booking/types";

const MAX_PAYLOAD_BYTES = 16_000;

/** Client IP for rate limiting; a shared "unknown" bucket outside a request (tests, scripts). */
async function requestIp(): Promise<string> {
  try {
    return clientIpFrom(await headers());
  } catch {
    return UNKNOWN_IP;
  }
}

/**
 * Accepts a booking request. Everything from the client is untrusted: the
 * payload is re-validated with the same zod schema, the estimate is recomputed
 * here, and two emails go out (shop notification + customer confirmation).
 *
 * Not included: rate limiting and persistence. Email is the system of record.
 */
export async function submitBooking(
  _prev: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const now = new Date();
  const rawPayload = formData.get(BOOKING_FORM_FIELDS.payload);

  if (
    typeof rawPayload !== "string" ||
    rawPayload.length === 0 ||
    rawPayload.length > MAX_PAYLOAD_BYTES
  ) {
    return { ok: false, message: "We couldn't read your booking. Refresh the page and try again." };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawPayload);
  } catch {
    return { ok: false, message: "We couldn't read your booking. Refresh the page and try again." };
  }

  const result = validateBooking(payload, now);
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

  // Spam checks (honeypot + fill time, see isLikelyAutomated). Bots get a convincing
  // success response and nothing is sent, so they learn nothing.
  if (isLikelyAutomated(formData)) {
    console.warn("[booking] dropped a likely automated submission", { reference });
    return { ok: true, reference, estimate, booking };
  }

  // Rate limits stop anyone using the form to send branded email to arbitrary addresses:
  // 5 bookings per IP per 10 minutes and 3 per email address per hour (see rate-limit.ts).
  if (!takeBookingSlot(await requestIp(), booking.email)) {
    console.warn("[booking] rate limited", { reference });
    return {
      ok: false,
      message: `We couldn't take your booking online right now. Please call ${siteConfig.phone} and we'll book you over the phone.`,
    };
  }

  const emailInput = { reference, booking, estimate };
  const notification = renderBusinessNotificationEmail(emailInput);
  const confirmation = renderCustomerConfirmationEmail(emailInput);

  const [shop, customer] = await Promise.all([
    sendEmail({
      to: process.env.BOOKING_NOTIFY_EMAIL ?? siteConfig.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      replyTo: booking.email,
    }),
    sendEmail({
      to: booking.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      replyTo: siteConfig.email,
    }),
  ]);

  // Without the shop notification the booking would be lost, so that one is fatal.
  if (!shop.ok) {
    console.error("[booking] shop notification failed", { reference, error: shop.error });
    return {
      ok: false,
      message: `We couldn't send your request just now. Please try again, or call ${siteConfig.phone} and we'll book you over the phone.`,
    };
  }
  if (!customer.ok) {
    console.error("[booking] customer confirmation failed", { reference, error: customer.error });
  }

  return { ok: true, reference, estimate, booking };
}
