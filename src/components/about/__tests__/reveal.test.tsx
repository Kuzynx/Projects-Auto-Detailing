import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Reveal } from "../reveal";

/*
 * Regression: the About page's `Reveal` uses motion's `initial={{ opacity: 0, y: 20 }}`, which
 * motion serialises into the server HTML. Everything wrapped in it (story, facts, founder, team,
 * values, standards) is invisible until hydration finishes and an IntersectionObserver fires, and
 * stays invisible with JS disabled, if the client chunk fails, and in print. The home page's
 * scroll-reveal system avoids this by hiding only after mount.
 *
 * Fixed: Reveal now hides content only after mount, and only when it is below the fold.
 */
describe("about/Reveal server HTML", () => {
  it("renders its content visible before hydration", () => {
    const html = renderToString(<Reveal>Story copy</Reveal>);
    expect(html).toContain("Story copy");
    expect(html).not.toMatch(/opacity:\s*0/);
  });
});
