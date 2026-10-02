import { describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import {
  renderBusinessNotificationEmail,
  renderCustomerConfirmationEmail,
} from "../email-templates";
import { calculateEstimate } from "../pricing";
import { validateBooking, emptyDraft } from "../schema";

vi.mock("@/data/services", async (importOriginal) =>
  (await import("./fixtures/catalog")).withFixtureCatalog(await importOriginal<object>()),
);

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");

function makeInput(overrides: Partial<typeof emptyDraft> = {}) {
  const result = validateBooking(
    {
      ...emptyDraft,
      service: "fx-garage",
      size: "car",
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
    expect(email.subject).toContain("Fixture Garage Service");
    for (const body of [email.html, email.text]) {
      expect(body).toContain("PAD-7F3K2Q");
      expect(body).toContain("Monday, October 12, 2026, arrival at 7:00 AM");
      expect(body).toContain("$500");
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

  it("names who confirms and who details, with the owner-operated footer", () => {
    const confirmer = siteConfig.team[0]?.name ?? siteConfig.founder.name;
    for (const body of [email.html, email.text]) {
      expect(body).toContain(`${confirmer} will text`);
      expect(body).toContain(
        `${siteConfig.founder.name}'s arrival time`.replace(
          "'",
          body === email.html ? "&#39;" : "'",
        ),
      );
      expect(body).toContain(`Since ${siteConfig.founded}`);
    }
  });

  it("escapes customer-supplied text in HTML", () => {
    expect(email.html).not.toContain("<script>");
    const shop = renderBusinessNotificationEmail(makeInput());
    expect(shop.html).not.toContain("<script>");
    expect(shop.html).toContain("&lt;script&gt;");
  });
});

describe("add-ons and price notes", () => {
  it("omits the add-ons line when none were chosen", () => {
    const email = renderCustomerConfirmationEmail(makeInput());
    expect(email.text).not.toContain("Add-ons");
    expect(email.html).not.toContain("Add-ons");
  });

  it("lists add-ons when some were chosen", () => {
    const email = renderCustomerConfirmationEmail(
      makeInput({
        service: "fx-full",
        garageConfirmed: false,
        time: "09:00",
        addOns: ["fx-engine"],
      }),
    );
    expect(email.text).toContain("Add-ons: Fixture Engine Bay ($20)");
  });

  it("uses the work-vehicle and exotic notes under the estimate", () => {
    const work = renderCustomerConfirmationEmail(
      makeInput({ service: "fx-work", size: "truck", garageConfirmed: false, time: "09:00" }),
    );
    expect(work.text).toContain(
      "extremely dirty trucks, SUVs and work vehicles may add $15–$30",
    );
    const exotic = renderCustomerConfirmationEmail(
      makeInput({ service: "fx-wash", size: "exotic", garageConfirmed: false, time: "09:00" }),
    );
    expect(exotic.text).toContain("Exotic pricing starts at the amount shown");
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
