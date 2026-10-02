"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { prefersReducedMotion, revealOnScroll } from "./scroll-reveal";

interface WipeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Direction the wipe travels. */
  from?: "left" | "right";
}

const SHOWN = "inset(0% 0% 0% 0% round 1.25rem)";

/**
 * Wipes its children into view with a clip-path, like a squeegee pass, the first time it
 * scrolls into view. Visible in the server HTML; the clip is applied only after mount and
 * only when the block is still below the fold. Reduced motion: no wipe at all.
 */
export function WipeIn({ children, className, delay = 0, from = "left" }: WipeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const hidden =
      from === "left" ? "inset(0% 100% 0% 0% round 1.25rem)" : "inset(0% 0% 0% 100% round 1.25rem)";
    return revealOnScroll(root, {
      targets: [root],
      hide: (el) => {
        el.style.clipPath = hidden;
      },
      show: (el) =>
        animate(
          el,
          { clipPath: [hidden, SHOWN] },
          { duration: 1.2, ease: [0.65, 0, 0.35, 1], delay },
        ),
      reset: (el) => {
        el.style.clipPath = "";
      },
    });
  }, [delay, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
