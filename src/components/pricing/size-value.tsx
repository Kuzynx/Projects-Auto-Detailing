import type { VehicleSize } from "@/data/services";
import { vehicleSizes } from "@/data/services";
import { cn } from "@/lib/utils";

// Literal class names so Tailwind can see them.
const visibility = {
  inline: {
    sedan: "hidden group-data-[size=sedan]/size:inline",
    suv: "hidden group-data-[size=suv]/size:inline",
    truck: "hidden group-data-[size=truck]/size:inline",
  },
  flex: {
    sedan: "hidden group-data-[size=sedan]/size:flex",
    suv: "hidden group-data-[size=suv]/size:flex",
    truck: "hidden group-data-[size=truck]/size:flex",
  },
  block: {
    sedan: "hidden group-data-[size=sedan]/size:block",
    suv: "hidden group-data-[size=suv]/size:block",
    truck: "hidden group-data-[size=truck]/size:block",
  },
} satisfies Record<string, Record<VehicleSize, string>>;

interface SizeValueProps {
  /** Render one variant per vehicle size; only the active one is displayed. */
  render: (size: VehicleSize) => React.ReactNode;
  display?: keyof typeof visibility;
  className?: string;
}

/**
 * Server-rendered, size-dependent content. Must sit inside `<SizeScope>`.
 * Hidden variants use `display: none`, so assistive tech only meets the active one.
 */
export function SizeValue({ render, display = "inline", className }: SizeValueProps) {
  return (
    <>
      {vehicleSizes.map(({ id }) => (
        <span key={id} className={cn(visibility[display][id], className)}>
          {render(id)}
        </span>
      ))}
    </>
  );
}
