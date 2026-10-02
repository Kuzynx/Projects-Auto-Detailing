"use client";

import { SegmentedControl } from "@/components/services/segmented-control";
import { vehicleSizes } from "@/data/services";
import { useSizeParam } from "./size-scope";

const options = vehicleSizes.map((v) => ({ value: v.id, label: v.label }));

/** Global vehicle-size switch for the Pricing page, persisted as `?size=`. Wraps to two rows on mobile. */
export function PricingSizeToggle() {
  const [size, setSize] = useSizeParam();
  return (
    <SegmentedControl
      legend="Show prices for"
      hideLegend
      options={options}
      value={size}
      onChange={setSize}
      className="w-full md:w-auto"
      gridClassName="grid-flow-row grid-cols-3 rounded-[1.25rem] md:auto-cols-auto md:grid-flow-col md:grid-cols-none md:rounded-full [&_label>span]:md:px-4"
    />
  );
}
