import { expect, test } from "@playwright/test";

/**
 * Regression specs from the QA/security browser pass (2026-10). Each one reproduces a bug that
 * was proven in a real browser against `pnpm start`, and FAILS until that bug is fixed.
 */

type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean };

test.describe("layout stability", () => {
  // Regression: src/app/loading.tsx wraps every page in a Suspense boundary, so even fully
  // prerendered pages stream a 70vh skeleton first. On a 1440x900 desktop the footer paints
  // inside the first viewport and is then pushed below the fold when the real content swaps
  // in: one layout shift of ~0.21 on almost every page (Core Web Vitals "good" is < 0.1).
  test("static pages do not shift the footer on load (CLS < 0.1 at 1440x900)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) w.__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    for (const path of ["/privacy", "/faq", "/"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls, `CLS on ${path}`).toBeLessThan(0.1);
    }
    await context.close();
  });
});

test.describe("contact form resilience", () => {
  const fillContact = async (page: import("@playwright/test").Page) => {
    const form = page.locator("form").filter({ has: page.locator("[name=message]") });
    await form.locator("[name=name]").fill("Jordan Reyes");
    await form.locator("[name=email]").fill("jordan@example.com");
    await form.locator("[name=topic]").selectOption("fleet");
    await form.locator("[name=message]").fill("Please quote three work trucks every week.");
    return form;
  };

  // Regression: contact-form.tsx passes the Server Action straight to useActionState with no
  // try/catch (booking-flow.tsx wraps it). If the request fails (offline, flaky mobile data,
  // or a deploy that rotates Server Action IDs) the action rejects, the route error boundary
  // replaces the whole page with "Something went wrong" and the visitor's message is lost.
  test("a network failure on submit keeps the form and shows an error", async ({ page }) => {
    await page.goto("/contact");
    const form = await fillContact(page);
    await page.route("**/contact", (route) =>
      route.request().method() === "POST" ? route.abort("internetdisconnected") : route.continue(),
    );
    await form.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator("form [role=alert]")).toBeVisible();
    await expect(page.locator("[name=message]")).toHaveValue(
      "Please quote three work trucks every week.",
    );
  });

  // Regression: after a server-side error React resets the form and inputs fall back to
  // `defaultValue` (state.values). That works for text inputs, but the topic <select> only
  // honours its defaultValue on first mount, so it snaps back to "Quote" and a fleet enquiry
  // is resent under the wrong topic. Reproduced here by tampering with the POST so the server
  // rejects the message; the same happens when email delivery fails (Resend error) and with a
  // NEXT_PUBLIC_FORM_ENDPOINT that returns 5xx on the static build.
  test("a server-side error keeps the chosen topic", async ({ page }) => {
    await page.goto("/contact");
    const form = await fillContact(page);
    await page.route("**/contact", async (route) => {
      const request = route.request();
      if (request.method() !== "POST") return route.continue();
      const body = request.postDataBuffer()?.toString("utf8") ?? "";
      const tampered = body.replace(/(name="[^"]*message"\r\n\r\n)[\s\S]*?(\r\n--)/, "$1short$2");
      await route.continue({ postData: tampered });
    });
    await form.getByRole("button", { name: /send message/i }).click();
    await expect(form.getByText(/at least 10 characters/)).toBeVisible();
    await expect(form.locator("[name=topic]")).toHaveValue("fleet");
  });
});

test.describe("booking flow", () => {
  // Regression: firstErrorTarget() follows the field order in allBookingSteps (schema.ts:
  // size, year, make, model...), not the order on screen (make, model, year, color). With an
  // invalid year and empty make/model, focus jumps to Year, the third field, and screen-reader
  // users skip past the first two errors.
  test("vehicle step focuses the first invalid field on screen", async ({ page }) => {
    await page.goto("/book?service=basic-wash&size=car");
    await expect(page.locator("#bk-make")).toBeVisible();
    await page.locator("#bk-year").fill("19");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.locator("#bk-make-error")).toBeVisible();
    await expect(page.locator("#bk-make")).toBeFocused();
  });

  // Regression: durations are stored as "~1 hr" and the summary/emails prefix them with
  // "About", rendering "About ~3–4 hrs on site" (booking-summary.tsx and the "Time on site"
  // row in email-templates.ts).
  test("time on site does not read 'About ~'", async ({ page }) => {
    await page.goto("/book?service=full-deluxe&size=suv");
    const summary = page.getByRole("complementary", { name: "Booking summary" });
    await expect(summary).toContainText("hrs");
    await expect(summary).not.toContainText("About ~");
  });
});

test.describe("crawler files", () => {
  // Regression: only the metadata icon routes (/icon, /apple-icon) exist. Clients that ask for
  // the conventional /favicon.ico (RSS readers, link unfurlers, some crawlers) get an 86 KB
  // HTML 404 page instead of an icon.
  test("/favicon.ico serves an icon", async ({ request }) => {
    const response = await request.get("/favicon.ico");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/^image\//);
  });
});
