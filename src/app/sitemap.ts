// Required for static export (output: "export"); harmless on Node hosts.
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { galleryItems } from "@/data/gallery";
import { serviceRoute, staticRoutes } from "@/lib/seo/routes";
import { siteUrl } from "@/lib/seo/url";

/**
 * /sitemap.xml. Static routes come from `src/lib/seo/routes.ts`, service detail pages
 * from `src/data/services.ts`. Gallery and service photos are listed as image entries
 * so they can surface in Google Images.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const galleryImages = [...new Set(galleryItems.map((item) => siteUrl(item.src)))];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: siteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.path === "/gallery" ? { images: galleryImages } : {}),
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: siteUrl(serviceRoute(service.slug)),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [siteUrl(service.image)],
  }));

  return [...pages, ...servicePages];
}
