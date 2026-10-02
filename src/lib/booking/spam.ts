/**
 * Spam heuristics shared by the server action and the static-hosting delivery.
 * Cheap and silent: callers return a convincing success and send nothing.
 */
import { BOOKING_FORM_FIELDS, MIN_FILL_TIME_MS } from "./types";

/**
 * True when a submission looks automated:
 * - the honeypot field has any value, or
 * - `elapsedMs` (time on the form, measured on the client with `performance.now()`)
 *   is missing, not a number, not positive, or under MIN_FILL_TIME_MS.
 */
export function isLikelyAutomated(formData: FormData): boolean {
  const honeypot = formData.get(BOOKING_FORM_FIELDS.honeypot);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const raw = formData.get(BOOKING_FORM_FIELDS.elapsedMs);
  if (typeof raw !== "string" || raw.trim() === "") return true;
  const elapsed = Number(raw);
  return !Number.isFinite(elapsed) || elapsed <= 0 || elapsed < MIN_FILL_TIME_MS;
}
