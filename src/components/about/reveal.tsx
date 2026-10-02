"use client";

import { useEffect, useRef } from "react";
import { animate, inView, type AnimationPlaybackControls } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
  as?: "div" | "li";
}

const EASE = [0.22, 1, 0.36, 1] as const;

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Fades content up once as it scrolls into view.
 *
 * Content is always visible in the server HTML, so it stays readable with JS disabled,
 * if the client chunk fails, and in print. Only after mount, and only when the block is
 * still below the fold, is it hidden and then animated in. Reduced motion: fade only.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top <= window.innerHeight) return;

    const reduce = prefersReducedMotion();
    const reset = () => {
      el.style.opacity = "";
      el.style.transform = "";
    };
    el.style.opacity = "0";
    if (!reduce) el.style.transform = "translateY(20px)";

    let controls: AnimationPlaybackControls | undefined;
    const stop = inView(
      el,
      () => {
        controls = animate(
          el,
          { opacity: 1, transform: "translateY(0px)" },
          { duration: reduce ? 0.4 : 0.6, delay, ease: EASE },
        );
        controls.finished.then(reset, reset);
        stop();
      },
      { margin: "0px 0px -10% 0px" },
    );

    return () => {
      stop();
      controls?.stop();
      reset();
    };
  }, [delay]);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>} className={className}>
      {children}
    </Tag>
  );
}
