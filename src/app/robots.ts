import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/url";

/**
 * /robots.txt. Vercel preview deployments (VERCEL_ENV=preview) are kept out of the
 * index entirely so staging copies never compete with the live site.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: siteUrl("/sitemap.xml"),
  };
}
