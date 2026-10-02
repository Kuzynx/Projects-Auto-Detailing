// Required for static export (output: "export"); harmless on Node hosts.
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * /manifest.webmanifest. Colors match `--color-bg` in globals.css.
 * URLs are relative to the manifest, so they stay inside the site when it is served
 * from a sub-path (GitHub Pages: /<repo>/manifest.webmanifest).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["business", "lifestyle"],
    // Static files from `pnpm icons` (scripts/generate-icons.mjs).
    icons: [
      { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
