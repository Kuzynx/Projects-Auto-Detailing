/**
 * Public, indexable static routes. Used by `app/sitemap.ts` and the e2e smoke test,
 * so adding a page here gets it into the sitemap and under test in one place.
 * Dynamic service pages (`/services/[slug]`) are derived from `@/data/services`.
 *
 * Keep this file dependency-free: Playwright imports it directly.
 */
export type ChangeFrequency =
  "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface StaticRoute {
  path: `/${string}`;
  changeFrequency: ChangeFrequency;
  priority: number;
}

export const staticRoutes: readonly StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export const serviceRoute = (slug: string) => `/services/${slug}` as const;
