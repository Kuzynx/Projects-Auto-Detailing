"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface WipeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Direction the wipe travels. */
  from?: "left" | "right";
}

/**
 * Wipes its children into view with a clip-path, like a squeegee pass, the first time
 * it scrolls into view. Reduced motion: the clip resolves instantly.
 */
export function WipeIn({ children, className, delay = 0, from = "left" }: WipeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const hidden =
    from === "left" ? "inset(0% 100% 0% 0% round 1.25rem)" : "inset(0% 0% 0% 100% round 1.25rem)";

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: hidden }}
      animate={inView ? { clipPath: "inset(0% 0% 0% 0% round 1.25rem)" } : undefined}
      transition={reduce ? { duration: 0 } : { duration: 1.2, ease: [0.65, 0, 0.35, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
