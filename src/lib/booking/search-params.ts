/**
 * Pre-selection from links elsewhere on the site:
 *   /book?service=<slug>&size=<sedan|suv|truck>&addons=<slug,slug>
 * Unknown values are ignored rather than erroring.
 */
import { getAddOn, getService, type VehicleSize } from "@/data/services";
import { emptyDraft, vehicleSizeIds, type BookingDraft } from "./schema";

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
  if (size && (vehicleSizeIds as readonly string[]).includes(size))
    draft.size = size as VehicleSize;

  const rawAddOns = ([] as string[]).concat(params.addons ?? []).flatMap((v) => v.split(","));
  draft.addOns = [...new Set(rawAddOns.map((v) => v.trim().toLowerCase()))].filter((slug) =>
    Boolean(getAddOn(slug)),
  );

  return { draft, hasService: Boolean(service) };
}
