export type GalleryCategory = "exterior" | "interior" | "work-vehicles" | "exotic";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: GalleryCategory;
  vehicle: string;
  service: string;
  width: number;
  height: number;
  /** Optional paired image for before/after comparisons. */
  before?: string;
  /** Highlighted work: shown first and badged in the gallery. */
  featured?: boolean;
  /** "client" = the business's own job photos. Omitted means licensed stock (see /public/images/CREDITS.md). */
  source?: "client" | "stock";
}

/** All sources live in /public/images. Width/height match the files on disk so layouts never shift. */
export const galleryItems: GalleryItem[] = [
  // Client photos: a Ruby Red Shelby GT350 mobile wash in the owner's driveway. Plates blurred.
  {
    id: "g00b",
    src: "/images/work/shelby-gt350-two-bucket.jpg",
    alt: "Rear of a red Shelby GT350 mid-wash with separate wash and rinse buckets on the pavement beside it",
    title: "Mid-wash, two-bucket method",
    category: "exterior",
    vehicle: "Ford Mustang Shelby GT350",
    service: "Premium Package",
    width: 1600,
    height: 2133,
    featured: true,
    source: "client",
  },
  {
    id: "g00c",
    src: "/images/work/shelby-gt350-rinse.jpg",
    alt: "Red Shelby GT350 front end beaded with water after a rinse, parked in a residential driveway",
    title: "Fresh rinse, mobile service",
    category: "exterior",
    vehicle: "Ford Mustang Shelby GT350",
    service: "Premium Package",
    width: 1600,
    height: 2133,
    featured: true,
    source: "client",
  },
  {
    id: "g00d",
    src: "/images/work/shelby-gt350-wash-rear.jpg",
    alt: "Detailer hand washing the roof of a red Shelby GT350 at the curb, with wash buckets behind the car",
    title: "Hand wash, curbside",
    category: "exterior",
    vehicle: "Ford Mustang Shelby GT350",
    service: "Premium Package",
    width: 1600,
    height: 2133,
    featured: true,
    source: "client",
  },
  {
    id: "g00e",
    src: "/images/work/shelby-gt350-finish.jpg",
    alt: "Side profile of a red Shelby GT350 reflecting the sky after its wash, with the wet driveway still drying",
    title: "GT350, hand wax finish",
    category: "exterior",
    vehicle: "Ford Mustang Shelby GT350",
    service: "Premium Package",
    width: 1600,
    height: 2133,
    featured: true,
    source: "client",
  },
  {
    id: "g01",
    src: "/images/hero-amg-dark.jpg",
    alt: "Black Mercedes-AMG GT with glossy paint, parked on a harbor road",
    title: "AMG GT, detailed",
    category: "exotic",
    vehicle: "Mercedes-AMG GT",
    service: "Premium Package",
    width: 2400,
    height: 3415,
    source: "stock",
  },
  {
    id: "g02",
    src: "/images/detail-foam-porsche.jpg",
    alt: "Detailer hand washing a black Porsche covered in foam",
    title: "Foam pre-soak",
    category: "exterior",
    vehicle: "Porsche Taycan",
    service: "Basic Package",
    width: 1800,
    height: 1200,
    source: "stock",
  },
  {
    id: "g03",
    src: "/images/detail-wash-gtr.jpg",
    alt: "Water spraying off a Nissan GT-R during a rinse",
    title: "Rinse stage",
    category: "exterior",
    vehicle: "Nissan GT-R",
    service: "Basic Package",
    width: 1800,
    height: 1013,
    source: "stock",
  },
  {
    id: "g04",
    src: "/images/detail-interior-dash.jpg",
    alt: "Detailed dashboard and steering wheel of a modern truck interior",
    title: "Dash and console",
    category: "interior",
    vehicle: "Ram 1500",
    service: "Full Deluxe Package",
    width: 1800,
    height: 1440,
    source: "stock",
  },
  {
    id: "g05",
    src: "/images/detail-paint-closeup-red.jpg",
    alt: "Close-up of glossy red paint on a hatchback front fender",
    title: "Red, detailed",
    category: "exterior",
    vehicle: "Hyundai i30 N",
    service: "Premium Package",
    width: 1800,
    height: 2400,
    source: "stock",
  },
  {
    id: "g06",
    src: "/images/hero-ferrari-garage.jpg",
    alt: "Red Ferrari LaFerrari in a clean, bright showroom space",
    title: "LaFerrari, detailed",
    category: "exotic",
    vehicle: "Ferrari LaFerrari",
    service: "Premium Package",
    width: 2400,
    height: 1600,
    source: "stock",
  },
  {
    id: "g07",
    src: "/images/car-bmw-m4-grey.jpg",
    alt: "Grey BMW M4 with glossy paint at dusk",
    title: "M4, detailed",
    category: "exterior",
    vehicle: "BMW M4",
    service: "Full Deluxe Package",
    width: 1600,
    height: 2000,
    source: "stock",
  },
  {
    id: "g08",
    src: "/images/car-lambo-garage.jpg",
    alt: "Orange Lamborghini Huracán parked indoors",
    title: "Huracán, detailed",
    category: "exotic",
    vehicle: "Lamborghini Huracán",
    service: "Premium Package",
    width: 1600,
    height: 1863,
    source: "stock",
  },
  {
    id: "g09",
    src: "/images/car-tesla-model-y.jpg",
    alt: "White Tesla Model Y parked outdoors",
    title: "Model Y, washed",
    category: "exterior",
    vehicle: "Tesla Model Y",
    service: "Basic Package",
    width: 1600,
    height: 1068,
    source: "stock",
  },
  {
    id: "g10",
    src: "/images/car-sedan-daily.jpg",
    alt: "Blue Nissan Altima sedan after a detail",
    title: "Daily driver reset",
    category: "exterior",
    vehicle: "Nissan Altima",
    service: "Full Deluxe Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g11",
    src: "/images/car-suv-white.jpg",
    alt: "White Ford Explorer SUV after exterior detail",
    title: "Family SUV",
    category: "exterior",
    vehicle: "Ford Explorer",
    service: "Full Deluxe Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g12",
    src: "/images/car-amg-gt-red.jpg",
    alt: "Red Mercedes-AMG GT on a forest road",
    title: "AMG GT, detailed",
    category: "exotic",
    vehicle: "Mercedes-AMG GT",
    service: "Premium Package",
    width: 1600,
    height: 1126,
    source: "stock",
  },
  {
    id: "g13",
    src: "/images/car-mustang-grey.jpg",
    alt: "Grey Ford Mustang on an airfield",
    title: "Mustang, washed",
    category: "exterior",
    vehicle: "Ford Mustang GT",
    service: "Basic Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g14",
    src: "/images/car-gwagon.jpg",
    alt: "Mercedes G-Class parked on a cobblestone street",
    title: "G-Wagon, detailed",
    category: "exotic",
    vehicle: "Mercedes G 63",
    service: "Premium Package",
    width: 1600,
    height: 1157,
    source: "stock",
  },
  {
    id: "g15",
    src: "/images/car-audi-rs7.jpg",
    alt: "Silver Audi RS7 in the mountains",
    title: "RS7, detailed",
    category: "exterior",
    vehicle: "Audi RS7",
    service: "Premium Package",
    width: 1600,
    height: 2155,
    source: "stock",
  },
  {
    id: "g16",
    src: "/images/car-bmw-7-silver.jpg",
    alt: "Silver BMW 7 Series by the water",
    title: "7 Series, detailed",
    category: "exterior",
    vehicle: "BMW 750i",
    service: "Full Deluxe Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g17",
    src: "/images/car-mclaren-white.jpg",
    alt: "White McLaren 720S in a rural setting",
    title: "720S, detailed",
    category: "exotic",
    vehicle: "McLaren 720S",
    service: "Premium Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g18",
    src: "/images/car-bmw-m5-white.jpg",
    alt: "White BMW M5 driving in the city",
    title: "M5, washed",
    category: "exterior",
    vehicle: "BMW M5",
    service: "Basic Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g19",
    src: "/images/car-camaro-blue.jpg",
    alt: "Blue Chevrolet Camaro SS in the desert",
    title: "Camaro, detailed",
    category: "exterior",
    vehicle: "Chevrolet Camaro SS",
    service: "Premium Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g20",
    src: "/images/car-jaguar-red.jpg",
    alt: "Red Jaguar F-Type in front of a building",
    title: "F-Type, detailed",
    category: "exotic",
    vehicle: "Jaguar F-Type",
    service: "Premium Package",
    width: 1600,
    height: 2206,
    source: "stock",
  },
  {
    id: "g21",
    src: "/images/car-tesla-roadster.jpg",
    alt: "White Tesla Roadster in a showroom",
    title: "Showroom finish",
    category: "exotic",
    vehicle: "Tesla Roadster",
    service: "Premium Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g22",
    src: "/images/car-suv-dusk.jpg",
    alt: "Dark SUV driving on a forest road at dusk",
    title: "SUV at dusk",
    category: "exterior",
    vehicle: "Mitsubishi Montero",
    service: "Basic Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g23",
    src: "/images/car-bmw-m4-white.jpg",
    alt: "White BMW M4 on a city street",
    title: "M4, washed",
    category: "exterior",
    vehicle: "BMW M4",
    service: "Basic Package",
    width: 1600,
    height: 926,
    source: "stock",
  },
  {
    id: "g24",
    src: "/images/car-purple-supercar.jpg",
    alt: "Color-shift purple Chevrolet Corvette with carbon aero on a rooftop",
    title: "Carbon and purple",
    category: "exotic",
    vehicle: "Chevrolet Corvette",
    service: "Premium Package",
    width: 1600,
    height: 2400,
    source: "stock",
  },
  {
    id: "g25",
    src: "/images/car-amg-gt-yellow.jpg",
    alt: "Yellow Mercedes-AMG GT S on an open road under a clear sky",
    title: "GT S, detailed",
    category: "exotic",
    vehicle: "Mercedes-AMG GT S",
    service: "Premium Package",
    width: 1600,
    height: 2000,
    source: "stock",
  },
  {
    id: "g26",
    src: "/images/car-bugatti.jpg",
    alt: "White Bugatti Chiron front end with headlights on at night",
    title: "Chiron, detailed",
    category: "exotic",
    vehicle: "Bugatti Chiron",
    service: "Premium Package",
    width: 1600,
    height: 1200,
    source: "stock",
  },
  {
    id: "g27",
    src: "/images/car-lambo-orange.jpg",
    alt: "Orange Lamborghini Aventador parked in a dark forest",
    title: "Aventador, detailed",
    category: "exotic",
    vehicle: "Lamborghini Aventador",
    service: "Premium Package",
    width: 1600,
    height: 2057,
    source: "stock",
  },
  {
    id: "g28",
    src: "/images/car-lambo-yellow.jpg",
    alt: "Yellow Lamborghini Huracán on a tree-lined street",
    title: "Huracán, washed",
    category: "exotic",
    vehicle: "Lamborghini Huracán",
    service: "Basic Package",
    width: 1600,
    height: 1067,
    source: "stock",
  },
  {
    id: "g29",
    src: "/images/car-mustang-green.jpg",
    alt: "Green Ford Mustang GT seen from above in a parking structure",
    title: "Mustang, detailed",
    category: "exterior",
    vehicle: "Ford Mustang GT",
    service: "Premium Package",
    width: 1600,
    height: 2400,
    source: "stock",
  },
  {
    id: "g30",
    src: "/images/hero-garage.jpg",
    alt: "White Chevrolet Camaro ZL1 under low light among collector cars",
    title: "ZL1, detailed",
    category: "exotic",
    vehicle: "Chevrolet Camaro ZL1",
    service: "Premium Package",
    width: 2400,
    height: 1418,
    source: "stock",
  },
  {
    id: "g31",
    src: "/images/hero-panamera.jpg",
    alt: "Black Porsche Panamera Turbo driving on a highway",
    title: "Panamera, washed",
    category: "exterior",
    vehicle: "Porsche Panamera Turbo",
    service: "Basic Package",
    width: 2400,
    height: 1600,
    source: "stock",
  },
  {
    id: "g32",
    src: "/images/hero-r8-mountains.jpg",
    alt: "Grey Audi R8 on a mountain road at sunset",
    title: "R8, detailed",
    category: "exotic",
    vehicle: "Audi R8",
    service: "Premium Package",
    width: 2400,
    height: 1602,
    source: "stock",
  },
  {
    id: "g33",
    src: "/images/hero-aston-sunset.jpg",
    alt: "Aston Martin parked beneath a concrete overpass at golden hour",
    title: "Aston, golden hour",
    category: "exotic",
    vehicle: "Aston Martin DB11",
    service: "Premium Package",
    width: 2400,
    height: 1600,
    source: "stock",
  },
];

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "work-vehicles", label: "Work vehicles" },
  { id: "exotic", label: "Exotics & show cars" },
];

/** Real client photos only. Stock entries are never shown as our work. */
export const clientGalleryItems = galleryItems.filter((item) => item.source === "client");

export interface CompareImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CompareShowcase {
  id: string;
  title: string;
  /** What changed, in one specific line. */
  result: string;
  vehicle: string;
  /** Finished state, revealed on the right. */
  after: CompareImage;
  /**
   * Starting state, revealed on the left. When omitted the "after" frame is
   * rendered with a weathered treatment to illustrate the difference.
   */
  before?: CompareImage;
  labels?: { before: string; after: string };
  /** True for real photos from the job (shown with an "Our work" badge). */
  client?: boolean;
  /** Initial divider position, 0–100. */
  start?: number;
}

/**
 * Before/after showcase on /gallery. Real frames from client jobs only; the slider
 * still supports a simulated "before" but it is not used, so nothing is staged.
 */
export const compareShowcase: CompareShowcase[] = [
  {
    id: "c1",
    title: "Premium Package — Exterior Detail",
    result:
      "From road film to a dry, streak-free gloss in one mobile visit, without moving the car from the driveway.",
    vehicle: "Ford Mustang Shelby GT350",
    before: {
      src: "/images/work/shelby-gt350-rinse.jpg",
      alt: "Red Shelby GT350 covered in water and road film during the rinse stage",
      width: 1600,
      height: 2133,
    },
    after: {
      src: "/images/work/shelby-gt350-finish.jpg",
      alt: "The same Shelby GT350 finished, with clean glossy paint reflecting the sky",
      width: 1600,
      height: 2133,
    },
    labels: { before: "Mid-wash", after: "Finished" },
    client: true,
    start: 50,
  },
];

export function getGalleryItem(id: string) {
  return galleryItems.find((item) => item.id === id);
}
