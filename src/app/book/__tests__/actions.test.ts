/**
 * Regression tests from the booking review (2026-10) for the server action's spam checks.
 * Each test FAILS until the bug it documents is fixed.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import { bookingEmailLimiter, bookingIpLimiter } from "@/lib/booking/rate-limit";
import { emptyDraft } from "@/lib/booking/schema";
import { submitBooking } from "../actions";

const sendEmail = vi.fn(async () => ({ ok: true }));
vi.mock("@/lib/email", () => ({ sendEmail: (...args: unknown[]) => sendEmail(...(args as [])) }));

// Request headers for the rate limiter's client IP.
let requestHeaders = new Headers({ "x-forwarded-for": "203.0.113.7" });
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");

const payload = {
  ...emptyDraft,
  service: "basic-wash",
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

function form(fields: Record<string, string>) {
  const fd = new FormData();
  fd.set("payload", JSON.stringify(payload));
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("submitBooking spam checks", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    sendEmail.mockClear();
    bookingEmailLimiter.reset();
    bookingIpLimiter.reset();
    requestHeaders = new Headers({ "x-forwarded-for": "203.0.113.7" });
  });
  afterEach(() => vi.useRealTimers());

  it("sends both emails for a normal submission", async () => {
    const result = await submitBooking(
      null,
      form({ elapsedMs: String(5 * 60_000), company_website: "" }),
    );
    expect(result?.ok).toBe(true);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  // Regression: actions.ts used to compare the server clock with the browser's Date.now(), so a
  // customer whose device clock ran fast got a negative `elapsed` and was silently dropped. The
  // client now sends `elapsedMs`, a duration from performance.now(), so the device clock no
  // longer matters: the server never reads it.
  it("does not silently drop a real customer whose device clock is a few minutes fast", async () => {
    // Took 5 minutes to fill the form; the device clock (10 minutes ahead) is not sent at all.
    vi.setSystemTime(NOW.getTime() - 10 * 60_000);
    const result = await submitBooking(
      null,
      form({ elapsedMs: String(5 * 60_000), company_website: "" }),
    );
    expect(result?.ok).toBe(true);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  // Regression: an absolute `startedAt` is forgeable and no longer accepted in place of
  // `elapsedMs`.
  it("does not accept a legacy startedAt timestamp in place of elapsedMs", async () => {
    const result = await submitBooking(
      null,
      form({ startedAt: String(NOW.getTime() - 5 * 60_000) }),
    );
    expect(result?.ok).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  // Regression: a missing fill-time field must not skip the timing check.
  it("treats a submission without elapsedMs as automated", async () => {
    const fd = new FormData();
    fd.set("payload", JSON.stringify(payload));
    const result = await submitBooking(null, fd);
    expect(result?.ok).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

describe("submitBooking rate limits", () => {
  function submitAs(email: string) {
    const fd = new FormData();
    fd.set("payload", JSON.stringify({ ...payload, email }));
    fd.set("elapsedMs", String(5 * 60_000));
    return submitBooking(null, fd);
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    sendEmail.mockClear();
    bookingEmailLimiter.reset();
    bookingIpLimiter.reset();
    requestHeaders = new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" });
  });
  afterEach(() => vi.useRealTimers());

  it("allows 3 bookings per email address per hour, then asks them to call", async () => {
    for (let i = 0; i < 3; i++) {
      requestHeaders = new Headers({ "x-forwarded-for": `198.51.100.${i}` });
      expect((await submitAs("repeat@example.com"))?.ok).toBe(true);
    }
    requestHeaders = new Headers({ "x-forwarded-for": "198.51.100.99" });
    const limited = await submitAs("repeat@example.com");
    expect(limited?.ok).toBe(false);
    if (limited && !limited.ok) expect(limited.message).toContain(siteConfig.phone);
    expect(sendEmail).toHaveBeenCalledTimes(6);
  });

  it("allows 5 bookings per IP per 10 minutes across different emails", async () => {
    for (let i = 0; i < 5; i++) expect((await submitAs(`person${i}@example.com`))?.ok).toBe(true);
    expect((await submitAs("person5@example.com"))?.ok).toBe(false);
    // A different client is unaffected.
    requestHeaders = new Headers({ "x-real-ip": "192.0.2.44" });
    expect((await submitAs("person6@example.com"))?.ok).toBe(true);
  });

  it("refills after the window passes", async () => {
    for (let i = 0; i < 5; i++) await submitAs(`refill${i}@example.com`);
    expect((await submitAs("refill5@example.com"))?.ok).toBe(false);
    vi.setSystemTime(NOW.getTime() + 10 * 60_000);
    expect((await submitAs("refill6@example.com"))?.ok).toBe(true);
  });
});
