import { expect, test } from "@playwright/test";

/**
 * Regression specs for the GitHub Pages static export. They need a served `out/` folder, so
 * they are skipped unless STATIC_BASE_URL points at it, e.g.
 *
 *   STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/Projects-Auto-Detailing \
 *     NEXT_PUBLIC_SITE_URL=https://kuzynx.github.io/Projects-Auto-Detailing pnpm build
 *   # serve ./out under /Projects-Auto-Detailing/ with a GitHub-Pages-like static server, then
 *   STATIC_BASE_URL=http://localhost:4000/Projects-Auto-Detailing pnpm exec playwright test qa-static-export
 */
const base = process.env.STATIC_BASE_URL?.replace(/\/$/, "");

test.describe("static export (GitHub Pages)", () => {
  test.skip(!base, "set STATIC_BASE_URL to the served static export");

  // Regression: the generated <link rel="icon" href="/icon?..."> and
  // <link rel="apple-touch-icon" href="/apple-icon?..."> ignore NEXT_PUBLIC_BASE_PATH, so on
  // https://<user>.github.io/<repo>/ they point at the host root and 404: no favicon in tabs
  // or bookmarks and no home-screen icon. (The exported files are also extensionless, which
  // GitHub Pages serves as application/octet-stream.)
  test("favicon and apple-touch-icon resolve under the base path", async ({ page }) => {
    await page.goto(`${base}/`);
    const results = await page.evaluate(async () => {
      const links = [
        ...document.querySelectorAll<HTMLLinkElement>(
          'link[rel="icon"], link[rel="apple-touch-icon"]',
        ),
      ];
      return Promise.all(
        links.map(async (link) => ({ href: link.href, status: (await fetch(link.href)).status })),
      );
    });
    expect(results.length).toBeGreaterThan(0);
    for (const { href, status } of results) expect(status, href).toBe(200);
  });

  // Regression: with no form endpoint, the contact form opens an sms: link and nothing has
  // been sent yet, but the success panel still says "Message received. Thank you." (the
  // booking confirmation was fixed to say "One more step: press Send"; contact was not).
  test("contact text fallback does not claim the message was received", async ({ page }) => {
    await page.goto(`${base}/contact/`);
    const form = page.locator("form").filter({ has: page.locator("[name=message]") });
    await form.locator("[name=name]").fill("Jordan Reyes");
    await form.locator("[name=email]").fill("jordan@example.com");
    await form.locator("[name=message]").fill("Please quote a full deluxe for my SUV.");
    await form.getByRole("button", { name: /send message/i }).click();
    const status = page.getByRole("status");
    await expect(status.getByRole("link", { name: /open the text here/i })).toHaveAttribute(
      "href",
      /^sms:\+18402044176\?&body=/,
    );
    await expect(status).not.toContainText("Message received");
  });
});
