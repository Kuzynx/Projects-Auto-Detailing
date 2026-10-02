/**
 * Service catalog. Prices are starting prices by vehicle size. Everything on the
 * Services, Pricing and Booking pages is derived from this file.
 */
export type VehicleSize = "sedan" | "suv" | "truck";

export const vehicleSizes: {
  id: VehicleSize;
  label: string;
  description: string;
  examples: string;
}[] = [
  {
    id: "sedan",
    label: "Sedan / Coupe",
    description: "Compact and mid-size cars",
    examples: "Civic, 3 Series, Model 3, Mustang",
  },
  {
    id: "suv",
    label: "SUV / Crossover",
    description: "Two-row SUVs, wagons and small trucks",
    examples: "RAV4, X5, Model Y, Tacoma",
  },
  {
    id: "truck",
    label: "Truck / XL",
    description: "Three-row SUVs, full-size trucks and vans",
    examples: "F-150, Tahoe, Sprinter, Escalade",
  },
];

export type ServiceCategory = "exterior" | "interior" | "packages" | "protection" | "correction";

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  /** Starting price per vehicle size. */
  price: Record<VehicleSize, number>;
  /** Approximate duration in hours per vehicle size. */
  duration: Record<VehicleSize, string>;
  includes: string[];
  idealFor: string[];
  image: string;
  featured?: boolean;
  /** Marketing badge shown on cards, e.g. "Most popular". */
  badge?: string;
  /** Services that are often paired with this one. */
  pairsWith?: string[];
}

export const services: Service[] = [
  {
    slug: "signature-wash",
    name: "Signature Wash & Protect",
    category: "exterior",
    tagline: "A proper hand wash, not a drive-through.",
    description:
      "Our foundational exterior service. A two-bucket, pH-neutral hand wash with a foam pre-soak, decontamination of wheels and barrels, and a spray sealant that leaves the paint slick and protected for up to three months.",
    price: { sedan: 89, suv: 109, truck: 129 },
    duration: { sedan: "1.5 hrs", suv: "2 hrs", truck: "2.5 hrs" },
    includes: [
      "Foam pre-soak and two-bucket hand wash",
      "Wheels, barrels and tires deep cleaned",
      "Door jambs wiped down",
      "Bug and tar removal",
      "Three-month spray sealant",
      "Tire dressing and glass cleaned inside and out",
    ],
    idealFor: ["Monthly maintenance", "Pre-event shine", "Lease returns"],
    image: "/images/detail-wash-gtr.jpg",
    pairsWith: ["interior-refresh"],
  },
  {
    slug: "interior-refresh",
    name: "Interior Refresh",
    category: "interior",
    tagline: "Every surface, every seam, every vent.",
    description:
      "A complete interior reset. We vacuum and compressed-air every crevice, steam-clean and condition all hard surfaces, shampoo mats, and treat leather with a UV-blocking conditioner.",
    price: { sedan: 149, suv: 179, truck: 219 },
    duration: { sedan: "2 hrs", suv: "2.5 hrs", truck: "3 hrs" },
    includes: [
      "Full vacuum including trunk and under seats",
      "Steam cleaning of all hard surfaces",
      "Leather cleaned and conditioned",
      "Carpets and floor mats shampooed",
      "Vents, seams and cup holders detailed",
      "Streak-free interior glass",
    ],
    idealFor: ["Families", "Rideshare drivers", "Pet owners"],
    image: "/images/detail-interior-dash.jpg",
    pairsWith: ["signature-wash", "odor-elimination"],
  },
  {
    slug: "full-detail",
    name: "The Full Detail",
    category: "packages",
    tagline: "Our most-booked package. Inside and out, done right.",
    description:
      "Everything in the Signature Wash and Interior Refresh plus a clay bar decontamination, a one-step machine polish to restore gloss, and a six-month paint sealant. The car leaves looking better than the day you bought it.",
    price: { sedan: 349, suv: 399, truck: 459 },
    duration: { sedan: "4–5 hrs", suv: "5–6 hrs", truck: "6–7 hrs" },
    includes: [
      "Everything in Signature Wash & Protect",
      "Everything in Interior Refresh",
      "Clay bar and iron decontamination",
      "One-step machine polish (gloss enhancement)",
      "Six-month paint sealant",
      "Engine bay light clean",
    ],
    idealFor: ["Seasonal deep clean", "Selling your car", "New-to-you vehicles"],
    image: "/images/detail-foam-porsche.jpg",
    featured: true,
    badge: "Most popular",
    pairsWith: ["ceramic-coating"],
  },
  {
    slug: "paint-correction",
    name: "Paint Correction",
    category: "correction",
    tagline: "Swirls, scratches and oxidation, permanently removed.",
    description:
      "Multi-stage machine compounding and polishing that levels the clear coat to remove swirl marks, light scratches, water spots and oxidation. Measured with a paint-depth gauge at every panel. Finished with a sealant or paired with a ceramic coating.",
    price: { sedan: 599, suv: 699, truck: 849 },
    duration: { sedan: "1 day", suv: "1 day", truck: "1–2 days" },
    includes: [
      "Paint-depth measurement on every panel",
      "Full decontamination wash and clay",
      "Two-stage compound and polish (up to 90% defect removal)",
      "Panel wipe and inspection under color-matched lighting",
      "Six-month sealant included",
      "Before and after photo documentation",
    ],
    idealFor: ["Enthusiasts", "Dark-colored paint", "Pre-coating prep"],
    image: "/images/detail-paint-closeup-red.jpg",
    pairsWith: ["ceramic-coating"],
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    category: "protection",
    tagline: "Years of gloss and protection in a single application.",
    description:
      "Professional-grade 9H ceramic coating applied in our climate-controlled studio. Includes a full paint correction prep stage so the coating locks in a flawless finish. Hydrophobic, chemical-resistant and backed by a written warranty.",
    price: { sedan: 1199, suv: 1399, truck: 1649 },
    duration: { sedan: "2 days", suv: "2 days", truck: "2–3 days" },
    includes: [
      "Everything in Paint Correction",
      "Professional 9H ceramic coating on all paint",
      "Trim, wheels faces and glass coated",
      "Three-year written warranty (five-year upgrade available)",
      "Aftercare kit and maintenance guide",
      "Annual inspection and top-up included",
    ],
    idealFor: ["New vehicles", "Daily drivers", "Anyone tired of waxing"],
    image: "/images/hero-amg-dark.jpg",
    featured: true,
    badge: "Best value long-term",
    pairsWith: ["maintenance-plan"],
  },
  {
    slug: "maintenance-plan",
    name: "Maintenance Plan",
    category: "packages",
    tagline: "Keep it perfect. We come to you every month.",
    description:
      "A recurring mobile wash and interior tidy for cars that have already had a Full Detail or coating. Priced per visit with no contract. Pause or cancel anytime.",
    price: { sedan: 79, suv: 99, truck: 119 },
    duration: { sedan: "1 hr", suv: "1.25 hrs", truck: "1.5 hrs" },
    includes: [
      "Maintenance hand wash with coating-safe soap",
      "Interior vacuum and wipe-down",
      "Glass inside and out",
      "Tire dressing",
      "Coating booster applied every visit",
      "Priority scheduling",
    ],
    idealFor: ["Coated vehicles", "Busy professionals", "Fleet vehicles"],
    image: "/images/hero-panamera.jpg",
    badge: "Monthly",
  },
];

export interface AddOn {
  slug: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export const addOns: AddOn[] = [
  { slug: "engine-bay", name: "Engine Bay Detail", description: "Degreased, rinsed and dressed.", price: 59, duration: "+30 min" },
  { slug: "headlight-restoration", name: "Headlight Restoration", description: "Wet-sanded, polished and UV sealed.", price: 89, duration: "+45 min" },
  { slug: "pet-hair-removal", name: "Pet Hair Removal", description: "Rubber-blade and compressed-air extraction.", price: 49, duration: "+30 min" },
  { slug: "odor-elimination", name: "Odor Elimination", description: "Ozone treatment that neutralizes smoke and mildew.", price: 79, duration: "+60 min" },
  { slug: "glass-coating", name: "Windshield Ceramic Coating", description: "Hydrophobic glass coating for better wet-weather visibility.", price: 69, duration: "+20 min" },
  { slug: "wheel-coating", name: "Wheel Face Coating", description: "Ceramic coating on wheel faces to resist brake dust.", price: 149, duration: "+60 min" },
  { slug: "trim-restoration", name: "Plastic Trim Restoration", description: "Faded trim brought back to black.", price: 59, duration: "+30 min" },
  { slug: "seat-shampoo", name: "Fabric Seat Extraction", description: "Hot-water extraction for stained cloth seats.", price: 69, duration: "+45 min" },
];

export const serviceCategories: { id: ServiceCategory; label: string }[] = [
  { id: "packages", label: "Packages" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "correction", label: "Paint Correction" },
  { id: "protection", label: "Protection" },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getAddOn(slug: string) {
  return addOns.find((a) => a.slug === slug);
}
