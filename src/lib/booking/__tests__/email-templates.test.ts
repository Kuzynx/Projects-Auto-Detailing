import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import {
  renderBusinessNotificationEmail,
  renderCustomerConfirmationEmail,
} from "../email-templates";
import { calculateEstimate } from "../pricing";
import { validateBooking, emptyDraft } from "../schema";

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");

function makeInput(overrides: Partial<typeof emptyDraft> = {}) {
  const result = validateBooking(
    {
      ...emptyDraft,
      service: "paint-correction",
      size: "sedan",
      make: "BMW",
      model: "M4",
      paintCondition: "visible-scratches",
      interiorCondition: "clean",
      street: "123 Main St",
      city: siteConfig.serviceArea[0],
      zip: siteConfig.address.zip,
      garageConfirmed: true,
      date: "2026-10-12",
      time: "07:00",
      name: "Sam <script>alert(1)</script> Lee",
      email: "sam@example.com",
      phone: "7605550123",
      notes: "Rock chip on hood & door",
      smsConsent: true,
      ...overrides,
    },
    NOW,
  );
  if (!result.success) throw new Error(JSON.stringify(result.fieldErrors));
  const booking = result.data;
  return {
    reference: "PAD-7F3K2Q",
    booking,
    estimate: calculateEstimate({
      serviceSlug: booking.service,
      size: booking.size,
      addOnSlugs: booking.addOns,
    }),
  };
}

describe("customer confirmation email", () => {
  const email = renderCustomerConfirmationEmail(makeInput());

  it("includes the reference, schedule and price in both formats", () => {
    expect(email.subject).toContain("PAD-7F3K2Q");
    expect(email.subject).toContain("Paint Correction");
    for (const body of [email.html, email.text]) {
      expect(body).toContain("PAD-7F3K2Q");
      expect(body).toContain("Monday, October 12, 2026, arrival at 7:00 AM");
      expect(body).toContain("$599");
      expect(body).toContain(siteConfig.phone);
    }
  });

  it("uses the configured brand name and logo", () => {
    expect(email.html).toContain(siteConfig.name.replace("'", "&#39;"));
    expect(email.html).toContain(siteConfig.logo);
  });

  it("describes a mobile, garage appointment with no business street address", () => {
    for (const body of [email.html, email.text]) {
      expect(body).toContain("123 Main St");
      expect(body).toContain("Garage or covered space confirmed");
      expect(body).toContain(siteConfig.region);
      expect(body).not.toMatch(/drop-off/i);
    }
  });

  it("escapes customer-supplied text in HTML", () => {
    expect(email.html).not.toContain("<script>");
    const shop = renderBusinessNotificationEmail(makeInput());
    expect(shop.html).not.toContain("<script>");
    expect(shop.html).toContain("&lt;script&gt;");
  });
});

describe("shop notification email", () => {
  it("contains the full job sheet", () => {
    const email = renderBusinessNotificationEmail(makeInput());
    expect(email.subject).toMatch(/^New booking PAD-7F3K2Q/);
    expect(email.text).toContain("Phone: (760) 555-0123");
    expect(email.text).toContain("Notes: Rock chip on hood & door");
    expect(email.html).toContain("Rock chip on hood &amp; door");
    expect(email.html).toContain("tel:+17605550123");
  });
});
