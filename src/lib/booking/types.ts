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
   * "endpoint" and "mailto" are the static-export paths (see src/lib/forms).
   */
  delivery?: "email" | "endpoint" | "mailto";
  /** Set with delivery "mailto": a link the visitor can click if their mail app did not open. */
  mailtoHref?: string;
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
  startedAt: "startedAt",
  honeypot: "company_website",
} as const;

/** Submissions faster than this after the form loaded are treated as bots. */
export const MIN_FILL_TIME_MS = 4000;
