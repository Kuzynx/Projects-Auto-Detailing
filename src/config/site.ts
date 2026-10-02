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
    "Mobile auto detailing in Victorville and the High Desert. Hand washes, exterior details and full inside-and-out packages for cars, SUVs, trucks, sports cars, exotics and motorcycles, done at your home or office.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://projectsautodetailing.com",
  phone: "(840) 204-4176",
  phoneHref: "tel:+18402044176",
  email: "hello@projectsautodetailing.com",
  /** Mobile-only business: no public street address. `street` stays empty on purpose. */
  address: {
    street: "",
    city: "Victorville",
    state: "CA",
    zip: "92392",
    country: "US",
  },
  /** True when the business has no customer-facing location; the site hides address/directions UI. */
  mobileOnly: true,
  region: "High Desert",
  geo: { lat: 34.5362, lng: -117.2928 },
  timeZone: "America/Los_Angeles",
  serviceArea: [
    "Victorville",
    "Hesperia",
    "Apple Valley",
    "Adelanto",
    "Oak Hills",
    "Phelan",
    "Spring Valley Lake",
    "Helendale",
    "Pinon Hills",
    "Lucerne Valley",
  ],
  hours: [
    { days: "Monday – Friday", open: "7:00 AM", close: "6:00 PM" },
    { days: "Saturday", open: "7:00 AM", close: "4:00 PM" },
    { days: "Sunday", open: "Closed", close: "" },
  ],
  social: {
    instagram: "https://instagram.com/projectsautodetailing",
    facebook: "https://facebook.com/projectsautodetailing",
    tiktok: "https://tiktok.com/@projectsautodetailing",
    google: "https://g.page/projectsautodetailing",
  },
  /**
   * Honest, verifiable facts only. There are no review counts or ratings here on purpose:
   * add them when real Google reviews exist, and never invent them.
   */
  founded: 2024,
  founder: {
    name: "Kevin",
    nickname: "Project",
    title: "Founder and detailer",
    since: 2024,
    startedAtAge: 16,
    photo: "/images/team/kevin.jpg",
    photoSquare: "/images/team/kevin-square.jpg",
    /** Client-supplied bio, lightly edited. */
    bio: "Kevin, known to his customers as Project, founded Project's Auto Detailing in 2024 at sixteen years old. He has a passion for auto detailing and is here to make your vehicle look the best it can.",
  },
  /**
   * Team beyond the founder. `photo` is null until a suitable photo exists; the UI shows an
   * initials avatar in that case.
   */
  team: [
    {
      name: "Nal",
      role: "Manager",
      bio: "Nal manages the business side of Project's Auto Detailing: the website, payments and booking. She is here to make your time and the whole process easier.",
      photo: null as string | null,
    },
  ],
  /** Facts the site may state. Flip these only when they are true and documented. */
  claims: {
    insured: false,
  },
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
