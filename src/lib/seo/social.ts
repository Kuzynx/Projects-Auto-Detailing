import { siteConfig } from "@/config/site";

/**
 * Social card metadata. Kept apart from the renderer (`og-image.tsx`) so the alt/size
 * exports Next reads into every page's <head> do not pull `next/og` into page bundles.
 */
export const socialImageSize = { width: 1200, height: 630 };

export const socialImageAlt = `${siteConfig.name} logo beside the tagline "${siteConfig.tagline}" Premium auto detailing in ${siteConfig.address.city}, ${siteConfig.address.state}.`;
