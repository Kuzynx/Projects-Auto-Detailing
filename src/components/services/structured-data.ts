import { siteConfig } from "@/config/site";
import {
  bookingUrl,
  priceRange,
  serviceCategories,
  vehicleSizes,
  type Service,
  type VehicleSize,
} from "@/data/services";

/** Absolute URL on the canonical site origin. */
export function siteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };
}

/** Reference to the business node (the SEO agent's LocalBusiness uses the same @id). */
export function providerJsonLd() {
  return {
    "@type": "AutomotiveBusiness",
    "@id": siteUrl("/#business"),
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
  };
}

/**
 * Price fields for one Offer. Open-ended prices ("from $100", "$150+") are
 * expressed as a minimum price rather than a fixed one.
 */
export function offerPriceJsonLd(
  service: Pick<Service, "price" | "priceNote" | "priceSuffix">,
  size: VehicleSize,
) {
  const amount = service.price[size];
  if (service.priceNote?.[size] || service.priceSuffix === "starting") {
    return {
      priceCurrency: "USD",
      priceSpecification: { "@type": "PriceSpecification", minPrice: amount, priceCurrency: "USD" },
    };
  }
  return { price: amount, priceCurrency: "USD" };
}

/** Full Service node with one Offer per vehicle size. */
export function serviceJsonLd(service: Service) {
  const path = `/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": siteUrl(`${path}#service`),
    name: service.name,
    description: service.description,
    serviceType:
      serviceCategories.find((c) => c.id === service.category)?.label ?? service.category,
    url: siteUrl(path),
    image: siteUrl(service.image),
    provider: providerJsonLd(),
    areaServed: siteConfig.serviceArea.map((name) => ({ "@type": "City", name })),
    offers: vehicleSizes.map((size) => ({
      "@type": "Offer",
      name: `${service.name}, ${size.label}`,
      ...offerPriceJsonLd(service, size.id),
      availability: "https://schema.org/InStock",
      url: siteUrl(bookingUrl({ service: service.slug, size: size.id })),
      eligibleQuantity: { "@type": "QuantitativeValue", value: 1, unitText: size.description },
    })),
  };
}

/** Compact Service node with an AggregateOffer, for list pages. */
export function serviceSummaryJsonLd(service: Service) {
  const { min, max } = priceRange(service);
  return {
    "@type": "Service",
    name: service.name,
    description: service.tagline,
    url: siteUrl(`/services/${service.slug}`),
    image: siteUrl(service.image),
    provider: { "@id": siteUrl("/#business"), name: siteConfig.name },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: min,
      highPrice: max,
      priceCurrency: "USD",
      offerCount: vehicleSizes.length,
    },
  };
}
