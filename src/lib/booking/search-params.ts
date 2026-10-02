/**
 * Pre-selection from links elsewhere on the site:
 *   /book?service=<slug>&size=<vehicle type id>&addons=<slug,slug>
 * Vehicle type ids come from `vehicleSizes` (car, suv, truck, sports, exotic, motorcycle).
 * Unknown values are ignored rather than erroring.
 */
import { getAddOn, getService, isVehicleSize } from "@/data/services";
import { emptyDraft, type BookingDraft } from "./schema";

type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export interface BookingPreselection {
  draft: BookingDraft;
  /** True when `?service=` named a real service, so the flow can open on step 2. */
  hasService: boolean;
}

export function parseBookingSearchParams(
  params: Record<string, SearchParamValue>,
): BookingPreselection {
  const draft: BookingDraft = { ...emptyDraft, addOns: [] };

  const service = getService(first(params.service)?.trim().toLowerCase() ?? "");
  if (service) draft.service = service.slug;

  const size = first(params.size)?.trim().toLowerCase();
  if (isVehicleSize(size)) draft.size = size;

  const rawAddOns = ([] as string[]).concat(params.addons ?? []).flatMap((v) => v.split(","));
  draft.addOns = [...new Set(rawAddOns.map((v) => v.trim().toLowerCase()))].filter((slug) =>
    Boolean(getAddOn(slug)),
  );

  return { draft, hasService: Boolean(service) };
}
