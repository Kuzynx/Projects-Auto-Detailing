import { animate, inView, type AnimationPlaybackControls } from "motion/react";

/**
 * Imperative scroll-reveal shared by the home page's client components.
 *
 * Content is always VISIBLE in the server HTML. Only after the component has mounted
 * (so hydration and the motion chunk definitely worked) do we hide elements that are
 * still below the fold, then animate them in the first time they scroll into view.
 * Anything already on screen or scrolled past is left alone. If a client chunk ever
 * fails to load, nothing is hidden and the page simply renders without motion. Anything
 * still hidden is revealed on `beforeprint`, so printed pages are never blank.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const VIEW_MARGIN = "0px 0px -12% 0px";

export function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** True when the element starts below the viewport, i.e. the visitor has not seen it yet. */
export function isBelowFold(el: Element) {
  return el.getBoundingClientRect().top > window.innerHeight;
}

interface RevealSpec {
  /** Elements to hide and animate. */
  targets: HTMLElement[];
  /** Hidden state, applied as inline styles after mount. */
  hide: (el: HTMLElement) => void;
  /** Animate one target back to its natural state. */
  show: (el: HTMLElement, index: number) => AnimationPlaybackControls;
  /** Restore natural inline styles (on cleanup or once the animation ends). */
  reset: (el: HTMLElement) => void;
}

/**
 * Hides `targets` and reveals them when `root` scrolls into view, once.
 * Returns a cleanup that stops everything and restores the natural styles.
 */
export function revealOnScroll(root: HTMLElement, spec: RevealSpec) {
  const { targets, hide, show, reset } = spec;
  if (targets.length === 0 || !isBelowFold(root)) return () => {};

  targets.forEach(hide);
  let controls: AnimationPlaybackControls[] = [];
  let stop: VoidFunction = () => {};
  stop = inView(
    root,
    () => {
      controls = targets.map((el, i) => {
        const c = show(el, i);
        c.finished.then(() => reset(el)).catch(() => reset(el));
        return c;
      });
      stop();
    },
    { margin: VIEW_MARGIN },
  );

  // Printing (or "Save as PDF") before scrolling would otherwise print hidden blocks blank.
  const revealAll = () => {
    stop();
    controls.forEach((c) => c.stop());
    targets.forEach(reset);
  };
  window.addEventListener("beforeprint", revealAll);

  return () => {
    window.removeEventListener("beforeprint", revealAll);
    revealAll();
  };
}

/** Fade and lift. Reduced motion: fade only. */
export function fadeUp(delay: number, stagger: number) {
  const reduce = prefersReducedMotion();
  return {
    hide: (el: HTMLElement) => {
      const y = reduce ? 0 : Number(el.dataset.revealY ?? 24);
      el.style.opacity = "0";
      if (y) el.style.transform = `translateY(${y}px)`;
    },
    show: (el: HTMLElement, i: number) =>
      animate(
        el,
        { opacity: 1, transform: "translateY(0px)" },
        { duration: reduce ? 0.4 : 0.8, ease: EASE, delay: delay + i * stagger },
      ),
    reset: (el: HTMLElement) => {
      el.style.opacity = "";
      el.style.transform = "";
    },
  };
}
