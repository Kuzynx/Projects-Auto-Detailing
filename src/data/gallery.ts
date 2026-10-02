export type GalleryCategory = "exterior" | "interior" | "correction" | "coating" | "studio";

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
}

/** All sources live in /public/images. Dimensions are the downloaded originals' aspect hints. */
export const galleryItems: GalleryItem[] = [
  { id: "g01", src: "/images/hero-amg-dark.jpg", alt: "Black Mercedes-AMG GT after ceramic coating under studio lights", title: "AMG GT, coated", category: "coating", vehicle: "Mercedes-AMG GT", service: "Ceramic Coating", width: 2400, height: 1600 },
  { id: "g02", src: "/images/detail-foam-porsche.jpg", alt: "Technician hand washing a black Porsche covered in foam", title: "Foam pre-soak", category: "exterior", vehicle: "Porsche Panamera", service: "Signature Wash", width: 1800, height: 1200 },
  { id: "g03", src: "/images/detail-wash-gtr.jpg", alt: "Water spraying off a Nissan GT-R during a rinse", title: "Rinse stage", category: "exterior", vehicle: "Nissan GT-R", service: "Signature Wash", width: 1800, height: 1200 },
  { id: "g04", src: "/images/detail-interior-dash.jpg", alt: "Detailed dashboard and steering wheel of a modern truck interior", title: "Dash and console", category: "interior", vehicle: "Ram 1500", service: "Interior Refresh", width: 1800, height: 1200 },
  { id: "g05", src: "/images/detail-paint-closeup-red.jpg", alt: "Close-up of corrected red paint on a hatchback front fender", title: "Red, corrected", category: "correction", vehicle: "Hyundai i30 N", service: "Paint Correction", width: 1800, height: 1200 },
  { id: "g06", src: "/images/hero-ferrari-garage.jpg", alt: "Red Ferrari LaFerrari in a clean garage", title: "LaFerrari, studio", category: "studio", vehicle: "Ferrari LaFerrari", service: "Ceramic Coating", width: 2400, height: 1600 },
  { id: "g07", src: "/images/car-bmw-m4-grey.jpg", alt: "Grey BMW M4 with glossy paint at dusk", title: "M4, full detail", category: "exterior", vehicle: "BMW M4", service: "The Full Detail", width: 1600, height: 1067 },
  { id: "g08", src: "/images/car-lambo-garage.jpg", alt: "Orange Lamborghini Huracán Spyder in a garage", title: "Huracán, coated", category: "coating", vehicle: "Lamborghini Huracán", service: "Ceramic Coating", width: 1600, height: 1067 },
  { id: "g09", src: "/images/car-tesla-model-y.jpg", alt: "White Tesla Model Y parked outdoors", title: "Model Y, maintenance", category: "exterior", vehicle: "Tesla Model Y", service: "Maintenance Plan", width: 1600, height: 1067 },
  { id: "g10", src: "/images/car-sedan-daily.jpg", alt: "Blue Nissan Altima sedan after a detail", title: "Daily driver reset", category: "exterior", vehicle: "Nissan Altima", service: "The Full Detail", width: 1600, height: 1067 },
  { id: "g11", src: "/images/car-suv-white.jpg", alt: "White Ford Explorer SUV after exterior detail", title: "Family SUV", category: "exterior", vehicle: "Ford Explorer", service: "The Full Detail", width: 1600, height: 1067 },
  { id: "g12", src: "/images/car-amg-gt-red.jpg", alt: "Red Mercedes-AMG GT on a forest road", title: "AMG GT, corrected", category: "correction", vehicle: "Mercedes-AMG GT", service: "Paint Correction", width: 1600, height: 1067 },
  { id: "g13", src: "/images/car-mustang-grey.jpg", alt: "Grey Ford Mustang on an airfield", title: "Mustang, washed", category: "exterior", vehicle: "Ford Mustang GT", service: "Signature Wash", width: 1600, height: 1067 },
  { id: "g14", src: "/images/car-gwagon.jpg", alt: "Mercedes G-Class parked on a European street", title: "G-Wagon, coated", category: "coating", vehicle: "Mercedes G 63", service: "Ceramic Coating", width: 1600, height: 1067 },
  { id: "g15", src: "/images/car-audi-rs7.jpg", alt: "Silver Audi RS7 in the mountains", title: "RS7, corrected", category: "correction", vehicle: "Audi RS7", service: "Paint Correction", width: 1600, height: 1067 },
  { id: "g16", src: "/images/car-bmw-7-silver.jpg", alt: "Silver BMW 7 Series by the water", title: "7 Series, full detail", category: "exterior", vehicle: "BMW 750i", service: "The Full Detail", width: 1600, height: 1067 },
  { id: "g17", src: "/images/car-mclaren-white.jpg", alt: "White McLaren 720S in a rural setting", title: "720S, studio", category: "studio", vehicle: "McLaren 720S", service: "Ceramic Coating", width: 1600, height: 1067 },
  { id: "g18", src: "/images/car-bmw-m5-white.jpg", alt: "White BMW M5 driving in the city", title: "M5, maintenance", category: "exterior", vehicle: "BMW M5", service: "Maintenance Plan", width: 1600, height: 1067 },
  { id: "g19", src: "/images/car-camaro-blue.jpg", alt: "Blue Chevrolet Camaro SS in the desert", title: "Camaro, corrected", category: "correction", vehicle: "Chevrolet Camaro SS", service: "Paint Correction", width: 1600, height: 1067 },
  { id: "g20", src: "/images/car-jaguar-red.jpg", alt: "Red Jaguar F-Type in front of a building", title: "F-Type, coated", category: "coating", vehicle: "Jaguar F-Type", service: "Ceramic Coating", width: 1600, height: 1067 },
  { id: "g21", src: "/images/car-tesla-roadster.jpg", alt: "White Tesla Roadster in a showroom", title: "Showroom finish", category: "studio", vehicle: "Tesla Roadster", service: "Ceramic Coating", width: 1600, height: 1067 },
  { id: "g22", src: "/images/car-suv-dusk.jpg", alt: "Black SUV driving at dusk", title: "SUV at dusk", category: "exterior", vehicle: "Range Rover Classic", service: "Signature Wash", width: 1600, height: 1067 },
  { id: "g23", src: "/images/car-bmw-m4-white.jpg", alt: "White BMW M4 on a city street", title: "M4, washed", category: "exterior", vehicle: "BMW M4", service: "Signature Wash", width: 1600, height: 1067 },
  { id: "g24", src: "/images/car-purple-supercar.jpg", alt: "Purple supercar with carbon fiber bodywork", title: "Carbon and purple", category: "studio", vehicle: "Rimac Concept One", service: "Paint Correction", width: 1600, height: 1067 },
];

export const galleryCategories: { id: GalleryCategory | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "correction", label: "Paint correction" },
  { id: "coating", label: "Ceramic coating" },
  { id: "studio", label: "Studio" },
];
