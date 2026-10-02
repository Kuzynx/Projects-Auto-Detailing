// Required for static export (output: "export"); harmless on Node hosts.
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { clientGalleryItems } from "@/data/gallery";
import { serviceRoute, staticRoutes } from "@/lib/seo/routes";
import { siteUrl } from "@/lib/seo/url";

/**
 * /sitemap.xml. Static routes come from `src/lib/seo/routes.ts`, service detail pages
 * from `src/data/services.ts`. Only photos /gallery actually shows (the client's own work)
 * are listed as its image entries. No `lastModified`: a build timestamp on every URL
 * tells crawlers nothing and makes every deploy look like a site-wide change.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const galleryImages = [...new Set(clientGalleryItems.map((item) => siteUrl(item.src)))];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: siteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.path === "/gallery" ? { images: galleryImages } : {}),
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: siteUrl(serviceRoute(service.slug)),
    changeFrequency: "monthly",
    priority: 0.8,
    images: [siteUrl(service.image)],
  }));

  return [...pages, ...servicePages];
}
