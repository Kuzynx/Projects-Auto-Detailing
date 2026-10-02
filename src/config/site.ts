/**
 * Single source of truth for business identity. Change these values and the
 * whole site (header, footer, metadata, JSON-LD, contact page) updates.
 */
export const siteConfig = {
  name: "Project's Auto Detailing",
  shortName: "Project's",
  legalName: "Project's Auto Detailing LLC",
  tagline: "Showroom finish. Delivered to your driveway.",
  description:
    "Premium mobile and studio auto detailing in Austin, TX. Paint correction, ceramic coatings, interior restoration and maintenance plans by certified detailers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://projectsautodetailing.com",
  phone: "(512) 555-0147",
  phoneHref: "tel:+15125550147",
  email: "hello@projectsautodetailing.com",
  address: {
    street: "4120 S Congress Ave, Suite B",
    city: "Austin",
    state: "TX",
    zip: "78745",
    country: "US",
  },
  geo: { lat: 30.2264, lng: -97.7607 },
  timeZone: "America/Chicago",
  serviceArea: [
    "Austin",
    "Round Rock",
    "Cedar Park",
    "Pflugerville",
    "Lakeway",
    "Bee Cave",
    "Buda",
    "Kyle",
    "Georgetown",
    "Leander",
  ],
  hours: [
    { days: "Monday – Friday", open: "8:00 AM", close: "6:00 PM" },
    { days: "Saturday", open: "9:00 AM", close: "4:00 PM" },
    { days: "Sunday", open: "Closed", close: "" },
  ],
  social: {
    instagram: "https://instagram.com/projectsautodetailing",
    facebook: "https://facebook.com/projectsautodetailing",
    tiktok: "https://tiktok.com/@projectsautodetailing",
    google: "https://g.page/projectsautodetailing",
  },
  stats: {
    vehiclesDetailed: 2400,
    yearsInBusiness: 9,
    googleRating: 4.9,
    reviewCount: 312,
  },
  founded: 2017,
  /** Square logo on black, 1254x1254. Use logo-transparent.png over imagery. */
  logo: "/images/logo.png",
  logoTransparent: "/images/logo-transparent.png",
} as const;

export type SiteConfig = typeof siteConfig;

/** Primary navigation. Order matters. */
export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const bookingHref = "/book" as const;
