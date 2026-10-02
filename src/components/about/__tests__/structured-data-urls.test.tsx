import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/*
 * Regression: /about, /faq, /gallery and /contact build their JSON-LD with `absoluteUrl` from
 * `@/lib/utils`, which falls back to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is unset.
 * Canonicals, the sitemap and every other page's JSON-LD use `siteUrl` (`@/lib/seo/url`), which
 * falls back to the production domain, so a build without the env var ships structured data that
 * points crawlers at localhost. Fixed: these pages now use `siteUrl`.
 */
vi.stubGlobal(
  "IntersectionObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  },
);

describe("About page structured data", () => {
  it("never points at localhost when NEXT_PUBLIC_SITE_URL is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    vi.resetModules();
    const { default: AboutPage } = await import("@/app/about/page");
    const html = renderToString(<AboutPage />);
    expect(html).toContain('"@type":"AboutPage"');
    expect(html).not.toContain("localhost");
    vi.unstubAllEnvs();
  });
});
