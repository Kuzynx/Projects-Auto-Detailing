/** US phone helpers. Accepts any punctuation and an optional leading +1. */

/**
 * maxLength for the phone input. Generous on purpose: autofill and pastes like
 * "+1 (760) 555-0147" (17 characters) must arrive whole; formatPhoneAsYouType
 * caps the digits anyway.
 */
export const PHONE_INPUT_MAX_LENGTH = 25;

/** Returns the 10 significant digits, or null if it is not a valid NANP number. */
export function normalizeUsPhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  // NANP: area code and exchange cannot start with 0 or 1.
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? digits : null;
}

export function isValidUsPhone(value: string): boolean {
  return normalizeUsPhone(value) !== null;
}

/** "7605550147" -> "(760) 555-0147". Returns the input unchanged if invalid. */
export function formatUsPhone(value: string): string {
  const digits = normalizeUsPhone(value);
  if (!digits) return value;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** "+1 (760) 555-0147" for tel: links and calendar entries. */
export function toE164(value: string): string | null {
  const digits = normalizeUsPhone(value);
  return digits ? `+1${digits}` : null;
}

/** Progressive formatting while typing: "760555" -> "(760) 555". */
export function formatPhoneAsYouType(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("1")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
