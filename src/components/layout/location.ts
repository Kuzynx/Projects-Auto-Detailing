import { siteConfig } from "@/config/site";

/*
 * Location display rules for the shell. The business is mobile only today, so no
 * street address or map link is shown. Setting `siteConfig.address.street`
 * and `mobileOnly: false` brings the address and map link back everywhere.
 */
const { address } = siteConfig;

/** True only when there is a customer-facing location to visit. */
export const hasStorefront: boolean = !siteConfig.mobileOnly && address.street.trim().length > 0;

/** "Victorville, CA" */
export const baseLocation = `${address.city}, ${address.state}`;

/** "Victorville, CA 92392" plus the street when there is one. */
export const fullAddress = hasStorefront
  ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  : `${address.city}, ${address.state} ${address.zip}`;

/** Google Maps search link for the storefront, or null when mobile only. */
export const mapsHref: string | null = hasStorefront
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.name}, ${fullAddress}`)}`
  : null;

/** One-line summary of where the work happens, e.g. for footers and menus. */
export const coverageLine = hasStorefront
  ? `Mobile and in-shop detailing across the ${siteConfig.region}.`
  : `Mobile only. We come to you anywhere in the ${siteConfig.region}.`;
