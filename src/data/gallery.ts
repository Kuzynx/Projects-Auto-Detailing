export type GalleryCategory = "exterior" | "interior" | "correction" | "coating" | "exotic";

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
    service: "Signature Wash & Protect",
    width: 1600,
    height: 2133,
    featured: true,
    source: "client",
  },
  {
    id: "g00c",
    src: "/images/work/shelby-gt350-rinse.jpg",
    alt: "Red Shelby GT350 front end beaded with water after a rinse, parked in a driveway in front of an open garage",
    title: "Fresh rinse, mobile service",
    category: "exterior",
    vehicle: "Ford Mustang Shelby GT350",
    service: "Signature Wash & Protect",
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
    service: "Signature Wash & Protect",
    width: 1600,
    height: 2133,
    featured: true,
    source: "client",
  },
  {
    id: "g00e",
    src: "/images/work/shelby-gt350-finish.jpg",
    alt: "Side profile of a red Shelby GT350 reflecting the sky after its wash, with the wet driveway still drying",
    title: "GT350, wet-look gloss",
    category: "exterior",
    vehicle: "Ford Mustang Shelby GT350",
    service: "Signature Wash & Protect",
    width: 1600,
    height: 2133,
    featured: true,
    source: "client",
  },
  {
    id: "g01",
    src: "/images/hero-amg-dark.jpg",
    alt: "Black Mercedes-AMG GT after ceramic coating, parked on a harbor road",
    title: "AMG GT, coated",
    category: "coating",
    vehicle: "Mercedes-AMG GT",
    service: "Ceramic Coating",
    width: 2400,
    height: 3415,
  },
  {
    id: "g02",
    src: "/images/detail-foam-porsche.jpg",
    alt: "Technician hand washing a black Porsche covered in foam",
    title: "Foam pre-soak",
    category: "exterior",
    vehicle: "Porsche Taycan",
    service: "Signature Wash",
    width: 1800,
    height: 1200,
  },
  {
    id: "g03",
    src: "/images/detail-wash-gtr.jpg",
    alt: "Water spraying off a Nissan GT-R during a rinse",
    title: "Rinse stage",
    category: "exterior",
    vehicle: "Nissan GT-R",
    service: "Signature Wash",
    width: 1800,
    height: 1013,
  },
  {
    id: "g04",
    src: "/images/detail-interior-dash.jpg",
    alt: "Detailed dashboard and steering wheel of a modern truck interior",
    title: "Dash and console",
    category: "interior",
    vehicle: "Ram 1500",
    service: "Interior Refresh",
    width: 1800,
    height: 1440,
  },
  {
    id: "g05",
    src: "/images/detail-paint-closeup-red.jpg",
    alt: "Close-up of corrected red paint on a hatchback front fender",
    title: "Red, corrected",
    category: "correction",
    vehicle: "Hyundai i30 N",
    service: "Paint Correction",
    width: 1800,
    height: 2400,
  },
  {
    id: "g06",
    src: "/images/hero-ferrari-garage.jpg",
    alt: "Red Ferrari LaFerrari in a clean garage",
    title: "LaFerrari, coated",
    category: "exotic",
    vehicle: "Ferrari LaFerrari",
    service: "Ceramic Coating",
    width: 2400,
    height: 1600,
  },
  {
    id: "g07",
    src: "/images/car-bmw-m4-grey.jpg",
    alt: "Grey BMW M4 with glossy paint at dusk",
    title: "M4, full detail",
    category: "exterior",
    vehicle: "BMW M4",
    service: "The Full Detail",
    width: 1600,
    height: 2000,
  },
  {
    id: "g08",
    src: "/images/car-lambo-garage.jpg",
    alt: "Orange Lamborghini Huracán in a garage",
    title: "Huracán, coated",
    category: "coating",
    vehicle: "Lamborghini Huracán",
    service: "Ceramic Coating",
    width: 1600,
    height: 1863,
  },
  {
    id: "g09",
    src: "/images/car-tesla-model-y.jpg",
    alt: "White Tesla Model Y parked outdoors",
    title: "Model Y, maintenance",
    category: "exterior",
    vehicle: "Tesla Model Y",
    service: "Maintenance Plan",
    width: 1600,
    height: 1068,
  },
  {
    id: "g10",
    src: "/images/car-sedan-daily.jpg",
    alt: "Blue Nissan Altima sedan after a detail",
    title: "Daily driver reset",
    category: "exterior",
    vehicle: "Nissan Altima",
    service: "The Full Detail",
    width: 1600,
    height: 1067,
  },
  {
    id: "g11",
    src: "/images/car-suv-white.jpg",
    alt: "White Ford Explorer SUV after exterior detail",
    title: "Family SUV",
    category: "exterior",
    vehicle: "Ford Explorer",
    service: "The Full Detail",
    width: 1600,
    height: 1067,
  },
  {
    id: "g12",
    src: "/images/car-amg-gt-red.jpg",
    alt: "Red Mercedes-AMG GT on a forest road",
    title: "AMG GT, corrected",
    category: "correction",
    vehicle: "Mercedes-AMG GT",
    service: "Paint Correction",
    width: 1600,
    height: 1126,
  },
  {
    id: "g13",
    src: "/images/car-mustang-grey.jpg",
    alt: "Grey Ford Mustang on an airfield",
    title: "Mustang, washed",
    category: "exterior",
    vehicle: "Ford Mustang GT",
    service: "Signature Wash",
    width: 1600,
    height: 1067,
  },
  {
    id: "g14",
    src: "/images/car-gwagon.jpg",
    alt: "Mercedes G-Class parked on a cobblestone street",
    title: "G-Wagon, coated",
    category: "coating",
    vehicle: "Mercedes G 63",
    service: "Ceramic Coating",
    width: 1600,
    height: 1157,
  },
  {
    id: "g15",
    src: "/images/car-audi-rs7.jpg",
    alt: "Silver Audi RS7 in the mountains",
    title: "RS7, corrected",
    category: "correction",
    vehicle: "Audi RS7",
    service: "Paint Correction",
    width: 1600,
    height: 2155,
  },
  {
    id: "g16",
    src: "/images/car-bmw-7-silver.jpg",
    alt: "Silver BMW 7 Series by the water",
    title: "7 Series, full detail",
    category: "exterior",
    vehicle: "BMW 750i",
    service: "The Full Detail",
    width: 1600,
    height: 1067,
  },
  {
    id: "g17",
    src: "/images/car-mclaren-white.jpg",
    alt: "White McLaren 720S in a rural setting",
    title: "720S, coated",
    category: "exotic",
    vehicle: "McLaren 720S",
    service: "Ceramic Coating",
    width: 1600,
    height: 1067,
  },
  {
    id: "g18",
    src: "/images/car-bmw-m5-white.jpg",
    alt: "White BMW M5 driving in the city",
    title: "M5, maintenance",
    category: "exterior",
    vehicle: "BMW M5",
    service: "Maintenance Plan",
    width: 1600,
    height: 1067,
  },
  {
    id: "g19",
    src: "/images/car-camaro-blue.jpg",
    alt: "Blue Chevrolet Camaro SS in the desert",
    title: "Camaro, corrected",
    category: "correction",
    vehicle: "Chevrolet Camaro SS",
    service: "Paint Correction",
    width: 1600,
    height: 1067,
  },
  {
    id: "g20",
    src: "/images/car-jaguar-red.jpg",
    alt: "Red Jaguar F-Type in front of a building",
    title: "F-Type, coated",
    category: "coating",
    vehicle: "Jaguar F-Type",
    service: "Ceramic Coating",
    width: 1600,
    height: 2206,
  },
  {
    id: "g21",
    src: "/images/car-tesla-roadster.jpg",
    alt: "White Tesla Roadster in a showroom",
    title: "Showroom finish",
    category: "exotic",
    vehicle: "Tesla Roadster",
    service: "Ceramic Coating",
    width: 1600,
    height: 1067,
  },
  {
    id: "g22",
    src: "/images/car-suv-dusk.jpg",
    alt: "Dark SUV driving on a forest road at dusk",
    title: "SUV at dusk",
    category: "exterior",
    vehicle: "Mitsubishi Montero",
    service: "Signature Wash",
    width: 1600,
    height: 1067,
  },
  {
    id: "g23",
    src: "/images/car-bmw-m4-white.jpg",
    alt: "White BMW M4 on a city street",
    title: "M4, washed",
    category: "exterior",
    vehicle: "BMW M4",
    service: "Signature Wash",
    width: 1600,
    height: 926,
  },
  {
    id: "g24",
    src: "/images/car-purple-supercar.jpg",
    alt: "Color-shift purple Chevrolet Corvette with carbon aero on a rooftop",
    title: "Carbon and purple",
    category: "exotic",
    vehicle: "Chevrolet Corvette",
    service: "Paint Correction",
    width: 1600,
    height: 2400,
  },
  {
    id: "g25",
    src: "/images/car-amg-gt-yellow.jpg",
    alt: "Yellow Mercedes-AMG GT S on an open road under a clear sky",
    title: "GT S, coated",
    category: "coating",
    vehicle: "Mercedes-AMG GT S",
    service: "Ceramic Coating",
    width: 1600,
    height: 2000,
  },
  {
    id: "g26",
    src: "/images/car-bugatti.jpg",
    alt: "White Bugatti Chiron front end with headlights on at night",
    title: "Chiron, coated",
    category: "exotic",
    vehicle: "Bugatti Chiron",
    service: "Ceramic Coating",
    width: 1600,
    height: 1200,
  },
  {
    id: "g27",
    src: "/images/car-lambo-orange.jpg",
    alt: "Orange Lamborghini Aventador parked in a dark forest",
    title: "Aventador, corrected",
    category: "correction",
    vehicle: "Lamborghini Aventador",
    service: "Paint Correction",
    width: 1600,
    height: 2057,
  },
  {
    id: "g28",
    src: "/images/car-lambo-yellow.jpg",
    alt: "Yellow Lamborghini Huracán on a tree-lined street",
    title: "Huracán, washed",
    category: "exterior",
    vehicle: "Lamborghini Huracán",
    service: "Signature Wash",
    width: 1600,
    height: 1067,
  },
  {
    id: "g29",
    src: "/images/car-mustang-green.jpg",
    alt: "Green Ford Mustang GT seen from above in a parking structure",
    title: "Mustang, corrected",
    category: "correction",
    vehicle: "Ford Mustang GT",
    service: "Paint Correction",
    width: 1600,
    height: 2400,
  },
  {
    id: "g30",
    src: "/images/hero-garage.jpg",
    alt: "White Chevrolet Camaro ZL1 under low light in a collector garage",
    title: "ZL1, coated",
    category: "exotic",
    vehicle: "Chevrolet Camaro ZL1",
    service: "Ceramic Coating",
    width: 2400,
    height: 1418,
  },
  {
    id: "g31",
    src: "/images/hero-panamera.jpg",
    alt: "Black Porsche Panamera Turbo driving on a highway",
    title: "Panamera, maintained",
    category: "exterior",
    vehicle: "Porsche Panamera Turbo",
    service: "Maintenance Plan",
    width: 2400,
    height: 1600,
  },
  {
    id: "g32",
    src: "/images/hero-r8-mountains.jpg",
    alt: "Grey Audi R8 on a mountain road at sunset",
    title: "R8, coated",
    category: "coating",
    vehicle: "Audi R8",
    service: "Ceramic Coating",
    width: 2400,
    height: 1602,
  },
  {
    id: "g33",
    src: "/images/hero-aston-sunset.jpg",
    alt: "Aston Martin parked beneath a concrete overpass at golden hour",
    title: "Aston, golden hour",
    category: "coating",
    vehicle: "Aston Martin DB11",
    service: "Ceramic Coating",
    width: 2400,
    height: 1600,
  },
];

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "correction", label: "Paint correction" },
  { id: "coating", label: "Ceramic coating" },
  { id: "exotic", label: "Exotics & show cars" },
];

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
 * Before/after showcase on /gallery. The first entry uses two real frames from the
 * same client job. The others are illustrative until true paired photos are on file.
 */
export const compareShowcase: CompareShowcase[] = [
  {
    id: "c1",
    title: "Same car, same afternoon",
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
  {
    id: "c2",
    title: "Two-stage correction",
    result: "Swirls and wash marring cut back, gloss restored to a mirror finish.",
    vehicle: "Ford Mustang GT",
    after: {
      src: "/images/car-mustang-green.jpg",
      alt: "Green Ford Mustang GT with corrected, high-gloss paint seen from above",
      width: 1600,
      height: 2400,
    },
    start: 45,
  },
  {
    id: "c3",
    title: "Decon and ceramic coating",
    result: "Iron fallout and road film removed, then sealed under a 3-year coating.",
    vehicle: "Mercedes-AMG GT S",
    after: {
      src: "/images/car-amg-gt-yellow.jpg",
      alt: "Yellow Mercedes-AMG GT S with fresh ceramic coating on an open road",
      width: 1600,
      height: 2000,
    },
    start: 55,
  },
];

export function getGalleryItem(id: string) {
  return galleryItems.find((item) => item.id === id);
}
