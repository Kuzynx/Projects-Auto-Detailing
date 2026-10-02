import type { VehicleSize } from "@/data/services";
import { vehicleSizes } from "@/data/services";
import { cn } from "@/lib/utils";

// Literal class names so Tailwind can see them.
const visibility = {
  inline: {
    car: "hidden group-data-[size=car]/size:inline",
    suv: "hidden group-data-[size=suv]/size:inline",
    truck: "hidden group-data-[size=truck]/size:inline",
    sports: "hidden group-data-[size=sports]/size:inline",
    exotic: "hidden group-data-[size=exotic]/size:inline",
    motorcycle: "hidden group-data-[size=motorcycle]/size:inline",
  },
  flex: {
    car: "hidden group-data-[size=car]/size:flex",
    suv: "hidden group-data-[size=suv]/size:flex",
    truck: "hidden group-data-[size=truck]/size:flex",
    sports: "hidden group-data-[size=sports]/size:flex",
    exotic: "hidden group-data-[size=exotic]/size:flex",
    motorcycle: "hidden group-data-[size=motorcycle]/size:flex",
  },
  block: {
    car: "hidden group-data-[size=car]/size:block",
    suv: "hidden group-data-[size=suv]/size:block",
    truck: "hidden group-data-[size=truck]/size:block",
    sports: "hidden group-data-[size=sports]/size:block",
    exotic: "hidden group-data-[size=exotic]/size:block",
    motorcycle: "hidden group-data-[size=motorcycle]/size:block",
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
