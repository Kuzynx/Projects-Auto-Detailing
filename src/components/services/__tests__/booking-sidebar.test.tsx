import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { formatServicePrice, getService, type VehicleSize } from "@/data/services";
import { BookingSidebar } from "../booking-sidebar";

function renderSidebar(slug: string, size: VehicleSize) {
  window.history.replaceState(null, "", `/services/${slug}?size=${size}`);
  const service = getService(slug)!;
  render(<BookingSidebar service={service} recommended={[]} more={[]} />);
  // The live price box is the only aria-live region in the sidebar.
  return document.querySelector('[aria-live="polite"]')!.textContent ?? "";
}

afterEach(() => window.history.replaceState(null, "", "/"));

describe("BookingSidebar price display", () => {
  // Regression: priceSuffix "starting" was folded into `openEnded`, so Working Truck rendered
  // "Starting at$75+" and dropped its "starting" suffix, unlike every other surface ("$75 starting").
  it("shows Working Truck as '$75 starting', not '$75+'", () => {
    const text = renderSidebar("working-truck", "truck");
    expect(text).not.toContain("$75+");
    expect(text).toContain("starting");
  });

  // Regression: exotic "from" prices were re-rendered as "$100+" instead of using
  // formatServicePrice, so the sidebar disagreed with the cards, pricing page and matrix.
  it("uses formatServicePrice for open-ended exotic prices", () => {
    const text = renderSidebar("basic-wash", "exotic");
    expect(text).toContain(formatServicePrice(getService("basic-wash")!, "exotic")); // "from $100"
  });
});
