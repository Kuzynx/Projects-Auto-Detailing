"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SWIPE_THRESHOLD = 50;

export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();

  const count = items.length;
  const item = items[index];

  const go = useCallback(
    (step: 1 | -1) => {
      if (count < 2) return;
      setDirection(step);
      onIndexChange((index + step + count) % count);
    },
    [count, index, onIndexChange],
  );

  // Focus and background management, in one effect so the order is guaranteed:
  // remember the trigger, make the rest of the page (header, main, footer, mobile CTA bar,
  // skip link) inert, then focus the close button. On close, lift inert before restoring focus.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const background = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el !== dialog &&
        !el.inert &&
        !["SCRIPT", "STYLE", "LINK", "NEXT-ROUTE-ANNOUNCER"].includes(el.tagName),
    );
    background.forEach((el) => (el.inert = true));
    closeRef.current?.focus();
    return () => {
      background.forEach((el) => (el.inert = false));
      previouslyFocused?.focus?.();
    };
  }, []);

  // Body scroll lock with scrollbar compensation so the page does not jump.
  useEffect(() => {
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  // Keyboard: Escape closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (node) => node.getClientRects().length > 0,
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const activeEl = document.activeElement;
        if (event.shiftKey && (activeEl === first || !dialogRef.current.contains(activeEl))) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (activeEl === last || !dialogRef.current.contains(activeEl))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, onClose]);

  function onPointerDown(event: React.PointerEvent) {
    if (event.pointerType === "mouse") return;
    swipeStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }

  function onPointerUp(event: React.PointerEvent) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
  }

  if (!item) return null;

  const titleId = `lightbox-title-${item.id}`;
  const slide = reduceMotion ? 0 : 48;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[90] flex animate-[fade-up_0.3s_ease-out_both] flex-col bg-black/95 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
        <p className="font-display text-sm text-ink-muted tabular-nums" aria-live="polite">
          <span className="text-ink">{index + 1}</span> / {count}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink transition-colors hover:border-brand-500 hover:text-brand-300"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 py-4 select-none sm:px-20"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.figure
            key={item.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -slide }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-full flex-col items-center"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1536px) 1400px, 100vw"
              loading="eager"
              draggable={false}
              className="h-auto max-h-[calc(100dvh-13rem)] w-auto max-w-full rounded-md object-contain shadow-2xl"
            />
            <figcaption className="mt-4 max-w-2xl px-2 text-center">
              <p id={titleId} className="font-display text-lg font-semibold text-ink">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {item.vehicle}{" "}
                <span aria-hidden className="text-ink-subtle">
                  /
                </span>
                <span className="sr-only">,</span>{" "}
                <span className="text-brand-300">{item.service}</span>
              </p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        {count > 1 && (
          <>
            <NavButton side="left" label="Previous photo" onClick={() => go(-1)} />
            <NavButton side="right" label="Next photo" onClick={() => go(1)} />
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 px-4 pb-5 sm:pb-6">
        {count > 1 && <MobileNavButton side="left" label="Previous photo" onClick={() => go(-1)} />}
        <p className="text-center text-xs text-ink-subtle">
          <span className="hidden sm:inline">Use arrow keys to browse. Esc to close.</span>
          <span className="sm:hidden">Swipe or tap the arrows</span>
        </p>
        {count > 1 && <MobileNavButton side="right" label="Next photo" onClick={() => go(1)} />}
      </div>
    </div>,
    document.body,
  );
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-ink backdrop-blur-sm transition-colors hover:border-brand-500 hover:text-brand-300 sm:inline-flex",
        side === "left" ? "left-4 lg:left-6" : "right-4 lg:right-6",
      )}
    >
      <Icon className="size-6" aria-hidden />
    </button>
  );
}

function MobileNavButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink sm:hidden"
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
