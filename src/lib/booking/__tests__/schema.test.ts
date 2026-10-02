import { describe, expect, it } from "vitest";
import { formatPhoneAsYouType, formatUsPhone, isValidUsPhone, normalizeUsPhone } from "../phone";
import {
  emptyDraft,
  firstStepWithErrors,
  getCrossFieldErrors,
  getRecommendedAddOns,
  OTHER_CITY,
  stepIndexOf,
  validateAllSteps,
  validateBooking,
  validateStep,
  type BookingDraft,
} from "../schema";

// Wednesday 7 Oct 2026, 10:00 AM in Austin.
const NOW = new Date("2026-10-07T15:00:00Z");

const validDraft: BookingDraft = {
  ...emptyDraft,
  service: "full-detail",
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
  locationType: "mobile",
  street: "1200 Barton Hills Dr",
  city: "Austin",
  cityOther: "",
  zip: "78704",
  date: "2026-10-14",
  time: "09:00",
  name: "Jordan Reyes",
  email: "Jordan@Example.com ",
  phone: "512.555.0123",
  notes: "",
  smsConsent: true,
};

describe("phone helpers", () => {
  it("normalizes common US formats", () => {
    expect(normalizeUsPhone("(512) 555-0123")).toBe("5125550123");
    expect(normalizeUsPhone("+1 512 555 0123")).toBe("5125550123");
    expect(normalizeUsPhone("1-512-555-0123")).toBe("5125550123");
    expect(formatUsPhone("512.555.0123")).toBe("(512) 555-0123");
  });

  it("rejects numbers that are not valid NANP numbers", () => {
    expect(isValidUsPhone("555-0123")).toBe(false);
    expect(isValidUsPhone("(012) 555-0123")).toBe(false);
    expect(isValidUsPhone("(512) 155-0123")).toBe(false);
    expect(isValidUsPhone("512555012345")).toBe(false);
  });

  it("formats progressively while typing", () => {
    expect(formatPhoneAsYouType("5")).toBe("(5");
    expect(formatPhoneAsYouType("51255")).toBe("(512) 55");
    expect(formatPhoneAsYouType("5125550123")).toBe("(512) 555-0123");
    expect(formatPhoneAsYouType("+1 512 555 0123")).toBe("(512) 555-0123");
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
      validateStep("addons", { ...validDraft, addOns: ["engine-bay", "engine-bay"] }, NOW).addOns,
    ).toBeDefined();
    expect(validateStep("addons", { ...validDraft, addOns: [] }, NOW)).toEqual({});
  });

  it("requires a full address for mobile service", () => {
    const errors = validateStep("schedule", { ...validDraft, street: "", city: "", zip: "" }, NOW);
    expect(Object.keys(errors).sort()).toEqual(["city", "street", "zip"]);
  });

  it("does not need an address for studio drop-off", () => {
    expect(
      validateStep(
        "schedule",
        { ...validDraft, locationType: "studio", street: "", city: "", zip: "" },
        NOW,
      ),
    ).toEqual({});
  });

  it("asks which city when Other is chosen", () => {
    expect(
      validateStep("schedule", { ...validDraft, city: OTHER_CITY }, NOW).cityOther,
    ).toBeDefined();
    expect(
      validateStep(
        "schedule",
        { ...validDraft, city: OTHER_CITY, cityOther: "Dripping Springs" },
        NOW,
      ),
    ).toEqual({});
    expect(validateStep("schedule", { ...validDraft, city: "Houston" }, NOW).city).toBeDefined();
  });

  it("rejects bad ZIP codes", () => {
    expect(validateStep("schedule", { ...validDraft, zip: "7870" }, NOW).zip).toBeDefined();
    expect(validateStep("schedule", { ...validDraft, zip: "78704-1234" }, NOW).zip).toBeUndefined();
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
  it("keeps studio-only services in the studio", () => {
    const errors = getCrossFieldErrors(
      { ...validDraft, service: "ceramic-coating", locationType: "mobile", time: "08:00" },
      NOW,
    );
    expect(errors.locationType).toMatch(/studio only/i);
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
    // Full Detail SUV is 5 hours; Saturday closes at 4 PM, so 1 PM is too late.
    expect(
      getCrossFieldErrors({ ...validDraft, date: "2026-10-10", time: "13:00", addOns: [] }, NOW)
        .time,
    ).toBeDefined();
    expect(
      getCrossFieldErrors({ ...validDraft, date: "2026-10-10", time: "11:00", addOns: [] }, NOW)
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
    expect(result.data.phone).toBe("(512) 555-0123");
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
