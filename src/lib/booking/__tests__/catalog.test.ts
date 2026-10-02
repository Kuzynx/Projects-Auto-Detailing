/**
 * Checks the live catalog (no fixture) against docs/SERVICES-SPEC.md and the
 * booking flow's assumptions. Exact prices live in the data file's own tests.
 */
import { describe, expect, it } from "vitest";
import { addOns, getService, services, vehicleSizes } from "@/data/services";
import { calculateEstimate } from "../pricing";
import { getEstimateNote, DEFAULT_ESTIMATE_NOTE, EXOTIC_ESTIMATE_NOTE } from "../format";
import { bookingSteps, DEFAULT_VEHICLE_SIZE, requiresGarage } from "../schema";
import { getTimeSlots } from "../slots";

const SPEC_SLUGS = ["basic-wash", "premium-detail", "full-deluxe", "working-truck"];
const SPEC_SIZES = ["car", "suv", "truck", "sports", "exotic", "motorcycle"];

describe("live catalog", () => {
  it("offers exactly the four spec services, all mobile", () => {
    expect(services.map((s) => s.slug).sort()).toEqual([...SPEC_SLUGS].sort());
    for (const slug of SPEC_SLUGS) expect(requiresGarage(slug)).toBe(false);
  });

  it("uses the six spec vehicle types, defaulting to car", () => {
    expect(vehicleSizes.map((v) => v.id)).toEqual(SPEC_SIZES);
    expect(DEFAULT_VEHICLE_SIZE).toBe("car");
  });

  it("skips the add-ons step because none are offered", () => {
    expect(addOns).toEqual([]);
    expect(bookingSteps.map((s) => s.id)).toEqual(["service", "vehicle", "schedule", "contact"]);
  });

  it("prices every service for every vehicle type and fits it into a weekday", () => {
    for (const service of services) {
      for (const { id } of vehicleSizes) {
        expect(calculateEstimate({ serviceSlug: service.slug, size: id }).total).toBeGreaterThan(0);
        // Wednesday 14 Oct 2026.
        const slots = getTimeSlots({ date: "2026-10-14", serviceSlug: service.slug, size: id });
        expect(slots.length).toBeGreaterThan(0);
        expect(slots[0].kind).toBe("start");
      }
    }
  });

  it("notes the work-vehicle surcharge and exotic starting prices", () => {
    expect(getService("working-truck")).toBeDefined();
    expect(getEstimateNote("working-truck", "truck")).toBe(
      "Starting price; extremely dirty trucks, SUVs and work vehicles may add $15–$30, quoted on site.",
    );
    expect(getEstimateNote("full-deluxe", "exotic")).toBe(EXOTIC_ESTIMATE_NOTE);
    expect(getEstimateNote("basic-wash", "car")).toBe(DEFAULT_ESTIMATE_NOTE);
  });
});
