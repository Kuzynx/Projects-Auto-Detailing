import { describe, expect, it, vi } from "vitest";
import { addOns, services, vehicleSizes } from "@/data/services";
import { calculateEstimate } from "../pricing";

vi.mock("@/data/services", async (importOriginal) =>
  (await import("./fixtures/catalog")).withFixtureCatalog(await importOriginal<object>()),
);

describe("calculateEstimate", () => {
  it("uses the base price for every vehicle type", () => {
    for (const service of services) {
      for (const { id } of vehicleSizes) {
        const estimate = calculateEstimate({ serviceSlug: service.slug, size: id });
        expect(estimate.total).toBe(service.price[id]);
        expect(estimate.durationLabel).toBe(service.duration[id]);
      }
    }
  });

  it("prices motorcycles and exotics from their own columns", () => {
    expect(calculateEstimate({ serviceSlug: "fx-full", size: "motorcycle" }).total).toBe(100);
    expect(calculateEstimate({ serviceSlug: "fx-full", size: "exotic" }).total).toBe(250);
  });

  it("adds each add-on price", () => {
    const estimate = calculateEstimate({
      serviceSlug: "fx-full",
      size: "suv",
      addOnSlugs: ["fx-engine", "fx-headlights"],
    });
    expect(estimate.service).toEqual({ slug: "fx-full", name: "Fixture Full", price: 150 });
    expect(estimate.addOnsTotal).toBe(20 + 30);
    expect(estimate.total).toBe(150 + 20 + 30);
    expect(estimate.addOns.map((a) => a.slug)).toEqual(["fx-engine", "fx-headlights"]);
  });

  it("counts duplicate add-ons once and ignores unknown slugs", () => {
    const estimate = calculateEstimate({
      serviceSlug: "fx-wash",
      size: "car",
      addOnSlugs: ["fx-engine", "fx-engine", "laser-wax"],
    });
    expect(estimate.total).toBe(50 + 20);
  });

  it("returns add-ons only when no service is chosen", () => {
    const estimate = calculateEstimate({ serviceSlug: "", size: "car", addOnSlugs: ["fx-engine"] });
    expect(estimate.service).toBeNull();
    expect(estimate.durationLabel).toBeNull();
    expect(estimate.total).toBe(20);
  });

  it("matches the catalog when every add-on is selected", () => {
    const all = addOns.map((a) => a.slug);
    const estimate = calculateEstimate({
      serviceSlug: "fx-garage",
      size: "truck",
      addOnSlugs: all,
    });
    expect(estimate.total).toBe(500 + addOns.reduce((sum, a) => sum + a.price, 0));
  });
});
