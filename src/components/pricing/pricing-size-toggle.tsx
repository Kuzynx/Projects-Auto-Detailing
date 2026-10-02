"use client";

import { SegmentedControl } from "@/components/services/segmented-control";
import { vehicleSizes } from "@/data/services";
import { useSizeParam } from "./size-scope";

const options = vehicleSizes.map((v) => ({
  value: v.id,
  label: v.label,
  hint: v.examples.split(", ").slice(0, 2).join(", "),
}));

/** Global vehicle-size switch for the Pricing page, persisted as `?size=`. */
export function PricingSizeToggle() {
  const [size, setSize] = useSizeParam();
  return (
    <SegmentedControl
      legend="Show prices for"
      hideLegend
      options={options}
      value={size}
      onChange={setSize}
      className="w-full sm:w-auto"
    />
  );
}
