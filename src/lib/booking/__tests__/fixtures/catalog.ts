/**
 * Synthetic service catalog for booking tests. It is merged over the real
 * `@/data/services` module (vehicle types, price factors and helpers stay real),
 * so slot, pricing and garage rules can be tested without depending on the
 * client's live catalog, which changes independently.
 *
 *   vi.mock("@/data/services", async (importOriginal) =>
 *     (await import("./fixtures/catalog")).withFixtureCatalog(await importOriginal()),
 *   );
 */
import type { AddOn, Service, VehicleSize } from "@/data/services";

type Sized<T> = Record<VehicleSize, T>;

const sized = <T>(car: T, overrides: Partial<Sized<T>> = {}): Sized<T> =>
  ({
    car,
    suv: car,
    truck: car,
    sports: car,
    exotic: car,
    motorcycle: car,
    ...overrides,
  }) as Sized<T>;

function service(fields: Partial<Service> & Pick<Service, "slug" | "name">): Service {
  return {
    category: "exterior",
    tagline: `${fields.name} tagline`,
    description: "",
    includes: [],
    idealFor: [],
    image: "/images/logo.png",
    highlights: [],
    location: "mobile",
    recommendedAddOns: [],
    aftercare: [],
    faq: [],
    ...fields,
  } as unknown as Service;
}

export const fixtureServices: Service[] = [
  service({
    slug: "fx-wash",
    name: "Fixture Wash",
    price: sized(50, { suv: 60, truck: 70, sports: 80, exotic: 100, motorcycle: 40 }),
    priceNote: { exotic: "from" },
    duration: sized("1.5 hrs", { suv: "2 hrs", truck: "2.5 hrs" }),
  }),
  service({
    slug: "fx-full",
    name: "Fixture Full",
    category: "packages",
    badge: "Best value",
    price: sized(120, { suv: 150, truck: 165, sports: 180, exotic: 250, motorcycle: 100 }),
    priceNote: { exotic: "plus" },
    duration: sized("4–5 hrs", { suv: "5–6 hrs", truck: "6–7 hrs" }),
  }),
  service({
    slug: "fx-work",
    name: "Fixture Work Truck",
    category: "work",
    price: sized(75),
    duration: sized("~1–1.5 hrs"),
  }),
  service({
    slug: "fx-garage",
    name: "Fixture Garage Service",
    location: "garage" as Service["location"],
    price: sized(500),
    duration: sized("2 days"),
  }),
];

export const fixtureAddOns: AddOn[] = [
  {
    slug: "fx-engine",
    name: "Fixture Engine Bay",
    description: "",
    price: 20,
    duration: "+30 min",
  },
  {
    slug: "pet-hair-removal",
    name: "Fixture Pet Hair",
    description: "",
    price: 25,
    duration: "+30 min",
  },
  {
    slug: "odor-elimination",
    name: "Fixture Odor",
    description: "",
    price: 40,
    duration: "+60 min",
  },
  { slug: "fx-wheels", name: "Fixture Wheels", description: "", price: 50, duration: "+60 min" },
  {
    slug: "fx-headlights",
    name: "Fixture Headlights",
    description: "",
    price: 30,
    duration: "+45 min",
  },
];

/** Replaces the catalog parts of the real module; pass `addOns: []` to mirror a catalog with none. */
export function withFixtureCatalog<T extends object>(
  actual: T,
  options: { addOns?: AddOn[] } = {},
) {
  const addOns = options.addOns ?? fixtureAddOns;
  return {
    ...actual,
    services: fixtureServices,
    addOns,
    getService: (slug: string) => fixtureServices.find((s) => s.slug === slug),
    getAddOn: (slug: string) => addOns.find((a) => a.slug === slug),
  };
}
