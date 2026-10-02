"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { Badge } from "@/components/ui";
import type { CompareShowcase } from "@/data/gallery";
import { cn } from "@/lib/utils";

const SIZES = "(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw";

/** Weathered treatment used when no real "before" photo is on file. */
const WEATHERED_FILTER = "saturate(.4) contrast(.85) brightness(.7)";
const GRIME =
  "radial-gradient(120% 80% at 20% 15%, rgba(110,90,60,.55), transparent 60%)," +
  "radial-gradient(90% 70% at 80% 85%, rgba(70,60,45,.6), transparent 65%)," +
  "linear-gradient(180deg, rgba(90,80,60,.25), rgba(40,35,25,.45))";
const SWIRLS =
  "repeating-radial-gradient(circle at 35% 30%, rgba(255,255,255,.07) 0 1px, transparent 1px 7px)";

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function CompareSlider({ item }: { item: CompareShowcase }) {
  const [position, setPosition] = useState(item.start ?? 50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const inputId = useId();
  const simulated = !item.before;
  const beforeImage = item.before ?? item.after;
  const labels = item.labels ?? { before: "Before", after: "After" };

  function updateFromPointer(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(clamp(Math.round(((clientX - rect.left) / rect.width) * 100)));
  }

  const rounded = Math.round(position);

  return (
    <figure className="flex flex-col">
      <div
        ref={frameRef}
        className="group relative aspect-[4/5] cursor-ew-resize touch-pan-y overflow-hidden rounded-lg border border-border bg-surface shadow-card select-none"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          // Touch users may be starting a vertical scroll, so only jump on mouse clicks.
          if (event.pointerType === "mouse") updateFromPointer(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging.current) updateFromPointer(event.clientX);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <Image
          src={item.after.src}
          alt={item.after.alt}
          fill
          sizes={SIZES}
          draggable={false}
          className="object-cover"
        />

        <div
          aria-hidden={simulated}
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={beforeImage.src}
            alt={simulated ? "" : beforeImage.alt}
            fill
            sizes={SIZES}
            draggable={false}
            className="object-cover"
            style={simulated ? { filter: WEATHERED_FILTER } : undefined}
          />
          {simulated && (
            <>
              <div
                className="absolute inset-0 mix-blend-multiply"
                style={{ backgroundImage: GRIME }}
              />
              <div
                className="absolute inset-0 opacity-70 mix-blend-screen"
                style={{ backgroundImage: SWIRLS }}
              />
            </>
          )}
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute top-3 left-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-display text-[11px] font-semibold tracking-wider text-ink uppercase backdrop-blur-sm transition-opacity"
          style={{ opacity: position < 12 ? 0 : 1 }}
        >
          {labels.before}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute top-3 right-3 rounded-full border border-brand-500/50 bg-black/60 px-3 py-1 font-display text-[11px] font-semibold tracking-wider text-brand-300 uppercase backdrop-blur-sm transition-opacity"
          style={{ opacity: position > 88 ? 0 : 1 }}
        >
          {labels.after}
        </span>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-ink/90 shadow-[0_0_12px_rgba(0,0,0,.6)]"
          style={{ left: `${position}%` }}
        >
          <span
            className={cn(
              "absolute top-1/2 left-1/2 inline-flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-ink shadow-glow backdrop-blur-sm transition-transform",
              "group-hover:scale-105 group-has-[input:focus-visible]:outline-2 group-has-[input:focus-visible]:outline-offset-2 group-has-[input:focus-visible]:outline-brand-400",
            )}
          >
            <MoveHorizontal className="size-5" />
          </span>
        </div>

        <label htmlFor={inputId} className="sr-only">
          {`${labels.before} and ${labels.after.toLowerCase()} comparison: ${item.title}. Use left and right arrows to move the divider.`}
        </label>
        <input
          id={inputId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={rounded}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={`${rounded}% ${labels.before.toLowerCase()}, ${100 - rounded}% ${labels.after.toLowerCase()}`}
          className="sr-only"
        />
      </div>

      <figcaption className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-lg font-semibold text-ink">{item.title}</p>
          {item.client ? <Badge>Our work</Badge> : <Badge tone="neutral">Illustrative</Badge>}
        </div>
        <p className="mt-1 text-sm text-ink-subtle">{item.vehicle}</p>
        <p className="mt-2 text-sm text-pretty text-ink-muted">{item.result}</p>
      </figcaption>
    </figure>
  );
}
