import type { BookingData, FieldErrors } from "./schema";
import type { Estimate } from "./pricing";

export type BookingActionSuccess = {
  ok: true;
  reference: string;
  estimate: Estimate;
  /** Normalized booking as the server accepted it (trimmed, phone formatted). */
  booking: BookingData;
  /**
   * How the request reached the shop. "email" is the server action (default);
   * "endpoint" and "sms" are the static-export paths (see src/lib/forms).
   */
  delivery?: "email" | "endpoint" | "sms";
  /** Set with delivery "sms": a link the visitor can tap if their messaging app did not open. */
  smsHref?: string;
  /** Set with delivery "sms": the pre-filled text, so it can be copied on a device without texting. */
  smsBody?: string;
};

export type BookingActionFailure = {
  ok: false;
  /** Form-level message, shown above the submit button. */
  message?: string;
  fieldErrors?: FieldErrors;
};

/** `null` before the first submission. */
export type BookingActionState = BookingActionSuccess | BookingActionFailure | null;

/** Form field names the server action reads. */
export const BOOKING_FORM_FIELDS = {
  payload: "payload",
  /** Milliseconds the visitor spent on the form, measured with performance.now(). */
  elapsedMs: "elapsedMs",
  honeypot: "company_website",
} as const;

/** Submissions faster than this after the form loaded are treated as bots. */
export const MIN_FILL_TIME_MS = 4000;
