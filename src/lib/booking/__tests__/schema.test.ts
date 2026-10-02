import { describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import { formatPhoneAsYouType, formatUsPhone, isValidUsPhone, normalizeUsPhone } from "../phone";
import {
  emptyDraft,
  DEFAULT_VEHICLE_SIZE,
  firstStepWithErrors,
  getBookingSteps,
  getCrossFieldErrors,
  getRecommendedAddOns,
  OTHER_CITY,
  requiresGarage,
  UTILITIES_REQUIRED_MESSAGE,
  stepIndexOf,
  validateAllSteps,
  validateBooking,
  validateStep,
  type BookingDraft,
} from "../schema";

vi.mock("@/data/services", async (importOriginal) =>
  (await import("./fixtures/catalog")).withFixtureCatalog(await importOriginal<object>()),
);

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");

const validDraft: BookingDraft = {
  ...emptyDraft,
  service: "fx-full",
  size: "suv",
  year: "2022",
  make: "Porsche",
  model: "Macan",
  color: "Chalk",
  paintCondition: "light-swirls",
  interiorCondition: "lived-in",
  petHair: true,
  smoke: false,
  addOns: ["pet-hair-removal"],
  street: "123 Main St",
  city: siteConfig.serviceArea[0],
  cityOther: "",
  zip: siteConfig.address.zip,
  utilitiesConfirmed: true,
  garageConfirmed: false,
  date: "2026-10-14",
  time: "09:00",
  name: "Jordan Reyes",
  email: "Jordan@Example.com ",
  phone: "760.555.0123",
  notes: "",
  smsConsent: true,
};

describe("phone helpers", () => {
  it("normalizes common US formats", () => {
    expect(normalizeUsPhone("(760) 555-0123")).toBe("7605550123");
    expect(normalizeUsPhone("+1 760 555 0123")).toBe("7605550123");
    expect(normalizeUsPhone("1-760-555-0123")).toBe("7605550123");
    expect(formatUsPhone("760.555.0123")).toBe("(760) 555-0123");
  });

  it("rejects numbers that are not valid NANP numbers", () => {
    expect(isValidUsPhone("555-0123")).toBe(false);
    expect(isValidUsPhone("(012) 555-0123")).toBe(false);
    expect(isValidUsPhone("(760) 155-0123")).toBe(false);
    expect(isValidUsPhone("760555012345")).toBe(false);
  });

  it("formats progressively while typing", () => {
    expect(formatPhoneAsYouType("5")).toBe("(5");
    expect(formatPhoneAsYouType("76055")).toBe("(760) 55");
    expect(formatPhoneAsYouType("7605550123")).toBe("(760) 555-0123");
    expect(formatPhoneAsYouType("+1 760 555 0123")).toBe("(760) 555-0123");
    expect(formatPhoneAsYouType("")).toBe("");
  });
});

describe("step validation", () => {
  it("requires a known service", () => {
    expect(validateStep("service", emptyDraft, NOW).service).toMatch(/choose a service/i);
    expect(
      validateStep("service", { ...emptyDraft, service: "made-up" }, NOW).service,
    ).toBeDefined();
    expect(validateStep("service", validDraft, NOW)).toEqual({});
  });

  it("requires make, model and both conditions on the vehicle step", () => {
    const errors = validateStep("vehicle", emptyDraft, NOW);
    expect(Object.keys(errors).sort()).toEqual([
      "interiorCondition",
      "make",
      "model",
      "paintCondition",
    ]);
    expect(validateStep("vehicle", validDraft, NOW)).toEqual({});
  });

  it("defaults to the first vehicle type and rejects unknown ones", () => {
    expect(DEFAULT_VEHICLE_SIZE).toBe("car");
    expect(validateStep("vehicle", { ...validDraft, size: "car" }, NOW)).toEqual({});
    expect(
      validateStep("vehicle", { ...validDraft, size: "sedan" as BookingDraft["size"] }, NOW).size,
    ).toBeDefined();
  });

  it("does not ask about the interior of a motorcycle", () => {
    const bike = {
      ...validDraft,
      size: "motorcycle" as BookingDraft["size"],
      interiorCondition: "" as const,
      petHair: false,
    };
    expect(validateStep("vehicle", bike, NOW)).toEqual({});
    expect(
      validateStep("vehicle", { ...bike, size: "exotic" }, NOW).interiorCondition,
    ).toBeDefined();
  });

  it("accepts an empty year but rejects a malformed one", () => {
    expect(validateStep("vehicle", { ...validDraft, year: "" }, NOW).year).toBeUndefined();
    expect(validateStep("vehicle", { ...validDraft, year: "22" }, NOW).year).toBeDefined();
    expect(validateStep("vehicle", { ...validDraft, year: "1890" }, NOW).year).toBeDefined();
  });

  it("rejects unknown and duplicate add-ons", () => {
    expect(
      validateStep("addons", { ...validDraft, addOns: ["laser-wax"] }, NOW).addOns,
    ).toBeDefined();
    expect(
      validateStep("addons", { ...validDraft, addOns: ["fx-engine", "fx-engine"] }, NOW).addOns,
    ).toBeDefined();
    expect(validateStep("addons", { ...validDraft, addOns: [] }, NOW)).toEqual({});
  });

  it("always requires a service address", () => {
    const errors = validateStep("schedule", { ...validDraft, street: "", city: "", zip: "" }, NOW);
    expect(Object.keys(errors).sort()).toEqual(["city", "street", "zip"]);
  });

  it("asks which city when Other is chosen", () => {
    expect(
      validateStep("schedule", { ...validDraft, city: OTHER_CITY }, NOW).cityOther,
    ).toBeDefined();
    expect(
      validateStep("schedule", { ...validDraft, city: OTHER_CITY, cityOther: "Barstow" }, NOW),
    ).toEqual({});
    expect(validateStep("schedule", { ...validDraft, city: "Houston" }, NOW).city).toBeDefined();
  });

  it("rejects bad ZIP codes", () => {
    expect(validateStep("schedule", { ...validDraft, zip: "9239" }, NOW).zip).toBeDefined();
    expect(validateStep("schedule", { ...validDraft, zip: "92392-1234" }, NOW).zip).toBeUndefined();
  });

  it("validates contact details", () => {
    const errors = validateStep(
      "contact",
      { ...validDraft, name: "J", email: "jordan@", phone: "555" },
      NOW,
    );
    expect(Object.keys(errors).sort()).toEqual(["email", "name", "phone"]);
    expect(validateStep("contact", validDraft, NOW)).toEqual({});
  });
});

describe("cross-field rules", () => {
  it("requires garage confirmation for garage services", () => {
    expect(requiresGarage("fx-garage")).toBe(true);
    expect(requiresGarage("fx-full")).toBe(false);
    expect(requiresGarage("unknown")).toBe(false);
    const coating = { ...validDraft, service: "fx-garage", time: "07:00" };
    expect(getCrossFieldErrors(coating, NOW).garageConfirmed).toMatch(/garage or covered space/i);
    expect(getCrossFieldErrors(coating, NOW).garageConfirmed).toMatch(/shade and still air/);
    expect(getCrossFieldErrors({ ...coating, garageConfirmed: true }, NOW)).toEqual({});
  });

  it("requires a water spigot and power outlet for every booking", () => {
    const errors = getCrossFieldErrors({ ...validDraft, utilitiesConfirmed: false }, NOW);
    expect(errors.utilitiesConfirmed).toBe(UTILITIES_REQUIRED_MESSAGE);
    expect(errors.utilitiesConfirmed).toMatch(/doesn't carry a water tank or generator/);
    expect(
      validateStep("schedule", { ...validDraft, utilitiesConfirmed: false }, NOW)
        .utilitiesConfirmed,
    ).toBeDefined();
    expect(firstStepWithErrors({ utilitiesConfirmed: "x" })).toBe(stepIndexOf("schedule"));
  });

  it("does not ask for a garage on regular mobile services", () => {
    expect(getCrossFieldErrors(validDraft, NOW).garageConfirmed).toBeUndefined();
  });

  it("rejects Sundays, past dates and dates beyond the window", () => {
    expect(getCrossFieldErrors({ ...validDraft, date: "2026-10-11" }, NOW).date).toMatch(
      /closed on Sundays/,
    );
    expect(getCrossFieldErrors({ ...validDraft, date: "2026-10-07" }, NOW).date).toMatch(
      /too soon.*Thursday, October 8, 2026/,
    );
    expect(getCrossFieldErrors({ ...validDraft, date: "2027-01-15" }, NOW).date).toMatch(/60 days/);
  });

  it("rejects a time that doesn't fit the service on that day", () => {
    // Fixture Full on an SUV is "5–6 hrs", fitted on the upper bound (6 h). Saturday closes
    // at 4 PM, so 11 AM is now too late and 10 AM is the last start.
    expect(
      getCrossFieldErrors({ ...validDraft, date: "2026-10-10", time: "11:00", addOns: [] }, NOW)
        .time,
    ).toBeDefined();
    expect(
      getCrossFieldErrors({ ...validDraft, date: "2026-10-10", time: "10:00", addOns: [] }, NOW)
        .time,
    ).toBeUndefined();
  });
});

describe("validateBooking (server)", () => {
  it("accepts a complete booking and normalizes it", () => {
    const result = validateBooking(validDraft, NOW);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.email).toBe("jordan@example.com");
    expect(result.data.phone).toBe("(760) 555-0123");
  });

  it("rejects payloads that are not objects", () => {
    expect(validateBooking("hello", NOW).success).toBe(false);
    expect(validateBooking(null, NOW).success).toBe(false);
  });

  it("returns field errors for tampered values", () => {
    const result = validateBooking({ ...validDraft, size: "limo", addOns: ["free-car"] }, NOW);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.size).toBeDefined();
    expect(result.fieldErrors.addOns).toBeDefined();
  });

  it("applies cross-field rules after the shape is valid", () => {
    const result = validateBooking({ ...validDraft, date: "2026-10-11" }, NOW);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.date).toBeDefined();
  });
});

describe("helpers", () => {
  it("only includes the add-ons step when add-ons are offered", () => {
    expect(getBookingSteps(true).map((s) => s.id)).toEqual([
      "service",
      "vehicle",
      "addons",
      "schedule",
      "contact",
    ]);
    expect(getBookingSteps(false).map((s) => s.id)).toEqual([
      "service",
      "vehicle",
      "schedule",
      "contact",
    ]);
  });

  it("maps errors to the first step that owns them", () => {
    expect(firstStepWithErrors({ phone: "x", make: "y" })).toBe(stepIndexOf("vehicle"));
    expect(firstStepWithErrors({})).toBe(-1);
    expect(Object.keys(validateAllSteps(validDraft, NOW))).toEqual([]);
  });

  it("recommends add-ons from the vehicle answers", () => {
    expect(getRecommendedAddOns({ petHair: true, smoke: true })).toEqual([
      "pet-hair-removal",
      "odor-elimination",
    ]);
    expect(getRecommendedAddOns({ petHair: false, smoke: false })).toEqual([]);
  });
});
