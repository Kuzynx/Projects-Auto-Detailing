import { bookingHref } from "@/config/site";
import { formatPrice } from "@/lib/utils";

/**
 * Service catalog. Prices are starting prices by vehicle size. Everything on the
 * Services, Pricing and Booking pages is derived from this file.
 */
export type VehicleSize = "car" | "suv" | "truck" | "sports" | "exotic" | "motorcycle";

export const vehicleSizes: {
  id: VehicleSize;
  label: string;
  description: string;
  examples: string;
}[] = [
  {
    id: "car",
    label: "Car",
    description: "Sedans, coupes and hatchbacks",
    examples: "Sedans, coupes, hatchbacks",
  },
  {
    id: "suv",
    label: "SUV",
    description: "Crossovers, SUVs and minivans",
    examples: "Crossovers, two- and three-row SUVs, minivans",
  },
  {
    id: "truck",
    label: "Truck",
    description: "Pickups and full-size trucks",
    examples: "Pickups and full-size trucks",
  },
  {
    id: "sports",
    label: "Sports car",
    description: "Performance cars",
    examples: "Mustang, Camaro, Supra, M cars",
  },
  {
    id: "exotic",
    label: "Exotic",
    description: "Exotic and supercars",
    examples: "Lamborghini, Ferrari, McLaren, Porsche GT",
  },
  {
    id: "motorcycle",
    label: "Motorcycle",
    description: "Motorcycles",
    examples: "Cruisers, sport bikes",
  },
];

/** All vehicle size ids in display order. */
export const vehicleSizeIds: VehicleSize[] = vehicleSizes.map((v) => v.id);

export type ServiceCategory = "packages" | "exterior" | "work";

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  /** Starting price per vehicle size. */
  price: Record<VehicleSize, number>;
  /** Approximate duration per vehicle size (estimates). */
  duration: Record<VehicleSize, string>;
  includes: string[];
  idealFor: string[];
  image: string;
  featured?: boolean;
  /** Marketing badge shown on cards, e.g. "Best value". Never a popularity claim. */
  badge?: string;
  /** Services that are often paired with this one. */
  pairsWith?: string[];
  /** Three short selling points used on cards and the pricing table. */
  highlights: string[];
  /** Shown after prices, e.g. "starting". */
  priceSuffix?: string;
  /**
   * Sizes whose price is open-ended: "from" renders "from $100", "plus" renders "$150+".
   * Use `formatServicePrice` to render.
   */
  priceNote?: Partial<Record<VehicleSize, "from" | "plus">>;
  /** Where the work happens. Every current service is mobile. */
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

/** Every service is mobile. "garage" work needs a garage or covered, enclosed space at your location (unused by the current catalog). */
export type ServiceLocation = "mobile" | "garage";

export interface ServiceFaq {
  question: string;
  answer: string;
}

/** Client-provided catalog. See docs/SERVICES-SPEC.md. Slugs are fixed. */
export const services: Service[] = [
  {
    slug: "basic-wash",
    name: "Basic Package — Exterior Wash",
    category: "exterior",
    tagline: "A real hand wash, done in your driveway.",
    description:
      "A proper hand wash at your home or office. We wash the car by hand, clean the wheels and tires, dress the tires, clean the windows, dry it and finish with a wipe-down of the exterior. Quick, careful and a world away from a tunnel wash.",
    price: { car: 50, suv: 60, truck: 65, sports: 70, exotic: 100, motorcycle: 40 },
    priceNote: { exotic: "from" },
    duration: {
      car: "~1 hr",
      suv: "~1 hr",
      truck: "~1 hr",
      sports: "~1 hr",
      exotic: "~1 hr",
      motorcycle: "~45 min",
    },
    includes: [
      "Hand wash",
      "Wheels and tires",
      "Tire shine",
      "Windows",
      "Dry",
      "Basic exterior wipe-down",
    ],
    idealFor: ["Regular upkeep", "Dusty daily drivers", "A quick refresh before the weekend"],
    image: "/images/services/basic-wash.jpg",
    pairsWith: ["premium-detail", "full-deluxe"],
    highlights: [
      "Hand wash, not a tunnel wash",
      "Wheels, tires and tire shine",
      "Windows and exterior wipe-down",
    ],
    location: "mobile",
    recommendedAddOns: [],
    aftercare: [
      "Rinse off bird droppings and bug splatter soon; desert sun bakes them onto the paint.",
      "Skip automatic brush washes between visits. The brushes are what leave swirl marks.",
      "Park in shade or a garage when you can to keep the finish looking fresh longer.",
    ],
    faq: [
      {
        question: "What is the difference between Basic and Premium?",
        answer:
          "Basic covers the essentials: hand wash, wheels and tires, tire shine, windows, a dry and an exterior wipe-down. Premium adds deep wheel cleaning, wheel wells, door jambs, bug removal, a spray wax/sealant and a more detailed dry.",
      },
      {
        question: "Is the inside included?",
        answer:
          "No, the Basic Package is exterior only. If the inside needs attention too, the Full Deluxe Package covers the interior as well as the full Premium exterior.",
      },
      {
        question: "Do I need to be home?",
        answer:
          "We need access to the car, room to walk around it, an outdoor spigot and a power outlet. Let us know when you book how to reach the car and we will text you when we arrive and when we are done.",
      },
    ],
  },
  {
    slug: "premium-detail",
    name: "Premium Package — Exterior Detail",
    category: "exterior",
    tagline: "The exterior, detailed properly.",
    description:
      "Everything in the Basic Package, taken further. We deep clean the wheels, scrub the wheel wells, clean the door jambs, remove bugs, and finish with a spray wax/sealant and a more detailed dry so the car leaves glossy and protected.",
    price: { car: 80, suv: 90, truck: 100, sports: 120, exotic: 150, motorcycle: 65 },
    priceNote: { exotic: "plus" },
    duration: {
      car: "~1.5–2 hrs",
      suv: "~1.5–2 hrs",
      truck: "~1.5–2 hrs",
      sports: "~1.5–2 hrs",
      exotic: "~1.5–2 hrs",
      motorcycle: "~1–1.5 hrs",
    },
    includes: [
      "Everything in the Basic Package",
      "Deep wheel cleaning",
      "Wheel wells",
      "Door jambs",
      "Bug removal",
      "Spray wax/sealant",
      "More detailed drying",
    ],
    idealFor: [
      "Bug and road-grime season",
      "Cars that live outside",
      "A sharp look before an event",
    ],
    image: "/images/services/premium-detail.jpg",
    pairsWith: ["full-deluxe", "basic-wash"],
    highlights: [
      "Everything in Basic",
      "Deep wheel cleaning, wheel wells and door jambs",
      "Bug removal and spray wax/sealant",
    ],
    location: "mobile",
    recommendedAddOns: [],
    recentJob: {
      image: "/images/work/shelby-gt350-two-bucket.jpg",
      alt: "Detailer hand washing a Shelby GT350 with a wash mitt beside two buckets in a driveway",
      caption: "Two-bucket method on a Shelby GT350, mobile service",
      width: 1600,
      height: 2133,
    },
    aftercare: [
      "Keep the car out of sprinklers and rain for the rest of the day so the spray wax/sealant can set.",
      "Wash every few weeks; regular washes keep the wax doing its job against dust and sun.",
      "Avoid automatic brush washes, which strip wax and leave swirl marks.",
    ],
    faq: [
      {
        question: "How long does the spray wax/sealant last?",
        answer:
          "It depends on the weather, how often the car is washed and whether it is parked outside. Desert sun and dust wear any wax down faster, so regular washes are the best way to keep the gloss and protection.",
      },
      {
        question: "Why do door jambs and wheel wells matter?",
        answer:
          "They are where dirt and grime hide. A car can look clean from ten feet and still show dirty jambs every time you open the door. Premium gets the places a quick wash skips.",
      },
      {
        question: "Is the inside included?",
        answer:
          "No, Premium is an exterior detail. The Full Deluxe Package includes everything in Premium plus a full interior clean.",
      },
    ],
  },
  {
    slug: "full-deluxe",
    name: "Full Deluxe Package — Inside + Outside",
    category: "packages",
    tagline: "The whole car, inside and out.",
    description:
      "Our most complete package: the full Premium exterior detail plus the inside. A full interior vacuum, the dash, console and door panels cleaned, seats and mats done, interior windows cleaned, and deeper stain cleaning where it is needed.",
    price: { car: 120, suv: 150, truck: 165, sports: 180, exotic: 250, motorcycle: 100 },
    priceNote: { exotic: "plus" },
    duration: {
      car: "~2.5–3.5 hrs",
      suv: "~2.5–3.5 hrs",
      truck: "~2.5–3.5 hrs",
      sports: "~2.5–3.5 hrs",
      exotic: "~2.5–3.5 hrs",
      motorcycle: "~1.5–2 hrs",
    },
    includes: [
      "Everything in the Premium Package",
      "Full interior vacuum",
      "Dash, console and doors",
      "Seats",
      "Mats",
      "Interior windows",
      "Deeper stain cleaning",
    ],
    idealFor: ["Family cars", "Selling or trading in", "A seasonal deep clean"],
    image: "/images/services/full-deluxe.jpg",
    featured: true,
    badge: "Best value",
    pairsWith: ["premium-detail", "working-truck"],
    highlights: [
      "Everything in Premium, outside",
      "Full interior vacuum, seats and mats",
      "Dash, console, doors and interior windows",
    ],
    location: "mobile",
    recommendedAddOns: [],
    aftercare: [
      "If carpets or seats were damp after stain cleaning, crack the windows for a couple of hours to let them dry.",
      "Blot spills right away with a clean towel; rubbing pushes them deeper.",
      "Shake the mats out every week or two to keep dirt from grinding into the carpet.",
    ],
    faq: [
      {
        question: "Can you get every stain out?",
        answer:
          "Deeper stain cleaning lifts most everyday stains. Some old or set-in stains will lighten rather than disappear completely, and we will tell you honestly what to expect before we start.",
      },
      {
        question: "What about pet hair?",
        answer:
          "We vacuum pet hair as part of the interior clean. Heavy, embedded pet hair takes a lot of extra time, so it can add to the price, and we always quote that before any work starts.",
      },
      {
        question: "How long does it take?",
        answer:
          "Plan on roughly two and a half to three and a half hours, depending on the size and condition of the vehicle. We will give you a better estimate when we see the car.",
      },
    ],
  },
  {
    slug: "working-truck",
    name: "Working Truck",
    category: "work",
    tagline: "A tough exterior wash for trucks that get dirty for a living.",
    description:
      "Built for trucks that actually work. An exterior hand wash, wheels and tires, wheel wells, bug and grime removal, door jambs and tire dressing. One starting price for every size; extremely dirty construction, farm or work vehicles add $15 to $30, quoted on site before we start.",
    price: { car: 75, suv: 75, truck: 75, sports: 75, exotic: 75, motorcycle: 75 },
    duration: {
      car: "~1–1.5 hrs",
      suv: "~1–1.5 hrs",
      truck: "~1–1.5 hrs",
      sports: "~1–1.5 hrs",
      exotic: "~1–1.5 hrs",
      motorcycle: "~1–1.5 hrs",
    },
    includes: [
      "Exterior hand wash",
      "Wheels and tires",
      "Wheel wells",
      "Bug and grime removal",
      "Door jambs",
      "Tire dressing",
    ],
    idealFor: ["Construction trucks", "Farm and ranch vehicles", "Contractor work trucks"],
    image: "/images/services/working-truck.jpg",
    badge: "Work vehicles",
    pairsWith: ["full-deluxe"],
    priceSuffix: "starting",
    highlights: [
      "Exterior hand wash",
      "Wheel wells, bugs and grime removed",
      "One starting price for every size",
    ],
    location: "mobile",
    recommendedAddOns: [],
    aftercare: [
      "Rinse heavy mud off before it dries; dried mud is harder on the paint and takes longer to remove.",
      "Hose out the wheel wells after a muddy job; they hold the most grime.",
      "Regular washes keep job-site dust from building up on the paint and trim.",
    ],
    faq: [
      {
        question: "What counts as extremely dirty?",
        answer:
          "Caked mud, heavy job-site dust or grime from construction, farm or work use. That adds $15 to $30 depending on how much there is, and we quote it on site before we start.",
      },
      {
        question: "Why is it the same price for every size?",
        answer:
          "With work trucks, how dirty the truck is matters more than its size, so every work vehicle starts at $75 and any extra for heavy grime is quoted on site.",
      },
      {
        question: "Is the inside of the cab included?",
        answer:
          "No, the Working Truck service is exterior only. If the cab needs cleaning too, ask about the Full Deluxe Package.",
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

/** No add-ons are offered. Every add-on UI hides itself when this is empty. */
export const addOns: AddOn[] = [];

export const serviceCategories: { id: ServiceCategory; label: string }[] = [
  { id: "packages", label: "Packages" },
  { id: "exterior", label: "Exterior" },
  { id: "work", label: "Work vehicles" },
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
      "We come to your home or office. You provide an outdoor spigot and a power outlet; we bring the rest. Early starts are available to beat the afternoon heat.",
  },
  garage: {
    label: "Mobile, garage required",
    shortLabel: "Garage required",
    description:
      "Done at your location in a garage or covered, enclosed space: shade and still air keep desert dust and sun off fresh paint. You provide the space, a spigot and an outlet; we bring the rest.",
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
      title: "Set up at your place",
      description:
        "We park, connect to your outdoor spigot and outlet, and take a quick walk around the car with you.",
    },
    {
      title: "Wheels and tires first",
      description:
        "Wheels and tires are cleaned before the paint so brake dust and road grime never reach the wash mitt.",
    },
    {
      title: "Hand wash",
      description:
        "The car is washed by hand, top to bottom, with clean mitts and plenty of rinse water.",
    },
    {
      title: "Dry and finish",
      description:
        "A careful dry, windows cleaned, tires dressed. Premium adds the jambs, wheel wells, bug removal and a spray wax/sealant.",
    },
  ],
  packages: [
    {
      title: "Walkthrough",
      description:
        "A few minutes at the car to agree on the plan and point out any stains or problem spots inside.",
    },
    {
      title: "Premium exterior",
      description:
        "Deep wheel cleaning, wheel wells, door jambs, bug removal, hand wash, spray wax/sealant and a detailed dry.",
    },
    {
      title: "Interior clean",
      description:
        "A full vacuum, then the dash, console, doors, seats and mats, with deeper stain cleaning where it is needed.",
    },
    {
      title: "Glass and final check",
      description:
        "Interior and exterior windows cleaned, then a final look over the whole car with you.",
    },
  ],
  work: [
    {
      title: "Loosen the grime",
      description:
        "Mud, dust and job-site grime are rinsed and loosened first so they come off without scrubbing them into the paint.",
    },
    {
      title: "Wheels and wheel wells",
      description:
        "Wheels, tires and wheel wells are cleaned out, where most of the mud and grime builds up.",
    },
    {
      title: "Hand wash",
      description: "An exterior hand wash with bug and grime removal, top to bottom.",
    },
    {
      title: "Jambs and tire dressing",
      description:
        "Door jambs wiped out and tires dressed so the truck looks sharp on the next job.",
    },
  ],
};

export type ComparisonValue = boolean | string;

export interface ComparisonFeature {
  label: string;
  /** Keyed by service slug. Missing means not included. */
  values: Partial<Record<string, ComparisonValue>>;
}

const allFour = {
  "basic-wash": true,
  "premium-detail": true,
  "full-deluxe": true,
  "working-truck": true,
} as const;
const premiumAndUp = { "premium-detail": true, "full-deluxe": true } as const;
const deluxeOnly = { "full-deluxe": true } as const;

/** Feature matrix for the Pricing page. Rows are features, columns are services. Built from the client's includes. */
export const comparisonFeatures: ComparisonFeature[] = [
  { label: "Hand wash", values: allFour },
  { label: "Wheels and tires", values: allFour },
  {
    label: "Tire shine",
    values: {
      "basic-wash": true,
      "premium-detail": true,
      "full-deluxe": true,
      "working-truck": "Tire dressing",
    },
  },
  { label: "Windows", values: { "basic-wash": true, "premium-detail": true, "full-deluxe": true } },
  {
    label: "Exterior wipe-down",
    values: { "basic-wash": true, "premium-detail": true, "full-deluxe": true },
  },
  { label: "Deep wheel cleaning", values: premiumAndUp },
  { label: "Wheel wells", values: { ...premiumAndUp, "working-truck": true } },
  { label: "Door jambs", values: { ...premiumAndUp, "working-truck": true } },
  { label: "Bug removal", values: { ...premiumAndUp, "working-truck": "Bugs and grime" } },
  { label: "Spray wax/sealant", values: premiumAndUp },
  { label: "Interior vacuum", values: deluxeOnly },
  { label: "Dash, console and doors", values: deluxeOnly },
  { label: "Seats", values: deluxeOnly },
  { label: "Mats", values: deluxeOnly },
  { label: "Interior windows", values: deluxeOnly },
  { label: "Deeper stain cleaning", values: deluxeOnly },
];

export interface PriceFactor {
  title: string;
  description: string;
  /** What it can add, e.g. "+$15–$30". */
  amount?: string;
}

/** Things that can change a quote. Always quoted before work starts. */
export const priceFactors: PriceFactor[] = [
  {
    title: "Extremely dirty trucks, SUVs and work vehicles",
    description:
      "Construction, farm or work vehicles, and any truck or SUV, with caked mud, heavy job-site grime or off-road build-up.",
    amount: "+$15–$30",
  },
  {
    title: "Heavy soil",
    description:
      "Mud, sand, spills or build-up well beyond normal daily use takes extra time to clean safely.",
  },
  {
    title: "Pet hair",
    description:
      "Heavy, embedded pet hair in carpet and seats needs a lot of extra vacuuming time.",
  },
];

/** Range applied for heavy soil and pet hair, as a percentage of the base price. */
export const priceFactorRange = { min: 15, max: 30 } as const;

/** Parse an add-on duration such as "+45 min" into minutes. */
export function addOnMinutes(addOn: Pick<AddOn, "duration">) {
  const match = addOn.duration.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

/** Lowest and highest starting price for a service across all vehicle sizes (motorcycle to exotic). */
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
  return typeof value === "string" && (vehicleSizeIds as string[]).includes(value);
}

/** Render a service price for one size, honoring open-ended notes: "$50", "from $100", "$150+". */
export function formatServicePrice(
  service: Pick<Service, "price" | "priceNote">,
  size: VehicleSize,
) {
  const amount = formatPrice(service.price[size]);
  const note = service.priceNote?.[size];
  if (note === "from") return `from ${amount}`;
  if (note === "plus") return `${amount}+`;
  return amount;
}
