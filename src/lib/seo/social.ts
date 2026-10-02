import { siteConfig } from "@/config/site";

/**
 * Social card metadata. Kept apart from the renderer (`og-image.tsx`) so the alt/size
 * exports Next reads into every page's <head> do not pull `next/og` into page bundles.
 */
export const socialImageSize = { width: 1200, height: 630 };

/** "Mobile auto detailing · Victorville, CA": the eyebrow line on the card. */
export const socialLocationLine = `${siteConfig.mobileOnly ? "Mobile auto detailing" : "Auto detailing"} · ${siteConfig.address.city}, ${siteConfig.address.state}`;

export const socialImageAlt = `${siteConfig.name} logo beside the tagline "${siteConfig.tagline}" ${siteConfig.mobileOnly ? "Premium mobile" : "Premium"} auto detailing in ${siteConfig.address.city}, ${siteConfig.address.state} and the ${siteConfig.region}.`;

/** Bottom line of the card. Verifiable facts only: no ratings, review counts or volume claims. */
export const socialProofLine = [
  "Owner-operated",
  siteConfig.mobileOnly ? "Fully mobile" : null,
  `Since ${siteConfig.founded}`,
]
  .filter(Boolean)
  .join(" · ");

/**
 * Short service labels for the card, derived from the catalog names:
 * "Basic Package — Exterior Wash" -> "Exterior wash", "Working Truck" -> "Working truck".
 */
export function socialServiceLabels(list: readonly { name: string }[]) {
  return list.map(({ name }) => {
    const label = (name.split(/\s+[—–-]\s+/).pop() ?? name).trim();
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  });
}
