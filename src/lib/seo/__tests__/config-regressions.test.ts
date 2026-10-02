import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
// Next's own resolver for `alternates.canonical` / `openGraph.url`.
import { resolveAbsoluteUrlWithPathname } from "next/dist/lib/metadata/resolvers/resolve-url";

const PAGES_ORIGIN = "https://user.github.io";
const BASE = "/Projects-Auto-Detailing";
const PAGES_SITE = `${PAGES_ORIGIN}${BASE}`;

/** Re-import modules with env vars as the GitHub Pages workflow sets them at build time. */
async function withStaticExportEnv() {
  vi.resetModules();
  vi.stubEnv("STATIC_EXPORT", "true");
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", BASE);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", PAGES_SITE);
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("sub-path hosting (GitHub Pages)", () => {
  // Regression: src/components/services/structured-data.ts builds URLs with `new URL(path, base)`,
  // which drops the /<repo> base path, so /services, /pricing and /services/[slug] JSON-LD
  // point at 404s and the provider @id no longer matches the business node id.
  it("services structured-data URLs keep the base path, like the shared siteUrl", async () => {
    await withStaticExportEnv();
    const services = await import("@/components/services/structured-data");
    const seo = await import("@/lib/seo/url");
    const { jsonLdIds } = await import("@/lib/seo/json-ld");

    expect(services.siteUrl("/services/basic-wash")).toBe(seo.siteUrl("/services/basic-wash"));
    expect(services.providerJsonLd()["@id"]).toBe(jsonLdIds.business);
  });

  // Regression: manifest start_url/scope/icons are root-absolute, so under /<repo>/ the
  // installed app opens https://<user>.github.io/ and every icon 404s.
  it("manifest start_url and icons resolve inside the site", async () => {
    await withStaticExportEnv();
    const { default: manifest } = await import("@/app/manifest");
    const m = manifest();
    const manifestUrl = `${PAGES_SITE}/manifest.webmanifest`;
    const inside = (u: string) => new URL(u, manifestUrl).href.startsWith(`${PAGES_SITE}/`);

    expect(inside(m.start_url ?? "")).toBe(true);
    for (const icon of m.icons ?? []) expect(inside(icon.src), icon.src).toBe(true);
  });

  // Regression: with trailingSlash: true Next appends "/" to canonical and og:url, but the
  // sitemap lists the slash-less URLs, which GitHub Pages 301-redirects.
  it("sitemap URLs equal the canonical URLs Next emits", async () => {
    await withStaticExportEnv();
    const { default: sitemap } = await import("@/app/sitemap");
    const metadataBase = new URL(PAGES_SITE);

    for (const entry of sitemap()) {
      const path = new URL(entry.url).pathname.slice(BASE.length) || "/";
      const canonical = resolveAbsoluteUrlWithPathname(path, metadataBase, path, {
        trailingSlash: true,
        isStaticMetadataRouteFile: false,
      });
      expect(entry.url).toBe(canonical);
    }
  });
});

describe("structured data coverage", () => {
  // Regression: localBusinessJsonLd() (the AutoWash/LocalBusiness node with hours, geo,
  // areaServed and phone) is never rendered, so every `provider: { "@id": ".../#business" }`
  // reference points at a node that does not exist on any page.
  it("the LocalBusiness node is rendered by some page or layout", () => {
    const callers = [...sourceFiles("src/app"), ...sourceFiles("src/components")].filter((f) =>
      readFileSync(f, "utf8").includes("localBusinessJsonLd("),
    );
    expect(callers).not.toEqual([]);
  });

  // Regression: about/contact/faq JSON-LD use absoluteUrl() from @/lib/utils, which falls back
  // to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is unset (siteConfig.url falls back to
  // the live domain), so crawler-facing URLs can ship as localhost.
  it("crawler-facing JSON-LD URLs use the same origin as canonical metadata", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const { absoluteUrl } = await import("@/lib/utils");
    const { siteUrl } = await import("@/lib/seo/url");
    const pagesUsingAbsoluteUrl = sourceFiles("src/app").filter((f) =>
      /\babsoluteUrl\(/.test(readFileSync(f, "utf8")),
    );
    // Either the pages stop using absoluteUrl, or both helpers agree on the fallback origin.
    if (pagesUsingAbsoluteUrl.length > 0) {
      expect(absoluteUrl("/faq"), pagesUsingAbsoluteUrl.join(", ")).toBe(siteUrl("/faq"));
    }
  });
});

describe("legal copy matches site facts", () => {
  // Regression: the privacy policy says the site links to "our Google Business Profile", but
  // siteConfig.social has no Google profile (only Instagram).
  it("privacy policy only mentions a Google Business Profile when one is configured", async () => {
    const { siteConfig } = await import("@/config/site");
    const privacy = readFileSync("src/app/privacy/page.tsx", "utf8");
    if (/Google Business Profile/.test(privacy)) {
      expect(siteConfig.social.google).toBeTruthy();
    }
  });
});

describe("sitemap image entries", () => {
  // Regression: sitemap.ts lists every galleryItems entry (33 licensed stock photos plus 4 client
  // photos) as images of /gallery, but /gallery renders clientGalleryItems only. Google is told
  // stock exotics are this business's work, and the URLs are not on the page.
  it("lists only the photos /gallery actually shows", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const { clientGalleryItems } = await import("@/data/gallery");
    const { siteUrl } = await import("@/lib/seo/url");
    const gallery = sitemap().find((e) =>
      new URL(e.url).pathname.replace(/\/$/, "").endsWith("/gallery"),
    );
    const shown = new Set(clientGalleryItems.map((item) => siteUrl(item.src)));
    const notShown = (gallery?.images ?? []).filter((src) => !shown.has(src));
    expect(notShown).toEqual([]);
  });
});
