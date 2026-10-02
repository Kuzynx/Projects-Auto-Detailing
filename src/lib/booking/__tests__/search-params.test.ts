import { describe, expect, it } from "vitest";
import { parseBookingSearchParams } from "../search-params";

describe("parseBookingSearchParams", () => {
  it("pre-selects service, size and add-ons", () => {
    const { draft, hasService } = parseBookingSearchParams({
      service: "full-detail",
      size: "truck",
      addons: "engine-bay,headlight-restoration",
    });
    expect(hasService).toBe(true);
    expect(draft.service).toBe("full-detail");
    expect(draft.size).toBe("truck");
    expect(draft.addOns).toEqual(["engine-bay", "headlight-restoration"]);
  });

  it("ignores unknown values and de-duplicates add-ons", () => {
    const { draft, hasService } = parseBookingSearchParams({
      service: "spaceship",
      size: "bus",
      addons: ["engine-bay", "engine-bay,nope"],
    });
    expect(hasService).toBe(false);
    expect(draft.service).toBe("");
    expect(draft.size).toBe("sedan");
    expect(draft.addOns).toEqual(["engine-bay"]);
  });

  it("pre-selects services that need a garage like any other", () => {
    const { draft, hasService } = parseBookingSearchParams({ service: "ceramic-coating" });
    expect(hasService).toBe(true);
    expect(draft.service).toBe("ceramic-coating");
    expect(draft.garageConfirmed).toBe(false);
  });

  it("is case and whitespace tolerant", () => {
    const { draft } = parseBookingSearchParams({
      service: " Paint-Correction ",
      size: "SUV",
      addons: " Engine-Bay , ",
    });
    expect(draft.service).toBe("paint-correction");
    expect(draft.size).toBe("suv");
    expect(draft.addOns).toEqual(["engine-bay"]);
  });

  it("returns a fresh draft each time", () => {
    const a = parseBookingSearchParams({ addons: "engine-bay" }).draft;
    const b = parseBookingSearchParams({}).draft;
    expect(b.addOns).toEqual([]);
    expect(a.addOns).not.toBe(b.addOns);
  });
});
