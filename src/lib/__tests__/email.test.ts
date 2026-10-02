import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const send = vi.fn(async () => ({ data: { id: "msg_1" }, error: null }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const message = { subject: "New booking", html: "<p>Hi</p>", text: "Hi" };

describe("sendEmail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    send.mockClear();
  });

  // The business has no inbox of its own (siteConfig.email is null), so a live deploy without
  // BOOKING_NOTIFY_EMAIL must fail loudly rather than report a booking as delivered.
  it("fails without a recipient when a provider is configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const { sendEmail } = await import("../email");
    const result = await sendEmail({ ...message, to: null });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/BOOKING_NOTIFY_EMAIL/);
    expect(send).not.toHaveBeenCalled();
  });

  it("logs instead of sending when no provider is configured, even without a recipient", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const { sendEmail } = await import("../email");
    expect(await sendEmail({ ...message, to: null })).toEqual({ ok: true, simulated: true });
  });

  it("sends through the provider when a recipient is set", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const { sendEmail } = await import("../email");
    const result = await sendEmail({ ...message, to: "owner@example.com" });
    expect(result).toEqual({ ok: true, id: "msg_1" });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: "owner@example.com" }));
  });
});
