import { afterEach, describe, expect, it, vi } from "vitest";

// GitHub Pages deploys set NEXT_PUBLIC_SITE_URL to origin + base path
// (.github/workflows/deploy-pages.yml), so every crawler URL must keep the sub-path.
const PAGES_URL = "https://example.github.io/Projects-Auto-Detailing";

async function loadWithSiteUrl(url: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", url);
  const sd = await import("@/components/services/structured-data");
  const seo = await import("@/lib/seo/json-ld");
  const data = await import("@/data/services");
  return { sd, seo, data };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("services structured data under a sub-path deploy", () => {
  // Regression: structured-data.ts siteUrl used `new URL(path, siteConfig.url)`, which drops
  // the base path, so Service/Offer/BreadcrumbList URLs on /services and /pricing 404 on Pages.
  it("keeps the base path in absolute URLs", async () => {
    const { sd } = await loadWithSiteUrl(PAGES_URL);
    expect(sd.siteUrl("/services/basic-wash")).toBe(`${PAGES_URL}/services/basic-wash`);
  });

  // Regression: the provider @id must match the LocalBusiness node's @id from @/lib/seo/json-ld,
  // otherwise the Service nodes point at a business node that does not exist.
  it("references the same business @id as the site-wide LocalBusiness node", async () => {
    const { sd, seo, data } = await loadWithSiteUrl(PAGES_URL);
    const service = data.getService("full-deluxe")!;
    const node = sd.serviceJsonLd(service);
    expect(node.provider["@id"]).toBe(seo.jsonLdIds.business);
  });
});
