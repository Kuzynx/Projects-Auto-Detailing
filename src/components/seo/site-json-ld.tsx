import { services } from "@/data/services";
import { JsonLd, jsonLdGraph, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";

/**
 * Site-wide structured data: the business node (`jsonLdIds.business`, with hours, geo,
 * areaServed and the service catalog) and the WebSite node, in one @graph.
 * Render once in the root layout so every page's `provider: { "@id": jsonLdIds.business }`
 * reference resolves.
 */
export function SiteJsonLd() {
  return <JsonLd data={jsonLdGraph(localBusinessJsonLd(services), websiteJsonLd())} />;
}
