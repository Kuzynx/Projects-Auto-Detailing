import { siteConfig } from "@/config/site";
import {
  bookingUrl,
  priceRange,
  serviceCategories,
  vehicleSizes,
  type Service,
  type VehicleSize,
} from "@/data/services";
import { breadcrumbJsonLd, jsonLdIds } from "@/lib/seo/json-ld";
import { siteUrl } from "@/lib/seo/url";

export { breadcrumbJsonLd, siteUrl };

/** Provider reference: only the `@id` of the site-wide LocalBusiness node from `@/lib/seo/json-ld`. */
export function providerJsonLd() {
  return { "@id": jsonLdIds.business };
}

function isOpenEnded(service: Pick<Service, "priceNote" | "priceSuffix">, size: VehicleSize) {
  return Boolean(service.priceNote?.[size]) || service.priceSuffix === "starting";
}

/**
 * Price fields for one Offer. Open-ended prices ("from $100", "$150+", "$75 starting")
 * are expressed as a minimum price rather than a fixed one.
 */
export function offerPriceJsonLd(
  service: Pick<Service, "price" | "priceNote" | "priceSuffix">,
  size: VehicleSize,
) {
  const amount = service.price[size];
  if (isOpenEnded(service, size)) {
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

/**
 * Compact Service node with an AggregateOffer, for list pages. `highPrice` is only reported
 * when every price is fixed; an open-ended top price ("$250+") is not a real maximum.
 */
export function serviceSummaryJsonLd(service: Service) {
  const { min, max } = priceRange(service);
  const anyOpenEnded = vehicleSizes.some((size) => isOpenEnded(service, size.id));
  return {
    "@type": "Service",
    name: service.name,
    description: service.tagline,
    url: siteUrl(`/services/${service.slug}`),
    image: siteUrl(service.image),
    provider: providerJsonLd(),
    offers: {
      "@type": "AggregateOffer",
      lowPrice: min,
      ...(anyOpenEnded ? {} : { highPrice: max }),
      priceCurrency: "USD",
      offerCount: vehicleSizes.length,
    },
  };
}
