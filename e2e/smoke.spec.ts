import { expect, test, type Page } from "@playwright/test";
import { services } from "../src/data/services";
import { staticRoutes } from "../src/lib/seo/routes";

/** Every public page, plus one detail page per service. */
const pages = [...staticRoutes.map((r) => r.path), ...services.map((s) => `/services/${s.slug}`)];

/** Collect console errors and uncaught exceptions for the lifetime of the page. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

test.describe("pages render cleanly", () => {
  for (const path of pages) {
    test(`${path} returns 200 with one h1, metadata and no errors`, async ({ page }) => {
      const errors = trackErrors(page);

      const response = await page.goto(path);
      expect(response?.status(), `status for ${path}`).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();

      await expect(page).toHaveTitle(/\S/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S.{20,}/);
      // Pages that override openGraph without images lose the site-wide social card.
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
        "content",
        /^https?:\/\//,
      );

      await page.waitForLoadState("networkidle");
      expect(errors, `errors on ${path}`).toEqual([]);
    });
  }
});

test.describe("crawler files", () => {
  test("sitemap.xml lists every page", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const path of pages) {
      const suffix = path === "/" ? "/</loc>" : `${path}</loc>`;
      expect(xml, `sitemap entry for ${path}`).toContain(suffix);
    }
  });

  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/User-Agent: \*/i);
    expect(body).toContain("/sitemap.xml");
  });

  test("social image, icons and manifest are served", async ({ request }) => {
    const pngs = [
      "/opengraph-image",
      "/twitter-image",
      "/icon.png",
      "/apple-icon.png",
      "/icon-192.png",
      "/icon-512.png",
    ];
    for (const path of pngs) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
    }
    const manifest = await request.get("/manifest.webmanifest");
    expect(manifest.status()).toBe(200);
    for (const icon of (await manifest.json()).icons as { src: string }[]) {
      const response = await request.get(new URL(icon.src, `${manifest.url()}`).pathname);
      expect(response.status(), icon.src).toBe(200);
    }
  });

  test("security headers are set", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});

test("unknown routes return 404 with a helpful page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toBeVisible();
});
