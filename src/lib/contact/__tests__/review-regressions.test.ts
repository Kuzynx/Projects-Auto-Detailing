/**
 * Regression tests from the contact form review (2026-10). Each FAILS until fixed.
 */
import { describe, expect, it } from "vitest";
import { buildContactEmail } from "../email";
import { contactSchema } from "../schema";

describe("contact review regressions", () => {
  // Regression: contactSchema's name only trims the ends, so a POST straight to the Server
  // Action can carry CR/LF inside the name, and buildContactEmail puts it verbatim into the
  // email Subject. Depending on the provider that is header injection or a rejected send
  // (the visitor then sees "We could not send your message").
  it("never puts line breaks from user input into the email subject", () => {
    const data = contactSchema.parse({
      name: "Jo\r\nBcc: victim@example.com",
      email: "jo@example.com",
      phone: "",
      topic: "quote",
      vehicle: "",
      message: "Quote for a full deluxe please.",
    });
    expect(buildContactEmail(data).subject).not.toMatch(/[\r\n]/);
  });
});
