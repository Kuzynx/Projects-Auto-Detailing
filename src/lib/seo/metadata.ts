import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export interface BuildMetadataOptions {
  /** Page title. The root layout's template appends ` | ${siteConfig.name}`. */
  title: string;
  description: string;
  /** Route path, e.g. "/services/full-deluxe". Used for canonical and og:url. */
  path: `/${string}`;
  /** Social image path or absolute URL. Defaults to the generated `/opengraph-image`. */
  image?: string;
  imageAlt?: string;
  /** Use the title verbatim (skip the layout template), e.g. for the home page. */
  absoluteTitle?: boolean;
  /** Keep the page out of search results (thank-you pages, previews). */
  noIndex?: boolean;
  openGraphType?: "website" | "article";
}

/**
 * Site-wide social card. Node deploys use the generated `/opengraph-image` route. Static
 * export (GitHub Pages) uses a committed PNG instead: the exported route is an extensionless
 * file that static hosts serve with a generic content type, which link previews may reject.
 * Regenerate the PNG after a brand change with `pnpm build && cp out/opengraph-image public/images/og-card.png`
 * (from a STATIC_EXPORT=true build).
 */
export const defaultOgImage = {
  url: process.env.STATIC_EXPORT === "true" ? "/images/og-card.png" : "/opengraph-image",
  width: 1200,
  height: 630,
} as const;
const DEFAULT_OG_IMAGE = defaultOgImage;

/**
 * Consistent per-page metadata: title, description, canonical, Open Graph and Twitter.
 *
 * Why always set `openGraph.images`: Next.js merges metadata shallowly, so a page that
 * defines `openGraph` without `images` silently drops the root `opengraph-image`.
 *
 *   export const metadata = buildMetadata({
 *     title: "Full Deluxe Package",
 *     description: "...",
 *     path: "/services/full-deluxe",
 *     image: service.image,
 *   });
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  absoluteTitle = false,
  noIndex = false,
  openGraphType = "website",
}: BuildMetadataOptions): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const alt = imageAlt ?? `${siteConfig.name}: ${title}`;
  const images = [image ? { url: image, alt } : { ...DEFAULT_OG_IMAGE, alt }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: openGraphType,
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((img) => ({ url: img.url, alt: img.alt })),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
