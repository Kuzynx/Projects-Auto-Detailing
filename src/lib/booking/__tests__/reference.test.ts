import { describe, expect, it } from "vitest";
import { BOOKING_REFERENCE_PATTERN, generateBookingReference } from "../reference";

describe("generateBookingReference", () => {
  it("matches the PAD-XXXXXX format", () => {
    for (let i = 0; i < 200; i++)
      expect(generateBookingReference()).toMatch(BOOKING_REFERENCE_PATTERN);
  });

  it("never uses ambiguous characters", () => {
    for (let i = 0; i < 200; i++) expect(generateBookingReference().slice(4)).not.toMatch(/[01IO]/);
  });

  it("is deterministic with injected randomness", () => {
    expect(generateBookingReference(() => new Uint8Array([0, 1, 2, 31, 32, 255]))).toBe(
      "PAD-234Z2Z",
    );
  });
});
