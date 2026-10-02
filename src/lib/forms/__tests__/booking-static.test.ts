/**
 * Regression tests from the booking review (2026-10) for the static-export booking delivery
 * (aliased over src/app/book/actions.ts when STATIC_EXPORT=true). Each FAILS until fixed.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import { emptyDraft } from "@/lib/booking/schema";

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");

const payload = {
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
};

describe("static booking delivery", () => {
  const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  // Regression: booking-static.ts never reads the honeypot (company_website) or startedAt
  // that booking-flow.tsx sends, so on static hosting with NEXT_PUBLIC_FORM_ENDPOINT every
  // bot submission is POSTed to the form provider (and counts against its quota), unlike
  // the server action, which drops them.
  it("drops honeypot-filled submissions instead of posting them to the endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_FORM_ENDPOINT", "https://forms.example.com/f/abc");
    const { submitBooking } = await import("../booking-static");
    const fd = new FormData();
    fd.set("payload", JSON.stringify(payload));
    fd.set("startedAt", String(NOW.getTime() - 5 * 60_000));
    fd.set("company_website", "http://spam.example");
    const result = await submitBooking(null, fd);
    expect(result?.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // Regression: static-submit.ts says "Bodies are kept short because some mail clients cap
  // URL length", but nothing caps them: a booking with the allowed 1000-character note
  // produces a mailto: URL far beyond the ~2000-character limit of Outlook/IE-era handlers,
  // so the mail app opens truncated or not at all.
  it("keeps the mailto: link within a safe length for the longest allowed booking", async () => {
    vi.stubEnv("NEXT_PUBLIC_FORM_ENDPOINT", "");
    const { submitBooking } = await import("../booking-static");
    const fd = new FormData();
    fd.set("payload", JSON.stringify({ ...payload, notes: "Gate code, side yard; ".repeat(45) }));
    const result = await submitBooking(null, fd);
    expect(result?.ok && result.mailtoHref).toBeTruthy();
    if (result?.ok) expect(result.mailtoHref!.length).toBeLessThanOrEqual(2000);
  });
});
