import Image from "next/image";
import { Expand } from "lucide-react";
import { Badge } from "@/components/ui";
import type { GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";

/** Client job photos lead the grid; everything else keeps its data order. */
export function orderGalleryItems(items: GalleryItem[]) {
  const client = items.filter((item) => item.source === "client");
  const rest = items.filter((item) => item.source !== "client");
  return [...client, ...rest];
}

/** Portrait frames take two grid rows; wide originals span two columns. */
export function tileLayout(item: GalleryItem) {
  const ratio = item.height / item.width;
  const tall = ratio > 1.15;
  const wide = !tall && item.width >= 2000 && ratio < 0.72;
  return { tall, wide };
}

export function tileSizes(wide: boolean) {
  return wide
    ? "(min-width: 1280px) 830px, (min-width: 640px) 100vw, 100vw"
    : "(min-width: 1280px) 410px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
}

export const gridClasses =
  "relative grid grid-flow-row-dense grid-cols-1 auto-rows-[15rem] gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:auto-rows-[14rem] xl:auto-rows-[16rem]";

export function tileSpanClasses(item: GalleryItem) {
  const { tall, wide } = tileLayout(item);
  return cn(tall && "row-span-2", wide && "sm:col-span-2");
}

/** Visual content of a gallery tile, shared by the interactive grid and its static fallback. */
export function GalleryTileContent({ item }: { item: GalleryItem }) {
  const { wide } = tileLayout(item);
  return (
    <>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={tileSizes(wide)}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
      />
      {item.source === "client" && (
        <Badge className="absolute top-3 left-3 z-10 border-brand-400/50 bg-black/60 backdrop-blur-sm">
          Our work
        </Badge>
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left transition-all duration-300 sm:p-5 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
        <div className="min-w-0">
          <p className="font-display text-[11px] font-semibold tracking-[0.18em] text-brand-300 uppercase">
            {item.service}
          </p>
          <p className="mt-1 truncate font-display text-lg font-semibold text-ink">{item.title}</p>
          <p className="truncate text-sm text-ink-muted">{item.vehicle}</p>
        </div>
        <span
          aria-hidden
          className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-ink backdrop-blur-sm lg:inline-flex"
        >
          <Expand className="size-4" />
        </span>
      </div>
    </>
  );
}
