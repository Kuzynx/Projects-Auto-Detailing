import { beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import { buildContactEmail } from "../email";
import { HONEYPOT_FIELD, contactSchema, initialContactState } from "../schema";

const sendEmail = vi.fn();
vi.mock("@/lib/email", () => ({ sendEmail: (...args: unknown[]) => sendEmail(...args) }));

const valid = {
  name: "  Jordan Avery ",
  email: " jordan@example.com ",
  phone: "",
  topic: "quote",
  vehicle: "",
  message: "Looking for a ceramic coating quote on a black Model 3.",
};

function toFormData(values: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) fd.set(key, value);
  return fd;
}

describe("contactSchema", () => {
  it("trims input and drops empty optional fields", () => {
    const result = contactSchema.parse(valid);
    expect(result).toEqual({
      name: "Jordan Avery",
      email: "jordan@example.com",
      topic: "quote",
      message: valid.message,
    });
  });

  it("rejects bad email, short message, unknown topic and short phone", () => {
    const result = contactSchema.safeParse({
      ...valid,
      email: "nope",
      message: "hi",
      topic: "spam",
      phone: "123",
    });
    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(expect.arrayContaining(["email", "message", "topic", "phone"]));
  });

  it("accepts a formatted US phone number", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "(760) 555-0100" }).success).toBe(true);
  });
});

describe("buildContactEmail", () => {
  it("escapes HTML and uses the business name", () => {
    const email = buildContactEmail(
      contactSchema.parse({ ...valid, message: "<script>alert(1)</script> please" }),
    );
    expect(email.subject).toContain(siteConfig.name);
    expect(email.subject).toContain("Quote");
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.text).toContain("<script>alert(1)</script> please");
  });
});

describe("submitContact", () => {
  beforeEach(() => {
    sendEmail.mockReset();
    sendEmail.mockResolvedValue({ ok: true, simulated: true });
  });

  it("sends to the business with the customer as reply-to", async () => {
    const { submitContact } = await import("@/app/contact/actions");
    const state = await submitContact(initialContactState, toFormData(valid));
    expect(state.status).toBe("success");
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: siteConfig.email, replyTo: "jordan@example.com" }),
    );
  });

  it("returns field errors and echoes values when invalid", async () => {
    const { submitContact } = await import("@/app/contact/actions");
    const state = await submitContact(initialContactState, toFormData({ ...valid, email: "bad" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email?.[0]).toMatch(/valid email/i);
    expect(state.values?.name).toBe(valid.name);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const { submitContact } = await import("@/app/contact/actions");
    const state = await submitContact(
      initialContactState,
      toFormData({ ...valid, [HONEYPOT_FIELD]: "http://spam" }),
    );
    expect(state.status).toBe("success");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("reports a friendly error when the provider fails", async () => {
    sendEmail.mockResolvedValue({ ok: false, error: "provider down" });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { submitContact } = await import("@/app/contact/actions");
    const state = await submitContact(initialContactState, toFormData(valid));
    expect(state.status).toBe("error");
    expect(state.message).toContain(siteConfig.phone);
  });
});
