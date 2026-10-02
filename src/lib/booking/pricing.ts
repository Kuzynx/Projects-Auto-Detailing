/**
 * Booking estimate. Pure and shared by the live summary (client) and the
 * server action, which always recomputes the estimate itself.
 */
import { getAddOn, getService, type VehicleSize } from "@/data/services";
import { formatPrice } from "@/lib/utils";

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
  /** Open-ended pricing for this vehicle type ("from" $100, $150 "plus"), else null. */
  priceNote: "from" | "plus" | null;
}

/**
 * The total as customers should read it, honouring open-ended prices:
 * "$50", "from $100", "$150+". Null until a service is chosen, so nothing shows "$0".
 */
export function formatEstimateTotal(estimate: Pick<Estimate, "service" | "total" | "priceNote">) {
  if (!estimate.service) return null;
  const amount = formatPrice(estimate.total);
  if (estimate.priceNote === "from") return `from ${amount}`;
  if (estimate.priceNote === "plus") return `${amount}+`;
  return amount;
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
    priceNote: service?.priceNote?.[size] ?? null,
  };
}
