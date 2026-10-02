"use client";

import { serviceCategories, type ServiceCategory } from "@/data/services";
import { cn } from "@/lib/utils";
import { useQueryParam } from "./use-query-param";

type Filter = ServiceCategory | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All services" },
  ...serviceCategories,
];
const filterIds = filters.map((f) => f.id);

interface ServiceFilterProps {
  /** Pre-rendered cards (Server Components) with their category. */
  items: { key: string; category: ServiceCategory; node: React.ReactNode }[];
}

/** Sticky, URL-synced (`?category=`) category filter above the service grid. */
export function ServiceFilter({ items }: ServiceFilterProps) {
  const [active, setActive] = useQueryParam<Filter>("category", filterIds, "all");
  const visible = active === "all" ? items : items.filter((item) => item.category === active);
  const counts = new Map<Filter, number>(
    filters.map((f) => [
      f.id,
      f.id === "all" ? items.length : items.filter((i) => i.category === f.id).length,
    ]),
  );

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-bg/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:border sm:px-2 sm:py-2 lg:top-20">
        <div
          role="group"
          aria-label="Filter services by category"
          className="flex [scrollbar-width:none] gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((filter) => {
            const selected = active === filter.id;
            const count = counts.get(filter.id) ?? 0;
            if (count === 0) return null;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(filter.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-semibold whitespace-nowrap transition-colors duration-200",
                  selected
                    ? "bg-brand-500 text-bg"
                    : "text-ink-muted hover:bg-white/5 hover:text-ink",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] tabular-nums",
                    selected ? "bg-bg/15 text-bg" : "bg-white/5 text-ink-subtle",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Showing ${visible.length} ${visible.length === 1 ? "service" : "services"}`}
      </p>

      <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <li key={item.key} className="animate-fade-up">
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
