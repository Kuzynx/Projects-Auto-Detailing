"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { galleryCategories, type GalleryCategory, type GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";
import { GalleryTileContent, availableCategories, gridLayout } from "./gallery-tile";
import { Lightbox } from "./lightbox";

type FilterId = GalleryCategory | "all";

const validIds = new Set<string>(galleryCategories.map((c) => c.id));

function parseCategory(value: string | null): FilterId {
  return value && validIds.has(value) ? (value as FilterId) : "all";
}

export function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories, showFilters } = useMemo(() => availableCategories(items), [items]);
  const requested = parseCategory(searchParams.get("category"));
  const active: FilterId =
    showFilters && categories.some((c) => c.id === requested) ? requested : "all";
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const item of items) map[item.category] = (map[item.category] ?? 0) + 1;
    return map;
  }, [items]);

  const visible = useMemo(
    () => (active === "all" ? items : items.filter((item) => item.category === active)),
    [items, active],
  );

  const setCategory = useCallback(
    (id: FilterId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id === "all") params.delete("category");
      else params.set("category", id);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const grid = useMemo(() => gridLayout(visible), [visible]);

  const activeLabel = galleryCategories.find((c) => c.id === active)?.label ?? "All work";

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {showFilters && (
          <div
            role="group"
            aria-label="Filter projects by category"
            className="-mx-4 -my-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:my-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0"
          >
            {categories.map((category) => {
              const isActive = category.id === active;
              const count = counts[category.id] ?? 0;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  disabled={count === 0}
                  onClick={() => setCategory(category.id)}
                  className={cn(
                    "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 font-display text-sm font-medium transition-colors",
                    isActive
                      ? "border-brand-500 bg-brand-500 text-bg"
                      : "border-border-strong bg-white/[0.03] text-ink-muted hover:border-brand-500/60 hover:text-ink",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                  )}
                >
                  {category.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] tabular-nums",
                      isActive ? "bg-bg/15 text-bg" : "bg-white/5 text-ink-subtle",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <p aria-live="polite" className="shrink-0 text-sm text-ink-muted">
          Showing <span className="font-semibold text-ink tabular-nums">{visible.length}</span>{" "}
          {visible.length === 1 ? "project" : "projects"}
          {active !== "all" && <span className="sr-only"> in {activeLabel}</span>}
        </p>
      </div>

      <LayoutGroup>
        <motion.ul layout={!reduceMotion} className={grid.className}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, index) => (
              <motion.li
                key={item.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, scale: 0.96 }
                }
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn("relative", grid.span(item))}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-haspopup="dialog"
                  aria-label={`${item.title}, ${item.vehicle}, ${item.service}. Open full-size photo`}
                  className="group relative block size-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-strong"
                >
                  <GalleryTileContent item={item} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {openIndex !== null && visible[openIndex] && (
        <Lightbox
          items={visible}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
}
