import { siteConfig } from "@/config/site";
import { joinUrl } from "@/lib/utils";

/**
 * Absolute URL on the canonical production origin (`siteConfig.url`, which reads
 * NEXT_PUBLIC_SITE_URL and falls back to the live domain). Use this for anything a
 * crawler reads: canonical links, sitemap, JSON-LD. Unlike `absoluteUrl` from
 * `@/lib/utils`, it never falls back to localhost when the env var is missing.
 */
export function siteUrl(path = "/") {
  return joinUrl(siteConfig.url, path);
}
