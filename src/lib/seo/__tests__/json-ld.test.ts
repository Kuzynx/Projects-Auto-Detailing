import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { getService, services } from "@/data/services";
import {
  JsonLd,
  breadcrumbJsonLd,
  expandDays,
  faqJsonLd,
  jsonLdGraph,
  jsonLdIds,
  localBusinessJsonLd,
  openingHoursSpecification,
  postalAddress,
  serviceJsonLd,
  to24Hour,
  websiteJsonLd,
} from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { socialProofLine, socialServiceLabels } from "@/lib/seo/social";

const origin = new URL(siteConfig.url).origin;

describe("opening hours helpers", () => {
  it("converts 12-hour times to 24-hour", () => {
    expect(to24Hour("8:00 AM")).toBe("08:00");
    expect(to24Hour("6:00 PM")).toBe("18:00");
    expect(to24Hour("12:00 PM")).toBe("12:00");
    expect(to24Hour("12:30 AM")).toBe("00:30");
    expect(to24Hour("9 am")).toBe("09:00");
    expect(to24Hour("Closed")).toBeNull();
    expect(to24Hour("")).toBeNull();
  });

  it("expands day ranges, single days and lists", () => {
    expect(expandDays("Monday – Friday")).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ]);
    expect(expandDays("Saturday")).toEqual(["Saturday"]);
    expect(expandDays("Mon - Wed")).toEqual(["Monday", "Tuesday", "Wednesday"]);
    expect(expandDays("Tue, Thu")).toEqual(["Tuesday", "Thursday"]);
    expect(expandDays("Friday – Sunday")).toEqual(["Friday", "Saturday", "Sunday"]);
    expect(expandDays("Holidays")).toEqual([]);
  });

  it("builds specs from siteConfig.hours and omits closed days", () => {
    const specs = openingHoursSpecification([
      { days: "Monday – Friday", open: "8:00 AM", close: "6:00 PM" },
      { days: "Saturday", open: "9:00 AM", close: "4:00 PM" },
      { days: "Sunday", open: "Closed", close: "" },
    ]);
    expect(specs).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "16:00",
      },
    ]);
  });

  it("parses every open row of the live config", () => {
    const openRows = siteConfig.hours.filter((row) => to24Hour(row.open));
    expect(openingHoursSpecification()).toHaveLength(openRows.length);
  });
});

describe("postalAddress", () => {
  const base = { city: "Springfield", state: "CA", zip: "90000", country: "US" };

  it("omits streetAddress when the street is empty or blank", () => {
    expect(postalAddress({ ...base, street: "" })).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Springfield",
      addressRegion: "CA",
      postalCode: "90000",
      addressCountry: "US",
    });
    expect(postalAddress({ ...base, street: "   " })).not.toHaveProperty("streetAddress");
  });

  it("includes streetAddress when present", () => {
    expect(postalAddress({ ...base, street: "1 Main St" })).toMatchObject({
      streetAddress: "1 Main St",
    });
  });
});

describe("localBusinessJsonLd", () => {
  const business = localBusinessJsonLd(services);

  it("is a LocalBusiness with a stable @id", () => {
    expect(business["@context"]).toBe("https://schema.org");
    expect(business["@type"]).toContain("LocalBusiness");
    expect(business["@type"]).toContain("AutoWash");
    expect(business["@type"]).toContain("AutomotiveBusiness");
    expect(business["@id"]).toBe(jsonLdIds.business);
    expect(jsonLdIds.business).toBe(`${siteConfig.url.replace(/\/$/, "")}/#business`);
    expect(business.name).toBe(siteConfig.name);
    expect(business.priceRange).toBe("$$");
  });

  it("uses absolute URLs on the configured origin", () => {
    expect(business.url).toBe(`${origin}/`);
    expect(business.logo).toBe(`${origin}${siteConfig.logo}`);
    expect(business.image).toBe(`${origin}${siteConfig.logo}`);
  });

  it("includes address, geo, phone and founder from siteConfig", () => {
    expect(business.address).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
    });
    expect(business.geo).toMatchObject({
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    });
    expect(business.telephone).toMatch(/^\+1\d{10}$/);
    expect(business.foundingDate).toBe(String(siteConfig.founded));
    expect(business.founder).toEqual({ "@type": "Person", name: siteConfig.founder.name });
    expect(business.sameAs).toEqual(Object.values(siteConfig.social));
    expect(business.areaServed).toHaveLength(siteConfig.serviceArea.length);
  });

  it("never emits a rating: no ratings without verified reviews", () => {
    expect(business).not.toHaveProperty("aggregateRating");
    expect(JSON.stringify(business)).not.toMatch(/rating/i);
  });

  it("serves every town in siteConfig.serviceArea as a City", () => {
    const area = business.areaServed as { "@type": string; name: string }[];
    expect(area.map((c) => c.name)).toEqual([...siteConfig.serviceArea]);
    area.forEach((c) => expect(c["@type"]).toBe("City"));
  });

  it("omits streetAddress and the map pin for a mobile-only business", () => {
    if (!siteConfig.address.street) {
      expect(business.address).not.toHaveProperty("streetAddress");
    }
    if (siteConfig.mobileOnly) {
      expect(business).not.toHaveProperty("hasMap");
    }
  });

  it("lists every service in the offer catalog only when services are passed", () => {
    const catalog = business.hasOfferCatalog as { itemListElement: unknown[] };
    expect(catalog.itemListElement).toHaveLength(services.length);
    expect(localBusinessJsonLd()).not.toHaveProperty("hasOfferCatalog");
  });
});

describe("serviceJsonLd", () => {
  const service = getService("full-deluxe") ?? services[0];
  const node = serviceJsonLd(service);

  it("describes the service with an aggregate price range", () => {
    const prices = Object.values(service.price);
    expect(node["@type"]).toBe("Service");
    expect(node.name).toBe(service.name);
    expect(node.url).toBe(`${origin}/services/${service.slug}`);
    expect(node.offers).toMatchObject({
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
    });
  });

  it("references the business as provider", () => {
    expect(node.provider).toMatchObject({ "@id": jsonLdIds.business });
  });
});

describe("faqJsonLd", () => {
  it("maps every question to a Question with an accepted answer", () => {
    const node = faqJsonLd(faqs);
    const entities = node.mainEntity as {
      "@type": string;
      name: string;
      acceptedAnswer: { text: string };
    }[];
    expect(node["@type"]).toBe("FAQPage");
    expect(entities).toHaveLength(faqs.length);
    expect(entities[0]).toEqual({
      "@type": "Question",
      name: faqs[0].question,
      acceptedAnswer: { "@type": "Answer", text: faqs[0].answer },
    });
  });
});

describe("breadcrumbJsonLd", () => {
  it("prepends Home, numbers positions and leaves the current page without an item", () => {
    const node = breadcrumbJsonLd([
      { label: "Services", href: "/services" },
      { label: "Full Deluxe Package" },
    ]);
    expect(node.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${origin}/services` },
      { "@type": "ListItem", position: 3, name: "Full Deluxe Package" },
    ]);
  });

  it("does not duplicate Home when the trail already starts at /", () => {
    const node = breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "FAQ" }]);
    expect(node.itemListElement).toHaveLength(2);
  });
});

describe("websiteJsonLd and jsonLdGraph", () => {
  it("links the website to the business", () => {
    const node = websiteJsonLd();
    expect(node["@type"]).toBe("WebSite");
    expect(node.publisher).toEqual({ "@id": jsonLdIds.business });
  });

  it("wraps nodes in a single @graph without nested contexts", () => {
    const graph = jsonLdGraph(websiteJsonLd(), localBusinessJsonLd());
    const nodes = graph["@graph"] as Record<string, unknown>[];
    expect(graph["@context"]).toBe("https://schema.org");
    expect(nodes).toHaveLength(2);
    nodes.forEach((n) => expect(n).not.toHaveProperty("@context"));
  });
});

describe("JsonLd component", () => {
  it("serializes data and escapes < to prevent breaking out of the script tag", () => {
    const element = JsonLd({ data: { name: "</script><script>alert(1)</script>" } });
    const html = element.props.dangerouslySetInnerHTML.__html as string;
    expect(element.props.type).toBe("application/ld+json");
    expect(html).not.toContain("<");
    expect(JSON.parse(html)).toEqual({ name: "</script><script>alert(1)</script>" });
  });
});

describe("buildMetadata", () => {
  it("sets canonical, Open Graph and Twitter fields with the default social image", () => {
    const metadata = buildMetadata({
      title: "Pricing",
      description: "Transparent pricing.",
      path: "/pricing",
    });
    expect(metadata.title).toBe("Pricing");
    expect(metadata.alternates?.canonical).toBe("/pricing");
    expect(metadata.openGraph).toMatchObject({
      url: "/pricing",
      title: `Pricing | ${siteConfig.name}`,
      siteName: siteConfig.name,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(metadata.robots).toBeUndefined();
  });

  it("supports custom images, absolute titles and noindex", () => {
    const metadata = buildMetadata({
      title: "Home",
      description: "d",
      path: "/",
      image: "/images/hero.jpg",
      absoluteTitle: true,
      noIndex: true,
    });
    expect(metadata.title).toEqual({ absolute: "Home" });
    expect(metadata.openGraph?.images).toEqual([
      { url: "/images/hero.jpg", alt: `${siteConfig.name}: Home` },
    ]);
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});

describe("social card copy", () => {
  it("derives short service labels from catalog names", () => {
    expect(
      socialServiceLabels([
        { name: "Basic Package — Exterior Wash" },
        { name: "Premium Package — Exterior Detail" },
        { name: "Full Deluxe Package — Inside + Outside" },
        { name: "Working Truck" },
      ]),
    ).toEqual(["Exterior wash", "Exterior detail", "Inside + outside", "Working truck"]);
  });

  it("has one label per live service", () => {
    expect(socialServiceLabels(services)).toHaveLength(services.length);
  });

  it("states only verifiable facts", () => {
    expect(socialProofLine).toContain(`Since ${siteConfig.founded}`);
    expect(socialProofLine).not.toMatch(/\d+(\.\d+)?\s*(star|rating|reviews|vehicles)/i);
  });
});
