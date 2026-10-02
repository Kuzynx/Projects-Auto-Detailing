"use client";

import { vehicleSizes, type VehicleSize } from "@/data/services";
import { useQueryParam } from "@/components/services/use-query-param";

export const sizeIds = vehicleSizes.map((v) => v.id);

/** Read/write the `?size=` query param shared by everything on the Pricing page. */
export function useSizeParam() {
  return useQueryParam<VehicleSize>("size", sizeIds, "sedan");
}

/**
 * Exposes the selected vehicle size as `data-size` on a `group/size` wrapper so
 * server-rendered children can switch prices with CSS only (see `SizeValue`).
 */
export function SizeScope({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [size] = useSizeParam();
  return (
    <div data-size={size} className={["group/size", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
