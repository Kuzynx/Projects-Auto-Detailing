import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Testimonial } from "@/data/testimonials";
import { Testimonials } from "../testimonials";
import { TestimonialCarousel } from "../testimonial-carousel";

// Regression: the reviews section must keep working while `testimonials` is empty (a new
// business) and the carousel code path must still behave once real reviews are added.

// jsdom has no matchMedia; the carousel reads prefers-reduced-motion through it.
vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
}));
vi.stubGlobal(
  "IntersectionObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  },
);

const sample: Testimonial[] = [1, 2, 3].map((n) => ({
  id: `t${n}`,
  name: `Customer ${n}`,
  location: "Hesperia",
  vehicle: "Ford F-150",
  service: "Basic Package",
  rating: 5,
  quote: `Quote number ${n}`,
  date: "2026-01-01",
  source: "Google",
}));

describe("Testimonials (empty data)", () => {
  it("renders the first-reviews invitation with an external link", () => {
    render(<Testimonials />);
    const link = screen.getByRole("link", { name: /instagram|google review/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("TestimonialCarousel", () => {
  it("renders nothing for an empty list", () => {
    const { container } = render(<TestimonialCarousel testimonials={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is keyboard operable and hides inactive slides from AT", () => {
    render(<TestimonialCarousel testimonials={sample} />);
    const region = screen.getByRole("region", { name: "Customer reviews" });
    const slides = within(region).getAllByRole("group", { hidden: true });
    const slideGroups = slides.filter((el) => el.getAttribute("aria-roledescription") === "slide");
    expect(slideGroups).toHaveLength(3);
    expect(slideGroups[0]).not.toHaveAttribute("inert");
    expect(slideGroups[1]).toHaveAttribute("inert");

    const next = screen.getByRole("button", { name: "Next review" });
    next.focus();
    fireEvent.keyDown(next, { key: "ArrowRight" });
    expect(slideGroups[1]).not.toHaveAttribute("inert");
    expect(slideGroups[0]).toHaveAttribute("inert");

    fireEvent.keyDown(next, { key: "ArrowLeft" });
    fireEvent.keyDown(next, { key: "ArrowLeft" });
    // Wraps from the first slide to the last.
    expect(slideGroups[2]).not.toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: /Show review 3 of 3/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
