import { galleryCategories, type GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";
import { GalleryTileContent, gridClasses, tileSpanClasses } from "./gallery-tile";

/**
 * Server-rendered grid shown in the initial HTML (and to crawlers) until the
 * interactive, URL-synced browser hydrates. Mirrors its layout to avoid shift.
 */
export function GalleryStatic({ items }: { items: GalleryItem[] }) {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          aria-hidden
          className="-mx-4 flex gap-2 overflow-hidden px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
        >
          {galleryCategories.map((category, i) => (
            <span
              key={category.id}
              className={cn(
                "inline-flex h-10 shrink-0 items-center rounded-full border px-4 font-display text-sm font-medium",
                i === 0
                  ? "border-brand-500 bg-brand-500 text-bg"
                  : "border-border-strong bg-white/[0.03] text-ink-muted",
              )}
            >
              {category.label}
            </span>
          ))}
        </div>
        <p className="shrink-0 text-sm text-ink-muted">
          Showing <span className="font-semibold text-ink tabular-nums">{items.length}</span>{" "}
          projects
        </p>
      </div>
      <ul className={gridClasses}>
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "group relative overflow-hidden rounded-lg border border-border bg-surface",
              tileSpanClasses(item),
            )}
          >
            <GalleryTileContent item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
