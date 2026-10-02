/**
 * Structured data (schema.org JSON-LD).
 *
 * Render with <JsonLd data={...} /> in any Server Component. Builders below derive every
 * fact from `@/config/site` and `@/data/*`, so business details are never hardcoded.
 *
 *   <JsonLd data={localBusinessJsonLd()} />           // root layout or home page
 *   <JsonLd data={serviceJsonLd(service)} />          // /services/[slug]
 *   <JsonLd data={faqJsonLd(faqs)} />                 // /faq
 *   <JsonLd data={breadcrumbJsonLd([{ label: "Services", href: "/services" }, { label: service.name }])} />
 *
 * Validate output at https://validator.schema.org and https://search.google.com/test/rich-results.
 */
import { siteConfig } from "@/config/site";
import { serviceCategories, vehicleSizes, type Service } from "@/data/services";
import { siteUrl } from "./url";

export type JsonLdNode = Record<string, unknown>;
export type JsonLdData = JsonLdNode | JsonLdNode[];

const CONTEXT = "https://schema.org";

/**
 * Stable node ids so separate JSON-LD blocks can reference each other, e.g.
 * `provider: { "@id": jsonLdIds.business }`. Equals `${siteConfig.url}/#business`.
 */
export const jsonLdIds = {
  business: siteUrl("/#business"),
  website: siteUrl("/#website"),
} as const;

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value containing "</script>" can never break out of the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Opening hours                                                       */
/* ------------------------------------------------------------------ */

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type DayOfWeek = (typeof DAYS)[number];

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: DayOfWeek[];
  opens: string;
  closes: string;
}

/** "8:00 AM" -> "08:00", "6:30 PM" -> "18:30". Returns null for "Closed" or unparseable input. */
export function to24Hour(time: string): string | null {
  const match = /^\s*(\d{1,2})(?::(\d{2}))?\s*([AaPp])\.?[Mm]\.?\s*$/.exec(time);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "P") hours += 12;
  return `${String(hours).padStart(2, "0")}:${match[2] ?? "00"}`;
}

/** "Monday – Friday" -> Monday..Friday, "Saturday" -> [Saturday], "Mon, Wed" -> [Monday, Wednesday]. */
export function expandDays(label: string): DayOfWeek[] {
  const find = (part: string) =>
    DAYS.find((d) => d.toLowerCase().startsWith(part.trim().toLowerCase().slice(0, 3)));

  return label.split(",").flatMap((chunk) => {
    const [startPart, endPart] = chunk.split(/\s*[–—-]\s*|\s+to\s+/i);
    const start = startPart ? find(startPart) : undefined;
    if (!start) return [];
    const end = endPart ? find(endPart) : start;
    if (!end) return [start];
    const from = DAYS.indexOf(start);
    const to = DAYS.indexOf(end);
    return to >= from ? DAYS.slice(from, to + 1) : [...DAYS.slice(from), ...DAYS.slice(0, to + 1)];
  });
}

/** Convert `siteConfig.hours` rows into schema.org specs. Closed days are omitted, as Google expects. */
export function openingHoursSpecification(
  hours: readonly { days: string; open: string; close: string }[] = siteConfig.hours,
): OpeningHoursSpecification[] {
  return hours.flatMap((row) => {
    const opens = to24Hour(row.open);
    const closes = to24Hour(row.close);
    const dayOfWeek = expandDays(row.days);
    if (!opens || !closes || dayOfWeek.length === 0) return [];
    return [{ "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes }];
  });
}

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

type Address = { street: string; city: string; state: string; zip: string; country: string };

/**
 * PostalAddress for the business. A mobile-only business has no public street address,
 * so `streetAddress` is omitted when empty (Google treats it as a service-area business).
 */
export function postalAddress(address: Address = siteConfig.address) {
  const { street, city, state, zip, country } = address;
  return {
    "@type": "PostalAddress",
    ...(street.trim() ? { streetAddress: street } : {}),
    addressLocality: city,
    addressRegion: state,
    postalCode: zip,
    addressCountry: country,
  };
}

function areaServed() {
  return siteConfig.serviceArea.map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: siteConfig.address.state },
  }));
}

function priceBounds(service: Service) {
  const prices = vehicleSizes.map((size) => service.price[size.id]);
  return { low: Math.min(...prices), high: Math.max(...prices) };
}

function categoryLabel(service: Service) {
  return serviceCategories.find((c) => c.id === service.category)?.label ?? service.category;
}

/**
 * The business itself. schema.org has no "AutoDetailing" type; `AutoWash` is the closest
 * subtype, listed with its parents `AutomotiveBusiness` and `LocalBusiness` so every
 * parser (and other pages' `provider` references by `@id`) resolves it.
 */
export function localBusinessJsonLd(services: readonly Service[] = []): JsonLdNode {
  const { social } = siteConfig;
  const node: JsonLdNode = {
    "@context": CONTEXT,
    "@type": ["AutoWash", "AutomotiveBusiness", "LocalBusiness"],
    "@id": jsonLdIds.business,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    url: siteUrl("/"),
    logo: siteUrl(siteConfig.logo),
    image: siteUrl(siteConfig.logo),
    telephone: siteConfig.phoneHref.replace(/^tel:/, ""),
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    priceRange: "$$",
    currenciesAccepted: "USD",
    foundingDate: String(siteConfig.founded),
    founder: { "@type": "Person", name: siteConfig.founder.name },
    address: postalAddress(),
    geo: { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lng },
    areaServed: areaServed(),
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: Object.values(social).filter((url): url is string => Boolean(url)),
  };

  // A map pin only makes sense when customers can visit a location.
  if (!siteConfig.mobileOnly && siteConfig.address.street) {
    node.hasMap = `https://www.google.com/maps/search/?api=1&query=${siteConfig.geo.lat},${siteConfig.geo.lng}`;
  }

  if (services.length > 0) {
    node.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Detailing services",
      itemListElement: services.map((service) => {
        const { low } = priceBounds(service);
        return {
          "@type": "Offer",
          price: low,
          priceCurrency: "USD",
          url: siteUrl(`/services/${service.slug}`),
          itemOffered: { "@type": "Service", name: service.name, description: service.tagline },
        };
      }),
    };
  }

  return node;
}

/** A single detailing service with its price range across vehicle sizes. */
export function serviceJsonLd(service: Service): JsonLdNode {
  const { low, high } = priceBounds(service);
  const url = siteUrl(`/services/${service.slug}`);
  return {
    "@context": CONTEXT,
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    serviceType: categoryLabel(service),
    description: service.description,
    url,
    image: siteUrl(service.image),
    provider: { "@type": "AutomotiveBusiness", "@id": jsonLdIds.business, name: siteConfig.name },
    areaServed: areaServed(),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: low,
      highPrice: high,
      offerCount: vehicleSizes.length,
      availability: "https://schema.org/InStock",
      url,
    },
  };
}

/** FAQPage rich result. Pass the same items you render on the page (Google requires parity). */
export function faqJsonLd(items: readonly { question: string; answer: string }[]): JsonLdNode {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page (last crumb), matching the `PageHero` breadcrumbs contract. */
  href?: string;
}

/**
 * BreadcrumbList. Accepts the same `{ label, href? }[]` array as `PageHero` breadcrumbs.
 * A "Home" crumb is prepended unless the trail already starts at "/".
 */
export function breadcrumbJsonLd(
  items: readonly BreadcrumbItem[],
  { includeHome = true }: { includeHome?: boolean } = {},
): JsonLdNode {
  const trail: BreadcrumbItem[] =
    includeHome && items[0]?.href !== "/" ? [{ label: "Home", href: "/" }, ...items] : [...items];

  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: siteUrl(crumb.href) } : {}),
    })),
  };
}

/** WebSite node: gives Google the canonical site name. */
export function websiteJsonLd(): JsonLdNode {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": jsonLdIds.website,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteUrl("/"),
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: { "@id": jsonLdIds.business },
  };
}

/** Combine several nodes into one `@graph` block (strips per-node `@context`). */
export function jsonLdGraph(...nodes: JsonLdNode[]): JsonLdNode {
  return {
    "@context": CONTEXT,
    "@graph": nodes.map((node) => {
      const copy = { ...node };
      delete copy["@context"];
      return copy;
    }),
  };
}
