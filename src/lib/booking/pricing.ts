/**
 * Booking estimate. Pure and shared by the live summary (client) and the
 * server action, which always recomputes the estimate itself.
 */
import { getAddOn, getService, type VehicleSize } from "@/data/services";

export interface EstimateInput {
  serviceSlug: string;
  size: VehicleSize;
  addOnSlugs?: readonly string[];
}

export interface EstimateLine {
  slug: string;
  name: string;
  price: number;
}

export interface Estimate {
  /** Null until a valid service is chosen. */
  service: EstimateLine | null;
  addOns: EstimateLine[];
  addOnsTotal: number;
  /** Starting total in whole USD. Final quote is confirmed on site. */
  total: number;
  /** Duration label for the chosen size, e.g. "4–5 hrs". */
  durationLabel: string | null;
}

/**
 * Base price for the chosen vehicle size plus each add-on, counted once.
 * Unknown slugs are ignored here; the schema rejects them before payment-
 * relevant code runs.
 */
export function calculateEstimate({ serviceSlug, size, addOnSlugs = [] }: EstimateInput): Estimate {
  const service = getService(serviceSlug);
  const serviceLine = service
    ? { slug: service.slug, name: service.name, price: service.price[size] }
    : null;

  const addOnLines: EstimateLine[] = [];
  for (const slug of new Set(addOnSlugs)) {
    const addOn = getAddOn(slug);
    if (addOn) addOnLines.push({ slug: addOn.slug, name: addOn.name, price: addOn.price });
  }

  const addOnsTotal = addOnLines.reduce((sum, line) => sum + line.price, 0);
  return {
    service: serviceLine,
    addOns: addOnLines,
    addOnsTotal,
    total: (serviceLine?.price ?? 0) + addOnsTotal,
    durationLabel: service ? service.duration[size] : null,
  };
}
