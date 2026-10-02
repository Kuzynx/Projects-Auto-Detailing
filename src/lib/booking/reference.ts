/** Booking references look like "PAD-7F3K2Q". */
export const BOOKING_REFERENCE_PREFIX = "PAD-";

/** 32 characters: no 0/O or 1/I so references read clearly over the phone. */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const LENGTH = 6;

export const BOOKING_REFERENCE_PATTERN = new RegExp(
  `^${BOOKING_REFERENCE_PREFIX}[${ALPHABET}]{${LENGTH}}$`,
);

/**
 * Generates a short, human-friendly reference. `randomBytes` is injectable for
 * tests; it defaults to the Web Crypto API (available in Node 20 and browsers).
 */
export function generateBookingReference(
  randomBytes: (length: number) => Uint8Array = (length) =>
    crypto.getRandomValues(new Uint8Array(length)),
): string {
  const bytes = randomBytes(LENGTH);
  let code = "";
  // ALPHABET has 32 entries, so masking the low five bits is unbiased.
  for (let i = 0; i < LENGTH; i++) code += ALPHABET[bytes[i] & 31];
  return `${BOOKING_REFERENCE_PREFIX}${code}`;
}
