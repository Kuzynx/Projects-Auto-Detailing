/**
 * Static-export contact delivery (aliased over src/app/contact/actions.ts when STATIC_EXPORT=true).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initialContactState } from "@/lib/contact/schema";

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const valid = {
  name: "Jordan Reyes",
  email: "jordan@example.com",
  phone: "",
  vehicle: "2021 Toyota Camry",
  topic: "quote",
  message: "Please quote a full deluxe for my SUV.",
};

describe("static contact delivery", () => {
  const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));

  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("texts the message to the shop's number when no endpoint is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_FORM_ENDPOINT", "");
    const { submitContact } = await import("../contact-static");
    const state = await submitContact(initialContactState, formData(valid));
    expect(state.status).toBe("success");
    expect(state.delivery).toBe("sms");
    expect(state.smsHref).toMatch(/^sms:\+18402044176\?&body=/);
    const body = decodeURIComponent(state.smsHref!.split("&body=")[1]!);
    expect(body).toBe(state.smsBody);
    // A text has no subject line, so the subject leads; empty optional fields are left out.
    expect(body.split("\n")[0]).toMatch(/from Jordan Reyes via the website$/);
    expect(body).toContain("Vehicle: 2021 Toyota Camry");
    expect(body).not.toContain("Phone:");
    expect(body.endsWith("\n\nPlease quote a full deluxe for my SUV.")).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to the endpoint when one is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_FORM_ENDPOINT", "https://forms.example.com/f/abc");
    const { submitContact } = await import("../contact-static");
    const state = await submitContact(initialContactState, formData(valid));
    expect(state).toMatchObject({ status: "success", delivery: "endpoint" });
    expect(state.smsHref).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
