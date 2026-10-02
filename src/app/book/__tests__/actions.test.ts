/**
 * Regression tests from the booking review (2026-10) for the server action's spam checks.
 * Each test FAILS until the bug it documents is fixed.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import { emptyDraft } from "@/lib/booking/schema";
import { submitBooking } from "../actions";

const sendEmail = vi.fn(async () => ({ ok: true }));
vi.mock("@/lib/email", () => ({ sendEmail: (...args: unknown[]) => sendEmail(...(args as [])) }));

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
  });
  afterEach(() => vi.useRealTimers());

  it("sends both emails for a normal submission", async () => {
    const result = await submitBooking(
      null,
      form({ startedAt: String(NOW.getTime() - 5 * 60_000), company_website: "" }),
    );
    expect(result?.ok).toBe(true);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  // Regression: actions.ts compares the server clock with the browser's Date.now() from
  // booking-flow.tsx. A customer whose device clock runs a few minutes fast gets a negative
  // `elapsed`, is treated as a bot, sees the success screen, and no email is ever sent.
  it("does not silently drop a real customer whose device clock is a few minutes fast", async () => {
    // Took 5 minutes to fill the form, device clock 10 minutes ahead of the server.
    const startedAt = NOW.getTime() - 5 * 60_000 + 10 * 60_000;
    const result = await submitBooking(
      null,
      form({ startedAt: String(startedAt), company_website: "" }),
    );
    expect(result?.ok).toBe(true);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  // Regression: Number(formData.get("startedAt")) is Number(null) === 0 when the field is
  // missing, which is finite and makes `elapsed` huge, so a bot that omits the field skips
  // the timing check entirely.
  it("treats a submission without startedAt as automated", async () => {
    const fd = new FormData();
    fd.set("payload", JSON.stringify(payload));
    const result = await submitBooking(null, fd);
    expect(result?.ok).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
