import { siteConfig } from "@/config/site";
import { joinUrl } from "@/lib/utils";

/** "/gallery" -> true, "/images/a.jpg" or "/sitemap.xml" -> false. */
function isPagePath(path: string) {
  const last = path.split("/").pop() ?? "";
  return !last.includes(".");
}

/**
 * Absolute URL on the canonical production origin (`siteConfig.url`, which reads
 * NEXT_PUBLIC_SITE_URL and falls back to the live domain). Use this for anything a
 * crawler reads: canonical links, sitemap, JSON-LD. Unlike `absoluteUrl` from
 * `@/lib/utils`, it never falls back to localhost when the env var is missing.
 *
 * Static export builds use `trailingSlash: true`, so page paths get a trailing slash
 * there to match the canonical URLs Next emits (files, queries and fragments do not).
 */
export function siteUrl(path = "/") {
  const url = joinUrl(siteConfig.url, path);
  if (process.env.STATIC_EXPORT !== "true" || /[?#]/.test(path) || !isPagePath(path)) return url;
  return url.endsWith("/") ? url : `${url}/`;
}
