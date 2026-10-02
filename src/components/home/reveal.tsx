"use client";

import { useRef } from "react";
import { MotionConfig, motion, useInView, type Variants } from "motion/react";

/**
 * Tiny motion primitives for the home page.
 *
 * - `Reveal` fades and lifts a block the first time it scrolls into view.
 * - `RevealGroup` + `RevealItem` stagger their children (on view, or on mount for the hero).
 *
 * Reduced motion: every primitive is wrapped in `MotionConfig reducedMotion="user"`, so
 * transforms are skipped for people who ask for less motion and only opacity is eased.
 * The server-rendered markup is identical either way, which avoids hydration mismatches.
 *
 * No JavaScript: every hidden element carries `data-reveal`, and `RevealNoScript` (rendered
 * once per page) forces those elements visible, so content never depends on hydration.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEW_MARGIN = "0px 0px -12% 0px";

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
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: VIEW_MARGIN });
  const Component = motion[as];

  return (
    <MotionConfig reducedMotion="user">
      <Component
        ref={ref as never}
        data-reveal=""
        className={className}
        initial={{ opacity: 0, y }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: EASE, delay }}
      >
        {children}
      </Component>
    </MotionConfig>
  );
}

const groupVariants = (stagger: number, delayChildren: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

const itemVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
});

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  /** "view" waits until the group scrolls into view; "mount" plays immediately (hero). */
  trigger?: "view" | "mount";
  stagger?: number;
  delay?: number;
  as?: Tag;
}

export function RevealGroup({
  children,
  className,
  trigger = "view",
  stagger = 0.09,
  delay = 0,
  as = "div",
}: RevealGroupProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: VIEW_MARGIN });
  const Component = motion[as];
  const play = trigger === "mount" || inView;

  return (
    <MotionConfig reducedMotion="user">
      <Component
        ref={ref as never}
        className={className}
        variants={groupVariants(stagger, delay)}
        initial="hidden"
        animate={play ? "visible" : "hidden"}
      >
        {children}
      </Component>
    </MotionConfig>
  );
}

interface RevealItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: Tag;
}

/** Must be rendered inside a `RevealGroup`; inherits its timing. */
export function RevealItem({ children, className, y = 24, as = "div" }: RevealItemProps) {
  const Component = motion[as];
  return (
    <Component data-reveal="" className={className} variants={itemVariants(y)}>
      {children}
    </Component>
  );
}
