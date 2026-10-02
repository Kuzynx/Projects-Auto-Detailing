"use client";

import { useEffect, useRef } from "react";
import { fadeUp, revealOnScroll } from "./scroll-reveal";

/**
 * Tiny scroll-reveal primitives for the home page.
 *
 * - `Reveal` fades and lifts one block the first time it scrolls into view.
 * - `RevealGroup` + `RevealItem` stagger their items the same way.
 *
 * Content is visible in the server HTML and stays visible if JavaScript or a client chunk
 * fails: the hidden state is only applied after mount, and only to blocks still below the
 * fold (see `scroll-reveal.ts`). Reduced motion: fade only, no movement.
 * `data-reveal` remains for the `RevealNoScript` style, which is harmless now.
 */

type Tag = "div" | "section" | "ul" | "ol" | "li" | "article" | "header";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds before the reveal starts. */
  delay?: number;
  /** Pixels the block travels upward as it appears. */
  y?: number;
  as?: Tag;
}

export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    return revealOnScroll(root, { targets: [root], ...fadeUp(delay, 0) });
  }, [delay]);

  // Narrowed for typing only; every allowed tag is a block element that takes the same props.
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className} data-reveal="" data-reveal-y={y}>
      {children}
    </Tag>
  );
}

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds between items. */
  stagger?: number;
  delay?: number;
  as?: Tag;
}

export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  as = "div",
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    return revealOnScroll(root, { targets, ...fadeUp(delay, stagger) });
  }, [delay, stagger]);

  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: Tag;
}

/** Rendered inside a `RevealGroup`, which animates it. */
export function RevealItem({ children, className, y = 24, as = "div" }: RevealItemProps) {
  const Tag = as;
  return (
    <Tag className={className} data-reveal="" data-reveal-item="" data-reveal-y={y}>
      {children}
    </Tag>
  );
}
