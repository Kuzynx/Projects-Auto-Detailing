import { bookingHref } from "@/config/site";

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
  /** Three short selling points used on cards and the pricing table. */
  highlights: string[];
  /** Shown after prices, e.g. "per visit" for recurring services. */
  priceSuffix?: string;
  /** Where the work happens. Mobile services need no deposit. */
  location: ServiceLocation;
  /** Add-on slugs we recommend with this service (shown first in the booking sidebar). */
  recommendedAddOns: string[];
  /** Care instructions after the appointment. */
  aftercare: string[];
  /** Service-specific questions and answers. */
  faq: ServiceFaq[];
  /** Optional photo from a real client job, shown on the detail page. */
  recentJob?: { image: string; alt: string; caption: string; width: number; height: number };
}

/** Every service is mobile. "garage" work needs a garage or covered, enclosed space at your location. */
export type ServiceLocation = "mobile" | "garage";

export interface ServiceFaq {
  question: string;
  answer: string;
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
    image: "/images/work/shelby-gt350-rinse-wide.jpg",
    pairsWith: ["interior-refresh"],
    highlights: [
      "Two-bucket, pH-neutral hand wash",
      "Wheels and barrels deep cleaned",
      "Three-month spray sealant",
    ],
    location: "mobile",
    recommendedAddOns: ["glass-coating", "trim-restoration", "headlight-restoration"],
    recentJob: {
      image: "/images/work/shelby-gt350-two-bucket.jpg",
      alt: "Detailer hand washing a Shelby GT350 with a wash mitt beside two buckets in a driveway",
      caption: "Two-bucket method on a Shelby GT350, mobile service",
      width: 1600,
      height: 2133,
    },
    aftercare: [
      "Wait 12 hours before driving in rain so the sealant fully bonds.",
      "Skip automatic car washes. The brushes reintroduce the swirls we avoid.",
      "Rinse bird droppings and bug splatter within 48 hours; desert sun bakes them into the clear coat.",
    ],
    faq: [
      {
        question: "How is this different from a $20 tunnel wash?",
        answer:
          "Tunnel washes use recycled water and spinning brushes that drag grit across the paint, which is where most swirl marks come from. We hand wash with two buckets, grit guards and a fresh microfiber mitt per section, and we finish with a real sealant rather than a spray-on gloss that rinses off in a week.",
      },
      {
        question: "Do you need water or power at my house?",
        answer:
          "No. Our mobile unit carries its own deionized water, power and lighting. We just need enough room to open every door and walk around the car.",
      },
      {
        question: "How often should I book it?",
        answer:
          "Every three to four weeks keeps a daily driver in top shape and lines up with the life of the sealant. If you want that on autopilot, the Maintenance Plan covers it at a lower per-visit price.",
      },
    ],
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
    highlights: [
      "Steam-cleaned hard surfaces",
      "Carpets and mats shampooed",
      "Leather cleaned and UV-conditioned",
    ],
    location: "mobile",
    recommendedAddOns: ["pet-hair-removal", "odor-elimination", "seat-shampoo"],
    aftercare: [
      "Leave the windows cracked for two to three hours so shampooed carpets dry completely.",
      "Avoid oily hand lotion on the steering wheel and shift knob for the first day.",
      "Keep a microfiber towel in the glovebox for spills; blot, never rub.",
    ],
    faq: [
      {
        question: "Can you get pet hair out of the carpet?",
        answer:
          "A standard vacuum leaves most embedded hair behind. Add Pet Hair Removal and we use rubber blades and compressed air to pull it out of the weave. Heavy shedding on every surface can add 15 to 30 percent, and we quote that before we start.",
      },
      {
        question: "Will my seats be wet when you leave?",
        answer:
          "Leather and hard surfaces are dry on hand-off. Shampooed mats and carpets are damp to the touch and dry in two to four hours with the windows cracked, faster in dry desert heat.",
      },
      {
        question: "Do you remove stains from cloth seats?",
        answer:
          "We spot-treat light stains as part of the service. For set-in coffee, juice or makeup on cloth seats, add Fabric Seat Extraction, which uses hot-water extraction to lift what a surface clean cannot.",
      },
    ],
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
    highlights: [
      "Complete interior and exterior reset",
      "Clay bar plus one-step machine polish",
      "Six-month paint sealant",
    ],
    location: "mobile",
    recommendedAddOns: ["headlight-restoration", "engine-bay", "pet-hair-removal"],
    aftercare: [
      "Keep the car dry for 12 hours while the sealant cures.",
      "Hand wash only, with a pH-neutral soap, for the life of the sealant.",
      "Leave windows cracked for a few hours so shampooed carpets dry fully.",
      "Book a Maintenance Plan visit within four weeks to keep the finish locked in.",
    ],
    faq: [
      {
        question: "Will the polish remove all the swirls?",
        answer:
          "The Full Detail includes a one-step polish that removes roughly 50 to 60 percent of light swirls and restores depth and gloss. If you want up to 90 percent defect removal, Paint Correction uses a multi-stage process measured panel by panel.",
      },
      {
        question: "Is it worth doing before I sell?",
        answer:
          "Almost always. A clean, glossy car photographs better and signals it was looked after. One client sold their car for $1,800 over the dealer's offer the week after a Full Detail.",
      },
      {
        question: "Can you do it at my house?",
        answer:
          "Yes. The Full Detail is fully mobile. We need a level spot with room to walk around the car, ideally in shade or a garage for the polishing stage. We bring the water, power and lighting.",
      },
    ],
  },
  {
    slug: "paint-correction",
    name: "Paint Correction",
    category: "correction",
    tagline: "Swirls, scratches and oxidation, permanently removed.",
    description:
      "Multi-stage machine compounding and polishing that levels the clear coat to remove swirl marks, light scratches, hard-water spots and sun oxidation. Done in your garage or covered space with our own lighting, power and water, and measured with a paint-depth gauge at every panel. Finished with a sealant or paired with a ceramic coating.",
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
    highlights: [
      "Up to 90% of swirls and scratches removed",
      "Paint depth measured on every panel",
      "Photo documentation of every panel",
    ],
    location: "garage",
    recommendedAddOns: ["headlight-restoration", "trim-restoration", "wheel-coating"],
    aftercare: [
      "No washing for seven days while the sealant cures.",
      "Use the two-bucket method and a soft microfiber mitt. Never a brush.",
      "Park in shade when you can; UV is the fastest way back to dull paint.",
      "Consider a ceramic coating within 30 days to lock the corrected finish in.",
    ],
    faq: [
      {
        question: "Is paint correction safe for my clear coat?",
        answer:
          "Yes, when it is measured. We read paint depth on every panel before and during the work, so we know exactly how much clear coat is available and never remove more than a few microns. Thin or repainted panels get a gentler approach.",
      },
      {
        question: "Can every scratch be removed?",
        answer:
          "Anything that does not catch a fingernail usually can. Deeper scratches that go through the clear coat can be reduced and made far less visible, but removing them fully would mean touch-up or a repaint. We tell you which is which during the walkthrough.",
      },
      {
        question: "Why do you need my garage?",
        answer:
          "Polishing in direct sun or wind is how dust gets ground into fresh paint. A garage or covered, enclosed space gives us shade and still air; we bring the color-matched lighting, power and water. No garage? Ask us about a Full Detail instead, which can be done in open shade.",
      },
    ],
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    category: "protection",
    tagline: "Years of gloss and protection in a single application.",
    description:
      "Professional-grade 9H ceramic coating applied in your garage or covered, enclosed space, out of the sun and wind. Includes a full paint correction prep stage so the coating locks in a flawless finish, then cures overnight in your garage. Hydrophobic, UV and chemical-resistant, and backed by a written warranty.",
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
    highlights: [
      "Paint correction prep included",
      "Professional 9H ceramic on paint, trim and glass",
      "Three-year written warranty",
    ],
    location: "garage",
    recommendedAddOns: ["wheel-coating", "glass-coating", "trim-restoration"],
    aftercare: [
      "Keep the car dry for 48 hours and avoid washing for seven days while the coating cures.",
      "Hand wash every two to three weeks with the coating-safe soap in your aftercare kit.",
      "Avoid automatic washes and wax products; they mask the coating's hydrophobic layer.",
      "Book your annual inspection and top-up; it keeps the warranty valid.",
    ],
    faq: [
      {
        question: "How long does the coating really last?",
        answer:
          "Our professional coating is warrantied for three years, with a five-year upgrade available. Real-world life depends on care: coated cars on our Maintenance Plan routinely bead water like day one well past the warranty.",
      },
      {
        question: "Does a ceramic coating mean I never wash my car?",
        answer:
          "No, but washing becomes fast and safe. Dirt, pollen and bird droppings release easily from a coated surface, so a quick hand wash every few weeks keeps it looking freshly detailed, and you never have to wax again.",
      },
      {
        question: "Why is paint correction included?",
        answer:
          "A coating locks in whatever is underneath it, swirls included. We correct the paint first so the finish you keep for the next three years is the best version of it.",
      },
    ],
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
    image: "/images/work/shelby-gt350-finish-wide.jpg",
    badge: "Monthly",
    pairsWith: ["ceramic-coating", "full-detail"],
    priceSuffix: "per visit",
    highlights: [
      "Monthly mobile wash and interior tidy",
      "Coating booster every visit",
      "No contract, pause anytime",
    ],
    location: "mobile",
    recommendedAddOns: ["pet-hair-removal", "glass-coating", "engine-bay"],
    aftercare: [
      "Keep the same day each month and we will hold your slot automatically.",
      "Text us if the car needs extra attention before a visit; we will plan for it.",
      "Rinse heavy pollen or bird droppings between visits rather than letting them sit.",
    ],
    faq: [
      {
        question: "Do I need a Full Detail or coating first?",
        answer:
          "Yes. The plan is built to maintain a finish, not restore one. If your car has not had a Full Detail or Ceramic Coating with us in the last 90 days, we start with one of those so every monthly visit is quick and gentle.",
      },
      {
        question: "Is there a contract?",
        answer:
          "No. You are billed per visit after each appointment. Pause for a trip or cancel anytime with a text or email; there is no fee.",
      },
      {
        question: "Can I add more than one car?",
        answer:
          "Absolutely. Households and small fleets book back-to-back visits at the same address, and we schedule them together so it is one appointment on your calendar.",
      },
    ],
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
  {
    slug: "engine-bay",
    name: "Engine Bay Detail",
    description: "Degreased, rinsed and dressed.",
    price: 59,
    duration: "+30 min",
  },
  {
    slug: "headlight-restoration",
    name: "Headlight Restoration",
    description: "Wet-sanded, polished and UV sealed.",
    price: 89,
    duration: "+45 min",
  },
  {
    slug: "pet-hair-removal",
    name: "Pet Hair Removal",
    description: "Rubber-blade and compressed-air extraction.",
    price: 49,
    duration: "+30 min",
  },
  {
    slug: "odor-elimination",
    name: "Odor Elimination",
    description: "Ozone treatment that neutralizes smoke and mildew.",
    price: 79,
    duration: "+60 min",
  },
  {
    slug: "glass-coating",
    name: "Windshield Ceramic Coating",
    description: "Hydrophobic glass coating for better wet-weather visibility.",
    price: 69,
    duration: "+20 min",
  },
  {
    slug: "wheel-coating",
    name: "Wheel Face Coating",
    description: "Ceramic coating on wheel faces to resist brake dust.",
    price: 149,
    duration: "+60 min",
  },
  {
    slug: "trim-restoration",
    name: "Plastic Trim Restoration",
    description: "Faded trim brought back to black.",
    price: 59,
    duration: "+30 min",
  },
  {
    slug: "seat-shampoo",
    name: "Fabric Seat Extraction",
    description: "Hot-water extraction for stained cloth seats.",
    price: 69,
    duration: "+45 min",
  },
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

/* ------------------------------------------------------------------ */
/* Extended catalog data (Services & Pricing pages).                   */
/* ------------------------------------------------------------------ */

export const serviceLocations: Record<
  ServiceLocation,
  { label: string; shortLabel: string; description: string }
> = {
  mobile: {
    label: "Mobile",
    shortLabel: "Mobile",
    description:
      "We come to your home or office with our own water, power and lighting. Early starts are available to beat the afternoon heat.",
  },
  garage: {
    label: "Mobile, garage required",
    shortLabel: "Garage required",
    description:
      "Done at your location in a garage or covered, enclosed space: shade and still air keep desert dust and sun off fresh paint. We bring the lighting, power and water.",
  },
};

export interface ServiceProcessStep {
  title: string;
  description: string;
}

/** How the work is done, by category. Shown on each service detail page. */
export const serviceProcess: Record<ServiceCategory, ServiceProcessStep[]> = {
  exterior: [
    {
      title: "Pre-rinse and foam",
      description:
        "A thick pH-neutral foam dwells for five minutes to lift grit before anything touches the paint.",
    },
    {
      title: "Wheels first",
      description:
        "Dedicated brushes and an iron remover clean faces, barrels and calipers so brake dust never reaches the paint mitt.",
    },
    {
      title: "Two-bucket contact wash",
      description:
        "Grit guards and a fresh microfiber mitt per section. Top to bottom, never in circles.",
    },
    {
      title: "Dry and protect",
      description:
        "Filtered-air blow-dry for mirrors and trim, plush towel dry, then a sealant layer on paint and dressing on tires.",
    },
  ],
  interior: [
    {
      title: "Empty and inspect",
      description:
        "We remove mats and loose items, note stains and wear, and agree on priorities with you.",
    },
    {
      title: "Air and vacuum",
      description:
        "Compressed air pushes debris out of seams, vents and rails before a full vacuum, trunk included.",
    },
    {
      title: "Steam and shampoo",
      description:
        "Hard surfaces are steam-cleaned and wiped; carpets and mats are shampooed and extracted.",
    },
    {
      title: "Condition and finish",
      description:
        "Leather gets a UV-blocking conditioner, plastics a non-greasy matte protectant, and glass is cleaned streak-free.",
    },
  ],
  packages: [
    {
      title: "Walkthrough",
      description:
        "Five minutes with you at the car to agree on the plan and flag anything that needs extra care.",
    },
    {
      title: "Exterior decontamination",
      description:
        "Foam, two-bucket wash, iron remover and clay bar strip bonded contamination from the paint.",
    },
    {
      title: "Interior reset",
      description: "Vacuum, steam, shampoo and condition while the exterior dries in the shade.",
    },
    {
      title: "Gloss and protection",
      description:
        "Machine polish where included, then a sealant or coating booster and a final inspection under lights.",
    },
  ],
  correction: [
    {
      title: "Measure",
      description:
        "Paint-depth readings on every panel tell us how much clear coat we can safely work with.",
    },
    {
      title: "Decontaminate",
      description:
        "Full wash, iron remover and clay bar so the polishing pads only touch clean paint.",
    },
    {
      title: "Compound and refine",
      description:
        "A cutting stage levels swirls and scratches, then a finishing polish restores clarity and depth.",
    },
    {
      title: "Inspect and document",
      description:
        "Panel wipe to reveal true results, inspection under color-matched lights, and before/after photos of every panel.",
    },
  ],
  protection: [
    {
      title: "Correct",
      description:
        "Every coating starts with paint correction so the finish you lock in is flawless.",
    },
    {
      title: "Prep",
      description:
        "An IPA panel wipe removes polishing oils so the coating bonds directly to clear coat.",
    },
    {
      title: "Apply and level",
      description:
        "The coating goes on panel by panel under our portable lighting, with the garage door down to keep dust out, then is leveled by hand at the exact flash time.",
    },
    {
      title: "Cure and hand-off",
      description:
        "The coating cures overnight in your garage. We return for a final inspection and walk you through your aftercare kit and warranty.",
    },
  ],
};

export type ComparisonValue = boolean | string;

export interface ComparisonFeature {
  label: string;
  /** Keyed by service slug. Missing means not included. */
  values: Partial<Record<string, ComparisonValue>>;
}

/** Feature matrix for the Pricing page. Rows are features, columns are services. */
export const comparisonFeatures: ComparisonFeature[] = [
  {
    label: "Hand wash",
    values: {
      "signature-wash": true,
      "full-detail": true,
      "paint-correction": true,
      "ceramic-coating": true,
      "maintenance-plan": true,
    },
  },
  {
    label: "Wheels and tires deep cleaned",
    values: {
      "signature-wash": true,
      "full-detail": true,
      "paint-correction": true,
      "ceramic-coating": true,
      "maintenance-plan": "Maintenance clean",
    },
  },
  {
    label: "Clay bar decontamination",
    values: { "full-detail": true, "paint-correction": true, "ceramic-coating": true },
  },
  {
    label: "Machine polish",
    values: {
      "full-detail": "One-step",
      "paint-correction": "Two-stage",
      "ceramic-coating": "Two-stage",
    },
  },
  {
    label: "Paint-depth measurement",
    values: { "paint-correction": true, "ceramic-coating": true },
  },
  {
    label: "Interior vacuum",
    values: { "interior-refresh": true, "full-detail": true, "maintenance-plan": true },
  },
  {
    label: "Interior steam",
    values: { "interior-refresh": true, "full-detail": true },
  },
  {
    label: "Carpet and mat shampoo",
    values: { "interior-refresh": true, "full-detail": true },
  },
  {
    label: "Leather conditioning",
    values: { "interior-refresh": true, "full-detail": true },
  },
  {
    label: "Paint protection",
    values: {
      "signature-wash": "3-month sealant",
      "full-detail": "6-month sealant",
      "paint-correction": "6-month sealant",
      "ceramic-coating": "Multi-year ceramic",
      "maintenance-plan": "Coating booster",
    },
  },
  {
    label: "Ceramic coating",
    values: { "ceramic-coating": true },
  },
  {
    label: "Before and after photos",
    values: { "paint-correction": true, "ceramic-coating": true },
  },
  {
    label: "Warranty",
    values: { "ceramic-coating": "3-year written" },
  },
  {
    label: "Where we work",
    values: {
      "signature-wash": "Your driveway",
      "interior-refresh": "Your driveway",
      "full-detail": "Your driveway",
      "paint-correction": "Your garage",
      "ceramic-coating": "Your garage",
      "maintenance-plan": "Your driveway",
    },
  },
];

export interface PriceFactor {
  title: string;
  description: string;
}

/** Things that can change a quote. Always quoted before work starts. */
export const priceFactors: PriceFactor[] = [
  {
    title: "Vehicle condition",
    description:
      "Heavy sun oxidation, hard-water spots or neglected paint takes longer to bring back.",
  },
  {
    title: "Pet hair",
    description: "Embedded hair in carpet and cloth needs dedicated extraction time.",
  },
  {
    title: "Excessive soiling",
    description:
      "Caked mud, embedded desert sand, spills or biohazard clean-up beyond normal daily use.",
  },
];

/** Range applied for the factors above, as a percentage of the base price. */
export const priceFactorRange = { min: 15, max: 30 } as const;

/** Parse an add-on duration such as "+45 min" into minutes. */
export function addOnMinutes(addOn: Pick<AddOn, "duration">) {
  const match = addOn.duration.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

/** Lowest and highest starting price for a service across vehicle sizes. */
export function priceRange(service: Pick<Service, "price">) {
  const values = Object.values(service.price);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Link into the booking flow with optional pre-selection. */
export function bookingUrl(
  options: { service?: string; size?: VehicleSize; addons?: string[] } = {},
) {
  const params = new URLSearchParams();
  if (options.service) params.set("service", options.service);
  if (options.size) params.set("size", options.size);
  if (options.addons && options.addons.length > 0) params.set("addons", options.addons.join(","));
  const query = params.toString();
  return query ? `${bookingHref}?${query}` : bookingHref;
}

export function isVehicleSize(value: unknown): value is VehicleSize {
  return value === "sedan" || value === "suv" || value === "truck";
}
