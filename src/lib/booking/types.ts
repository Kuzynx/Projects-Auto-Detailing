import type { BookingData, FieldErrors } from "./schema";
import type { Estimate } from "./pricing";

export type BookingActionSuccess = {
  ok: true;
  reference: string;
  estimate: Estimate;
  /** Normalized booking as the server accepted it (trimmed, phone formatted). */
  booking: BookingData;
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
