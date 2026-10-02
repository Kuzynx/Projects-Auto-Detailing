/**
 * Spam heuristics shared by the server action and the static-hosting delivery.
 * Cheap and silent: callers return a convincing success and send nothing.
 */
import { BOOKING_FORM_FIELDS, MIN_FILL_TIME_MS } from "./types";

/**
 * True when a submission looks automated:
 * - the honeypot field has any value, or
 * - the fill time is missing, not a number, not positive, or under MIN_FILL_TIME_MS.
 *
 * Fill time comes from `elapsedMs`, a duration measured on the client with
 * `performance.now()`, so it does not depend on the device clock agreeing with
 * the server. Older clients send an absolute `startedAt` instead; for those a
 * negative elapsed time (device clock ahead of the server) cannot be judged and
 * is allowed, while a missing or zero value is treated as automated.
 */
export function isLikelyAutomated(formData: FormData, now: number = Date.now()): boolean {
  const honeypot = formData.get(BOOKING_FORM_FIELDS.honeypot);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const elapsedRaw = formData.get(BOOKING_FORM_FIELDS.elapsedMs);
  if (typeof elapsedRaw === "string" && elapsedRaw.trim() !== "") {
    const elapsed = Number(elapsedRaw);
    return !Number.isFinite(elapsed) || elapsed <= 0 || elapsed < MIN_FILL_TIME_MS;
  }

  const startedRaw = formData.get(BOOKING_FORM_FIELDS.startedAt);
  if (typeof startedRaw !== "string" || startedRaw.trim() === "") return true;
  const startedAt = Number(startedRaw);
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  const elapsed = now - startedAt;
  return elapsed >= 0 && elapsed < MIN_FILL_TIME_MS;
}
