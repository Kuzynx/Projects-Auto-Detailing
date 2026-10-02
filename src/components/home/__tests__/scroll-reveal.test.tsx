import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "../reveal";

/**
 * An IntersectionObserver that never reports, like a print render or a page that is printed
 * (or saved as PDF) before the visitor scrolls: below-the-fold blocks are never "in view".
 */
class SilentObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

describe("home scroll-reveal", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", SilentObserver);
    // Every element measures as far below the fold.
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 5000,
      bottom: 5400,
      left: 0,
      right: 400,
      width: 400,
      height: 400,
      x: 0,
      y: 5000,
      toJSON: () => ({}),
    } as DOMRect);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("is visible in the initial render and hides below-the-fold content only after mount", () => {
    const { getByText } = render(<Reveal>Below the fold</Reveal>);
    // After mount the block is hidden, waiting for the observer.
    expect(getByText("Below the fold").style.opacity).toBe("0");
  });

  /*
   * Regression: printing the home page (or "Save as PDF") before scrolling used to print every
   * section below the fold blank, because the inline `opacity: 0` set after mount was only
   * cleared by the IntersectionObserver. `revealOnScroll` now reveals all targets on `beforeprint`.
   */
  it("reveals hidden blocks when the page is printed", () => {
    const { getByText } = render(<Reveal>Below the fold</Reveal>);
    window.dispatchEvent(new Event("beforeprint"));
    expect(getByText("Below the fold").style.opacity).not.toBe("0");
  });
});
