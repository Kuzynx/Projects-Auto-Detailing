/**
 * Regression tests from the booking review (2026-10). Each test documents a
 * proven bug and FAILS until the bug is fixed. Uses the live catalog on purpose.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import { getService } from "@/data/services";
import { renderCustomerConfirmationEmail } from "../email-templates";
import { getEstimateNote } from "../format";
import { buildIcs } from "../ics";
import { formatPhoneAsYouType, isValidUsPhone, PHONE_INPUT_MAX_LENGTH } from "../phone";
import { calculateEstimate } from "../pricing";
import { emptyDraft, validateBooking } from "../schema";
import { getTimeSlots, parseTimeValue, weeklyHours, weekdayOf } from "../slots";

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");

function liveInput() {
  const result = validateBooking(
    {
      ...emptyDraft,
      service: "full-deluxe",
      size: "car",
      make: "Toyota",
      model: "Camry",
      paintCondition: "excellent",
      interiorCondition: "clean",
      street: "123 Main St",
      city: siteConfig.serviceArea[0],
      zip: siteConfig.address.zip,
      utilitiesConfirmed: true,
      date: "2026-10-14",
      time: "09:00",
      name: "Jordan Reyes",
      email: "jordan@example.com",
      phone: "7605550123",
    },
    NOW,
  );
  if (!result.success) throw new Error(JSON.stringify(result.fieldErrors));
  const booking = result.data;
  return {
    reference: "PAD-7F3K2Q",
    booking,
    estimate: calculateEstimate({ serviceSlug: booking.service, size: booking.size }),
  };
}

describe("review regressions", () => {
  afterEach(() => vi.unstubAllEnvs());

  // Regression: ics.ts escapeText uses .replace(/;/g, "\;"), and "\;" === ";" in JS,
  // so semicolons in SUMMARY/DESCRIPTION/LOCATION are never escaped (RFC 5545 3.3.11).
  it("escapes semicolons in iCalendar TEXT values", () => {
    const ics = buildIcs({
      uid: "x",
      start: new Date("2026-10-10T14:00:00Z"),
      end: new Date("2026-10-10T15:00:00Z"),
      title: "Detail",
      location: "Unit 4; gate code 1234",
    });
    expect(ics).toContain("LOCATION:Unit 4\\; gate code 1234");
  });

  // Regression: email-templates.ts layout() builds the logo with absoluteUrl(), which falls
  // back to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is unset, while siteConfig.url
  // (and siteUrl() in src/lib/seo/url.ts) fall back to the live domain. Real customers get a
  // broken logo pointing at localhost.
  it("never points email images at localhost when NEXT_PUBLIC_SITE_URL is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const email = renderCustomerConfirmationEmail(liveInput());
    expect(email.html).not.toContain("localhost");
  });

  // Regression: an empty NEXT_PUBLIC_SITE_URL ("NEXT_PUBLIC_SITE_URL=" in an env file) makes
  // absoluteUrl() call new URL(""), which throws inside the server action, so the booking is
  // lost and the visitor sees "We couldn't reach our booking system".
  it("renders booking emails when NEXT_PUBLIC_SITE_URL is an empty string", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(() => renderCustomerConfirmationEmail(liveInput())).not.toThrow();
  });

  // Regression: parseDuration reads only the FIRST number of "~2.5–3.5 hrs" (150 min), so the
  // slot list offers starts whose upper estimate runs past closing (Saturday 1 PM + 3.5 h =
  // 4:30 PM, closing 4 PM), contradicting "Times shown leave room to finish before close."
  it("offers only start times whose upper duration estimate finishes by closing", () => {
    const saturday = "2026-10-10";
    const close = weeklyHours[weekdayOf(saturday)]!.close;
    for (const slug of ["full-deluxe", "working-truck", "premium-detail"]) {
      const label = getService(slug)!.duration.car;
      const numbers = [...label.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
      const upperMinutes = Math.round(Math.max(...numbers) * 60);
      const late = getTimeSlots({ date: saturday, serviceSlug: slug, size: "car" })
        .map((s) => parseTimeValue(s.value)!)
        .filter((start) => start + upperMinutes > close);
      expect({ slug, late }).toEqual({ slug, late: [] });
    }
  });

  // Regression: getEstimateNote checks isExotic(size) before the work-vehicle rule, so a
  // Working Truck (flat $75 for any work vehicle, +$15–$30 if extremely dirty) booked with the
  // "Exotic" type shows the exotic "starts at" note and loses the work-vehicle surcharge note.
  it("keeps the work-vehicle surcharge note for Working Truck regardless of vehicle type", () => {
    expect(getEstimateNote("working-truck", "exotic")).toMatch(/\$15–\$30/);
  });

  // Regression: the phone input has maxLength={16} (contact-step.tsx), so pasting or
  // autofilling "+1 (760) 555-0147" (17 chars) is truncated to "+1 (760) 555-014", which
  // formatPhoneAsYouType turns into "(176) 055-5014", an invalid number the customer did
  // not type.
  it("keeps a pasted +1 number intact within the input's maxLength", () => {
    // Slices to the maxLength the phone input actually uses (was a hardcoded 16, which drops
    // the last digit and so can never pass; the constant is what contact-step.tsx renders).
    const pasted = "+1 (760) 555-0147".slice(0, PHONE_INPUT_MAX_LENGTH);
    expect(pasted).toBe("+1 (760) 555-0147");
    const formatted = formatPhoneAsYouType(pasted);
    expect(isValidUsPhone(formatted)).toBe(true);
  });
});
