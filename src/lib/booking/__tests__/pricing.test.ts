import { describe, expect, it } from "vitest";
import { addOns, services } from "@/data/services";
import { calculateEstimate } from "../pricing";

describe("calculateEstimate", () => {
  it("uses the base price for the vehicle size", () => {
    for (const service of services) {
      for (const size of ["sedan", "suv", "truck"] as const) {
        const estimate = calculateEstimate({ serviceSlug: service.slug, size });
        expect(estimate.total).toBe(service.price[size]);
        expect(estimate.durationLabel).toBe(service.duration[size]);
      }
    }
  });

  it("adds each add-on price", () => {
    const estimate = calculateEstimate({
      serviceSlug: "full-detail",
      size: "suv",
      addOnSlugs: ["engine-bay", "headlight-restoration"],
    });
    expect(estimate.service).toEqual({ slug: "full-detail", name: "The Full Detail", price: 399 });
    expect(estimate.addOnsTotal).toBe(59 + 89);
    expect(estimate.total).toBe(399 + 59 + 89);
    expect(estimate.addOns.map((a) => a.slug)).toEqual(["engine-bay", "headlight-restoration"]);
  });

  it("counts duplicate add-ons once and ignores unknown slugs", () => {
    const estimate = calculateEstimate({
      serviceSlug: "signature-wash",
      size: "sedan",
      addOnSlugs: ["engine-bay", "engine-bay", "laser-wax"],
    });
    expect(estimate.total).toBe(89 + 59);
  });

  it("returns add-ons only when no service is chosen", () => {
    const estimate = calculateEstimate({
      serviceSlug: "",
      size: "sedan",
      addOnSlugs: ["engine-bay"],
    });
    expect(estimate.service).toBeNull();
    expect(estimate.durationLabel).toBeNull();
    expect(estimate.total).toBe(59);
  });

  it("matches the catalog when every add-on is selected", () => {
    const all = addOns.map((a) => a.slug);
    const estimate = calculateEstimate({
      serviceSlug: "ceramic-coating",
      size: "truck",
      addOnSlugs: all,
    });
    expect(estimate.total).toBe(1649 + addOns.reduce((sum, a) => sum + a.price, 0));
  });
});
