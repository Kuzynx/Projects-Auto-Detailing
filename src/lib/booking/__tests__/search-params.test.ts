import { describe, expect, it, vi } from "vitest";
import { parseBookingSearchParams } from "../search-params";

vi.mock("@/data/services", async (importOriginal) =>
  (await import("./fixtures/catalog")).withFixtureCatalog(await importOriginal<object>()),
);

describe("parseBookingSearchParams", () => {
  it("pre-selects service, vehicle type and add-ons", () => {
    const { draft, hasService } = parseBookingSearchParams({
      service: "fx-full",
      size: "truck",
      addons: "fx-engine,fx-headlights",
    });
    expect(hasService).toBe(true);
    expect(draft.service).toBe("fx-full");
    expect(draft.size).toBe("truck");
    expect(draft.addOns).toEqual(["fx-engine", "fx-headlights"]);
  });

  it("accepts every vehicle type id, including motorcycle and exotic", () => {
    expect(parseBookingSearchParams({ size: "motorcycle" }).draft.size).toBe("motorcycle");
    expect(parseBookingSearchParams({ size: "exotic" }).draft.size).toBe("exotic");
  });

  it("ignores unknown values, defaults to car and de-duplicates add-ons", () => {
    const { draft, hasService } = parseBookingSearchParams({
      service: "spaceship",
      size: "sedan",
      addons: ["fx-engine", "fx-engine,nope"],
    });
    expect(hasService).toBe(false);
    expect(draft.service).toBe("");
    expect(draft.size).toBe("car");
    expect(draft.addOns).toEqual(["fx-engine"]);
  });

  it("pre-selects garage services without confirming the garage", () => {
    const { draft, hasService } = parseBookingSearchParams({ service: "fx-garage" });
    expect(hasService).toBe(true);
    expect(draft.garageConfirmed).toBe(false);
  });

  it("is case and whitespace tolerant", () => {
    const { draft } = parseBookingSearchParams({
      service: " FX-Wash ",
      size: "SUV",
      addons: " FX-Engine , ",
    });
    expect(draft.service).toBe("fx-wash");
    expect(draft.size).toBe("suv");
    expect(draft.addOns).toEqual(["fx-engine"]);
  });

  it("returns a fresh draft each time", () => {
    const a = parseBookingSearchParams({ addons: "fx-engine" }).draft;
    const b = parseBookingSearchParams({}).draft;
    expect(b.addOns).toEqual([]);
    expect(a.addOns).not.toBe(b.addOns);
  });
});
