import { vehicleSizes, type Service } from "@/data/services";

/**
 * Headline "from $X" price: the `car` class when present (so car owners are not quoted the
 * motorcycle rate), otherwise the lowest published price across vehicle classes.
 */
export function startingPrice(service: Service) {
  const prices: Record<string, number> = service.price;
  return prices.car ?? Math.min(...Object.values(prices));
}

/** Estimated duration for the first (most common) vehicle class in `vehicleSizes`. */
export function typicalDuration(service: Service) {
  const first = vehicleSizes[0];
  return first ? service.duration[first.id] : undefined;
}

/** "Cars, SUVs, trucks, sports cars, exotics and motorcycles", built from `vehicleSizes`. */
export function vehicleClassList() {
  const plural = vehicleSizes.map(({ label }) =>
    label === label.toUpperCase() ? `${label}s` : `${label.toLowerCase()}s`,
  );
  if (plural.length === 0) return "";
  const text =
    plural.length === 1 ? plural[0] : `${plural.slice(0, -1).join(", ")} and ${plural.at(-1)}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
