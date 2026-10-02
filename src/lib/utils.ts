import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a USD amount with no cents when whole. */
export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Join a path onto a base URL, keeping any path the base already carries
 * (e.g. https://user.github.io/repo + /images/x => https://user.github.io/repo/images/x).
 * `new URL(path, base)` would drop the base path, which breaks sub-path hosting.
 */
export function joinUrl(base: string, path = "/") {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  const url = new URL(base);
  const prefix = url.pathname.replace(/\/+$/, "");
  // Collapse leading slashes so "//evil.example/x" can never escape the base origin.
  const suffix = `/${path.replace(/^\/+/, "")}`;
  return new URL(`${prefix}${suffix}`, url.origin).toString();
}

/** Build an absolute URL from the configured site origin. */
export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return joinUrl(base, path);
}
