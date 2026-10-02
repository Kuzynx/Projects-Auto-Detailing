/**
 * Booking validation (zod v4). One set of rules for every step on the client
 * and for the whole payload in the server action.
 */
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { getAddOn, getService, services, type VehicleSize } from "@/data/services";
import { isValidUsPhone, formatUsPhone } from "./phone";
import {
  findTimeSlot,
  formatDateLong,
  getClosedWeekdays,
  getDateUnavailableReason,
  getFirstBookableDate,
  BOOKING_WINDOW_DAYS,
} from "./slots";

/* ------------------------------------------------------------------ */
/* Option lists                                                        */
/* ------------------------------------------------------------------ */

export const vehicleSizeIds = ["sedan", "suv", "truck"] as const satisfies readonly VehicleSize[];

export const paintConditions = [
  { value: "excellent", label: "Excellent", hint: "Deep gloss, no marks you can see" },
  { value: "light-swirls", label: "Light swirls", hint: "Fine circular marks in direct sun" },
  {
    value: "visible-scratches",
    label: "Visible scratches",
    hint: "Marks you notice from a few feet away",
  },
  { value: "neglected", label: "Neglected", hint: "Oxidation, water spots or faded paint" },
] as const;

export const interiorConditions = [
  { value: "clean", label: "Clean", hint: "Light dust, kept up regularly" },
  { value: "lived-in", label: "Lived-in", hint: "Crumbs, light stains, daily-driver wear" },
  { value: "heavily-soiled", label: "Heavily soiled", hint: "Ground-in dirt, spills or stains" },
  { value: "neglected", label: "Neglected", hint: "Mold, heavy odor or biohazard cleanup" },
] as const;

export type PaintCondition = (typeof paintConditions)[number]["value"];
export type InteriorCondition = (typeof interiorConditions)[number]["value"];

export const locationTypes = ["mobile", "studio"] as const;
export type LocationType = (typeof locationTypes)[number];

/** Select value for a city outside `siteConfig.serviceArea`. */
export const OTHER_CITY = "Other";

/**
 * Services whose catalog `location` is "studio" (paint correction, ceramic
 * coating) need dust-free air and color-matched lighting, so they cannot be
 * booked as mobile appointments.
 */
export function isStudioOnly(serviceSlug: string): boolean {
  return getService(serviceSlug)?.location === "studio";
}

/** Add-ons we suggest based on what the customer told us about the vehicle. */
export function getRecommendedAddOns(draft: Pick<BookingDraft, "petHair" | "smoke">): string[] {
  const slugs: string[] = [];
  if (draft.petHair) slugs.push("pet-hair-removal");
  if (draft.smoke) slugs.push("odor-elimination");
  return slugs.filter((slug) => getAddOn(slug));
}

/* ------------------------------------------------------------------ */
/* Draft (client state)                                                */
/* ------------------------------------------------------------------ */

export interface BookingDraft {
  service: string;
  size: VehicleSize;
  year: string;
  make: string;
  model: string;
  color: string;
  paintCondition: PaintCondition | "";
  interiorCondition: InteriorCondition | "";
  petHair: boolean;
  smoke: boolean;
  addOns: string[];
  locationType: LocationType;
  street: string;
  city: string;
  cityOther: string;
  zip: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  smsConsent: boolean;
}

export type BookingField = keyof BookingDraft;
export type FieldErrors = Partial<Record<BookingField, string>>;

export const emptyDraft: BookingDraft = {
  service: "",
  size: "sedan",
  year: "",
  make: "",
  model: "",
  color: "",
  paintCondition: "",
  interiorCondition: "",
  petHair: false,
  smoke: false,
  addOns: [],
  locationType: "mobile",
  street: "",
  city: "",
  cityOther: "",
  zip: "",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
  notes: "",
  smsConsent: false,
};

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export const bookingSteps = [
  { id: "service", label: "Service", fields: ["service"] },
  {
    id: "vehicle",
    label: "Vehicle",
    fields: [
      "size",
      "year",
      "make",
      "model",
      "color",
      "paintCondition",
      "interiorCondition",
      "petHair",
      "smoke",
    ],
  },
  { id: "addons", label: "Add-ons", fields: ["addOns"] },
  {
    id: "schedule",
    label: "Time & place",
    fields: ["locationType", "street", "city", "cityOther", "zip", "date", "time"],
  },
  { id: "contact", label: "Confirm", fields: ["name", "email", "phone", "notes", "smsConsent"] },
] as const satisfies readonly { id: string; label: string; fields: readonly BookingField[] }[];

export type BookingStepId = (typeof bookingSteps)[number]["id"];

export function stepIndexOf(id: BookingStepId): number {
  return bookingSteps.findIndex((step) => step.id === id);
}

/** Index of the first step that owns any of these errors, or -1. */
export function firstStepWithErrors(errors: FieldErrors): number {
  return bookingSteps.findIndex((step) =>
    step.fields.some((field) => errors[field as BookingField]),
  );
}

/* ------------------------------------------------------------------ */
/* Schemas                                                             */
/* ------------------------------------------------------------------ */

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Keep this under ${max} characters.` });
const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((item) => item.value) as unknown as readonly [
    T[number]["value"],
    ...T[number]["value"][],
  ];

function maxModelYear() {
  return new Date().getFullYear() + 2;
}

export const serviceStepSchema = z.object({
  service: z
    .string({ error: "Choose a service to continue." })
    .refine((slug) => Boolean(getService(slug)), {
      error: "Choose a service to continue.",
    }),
});

export const vehicleStepSchema = z.object({
  size: z.enum(vehicleSizeIds, { error: "Choose your vehicle size." }),
  year: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (/^\d{4}$/.test(v) && Number(v) >= 1950 && Number(v) <= maxModelYear()),
      {
        error: "Enter a four-digit year, like 2021.",
      },
    ),
  make: text(40).min(1, { error: "Enter the make, like Porsche or Toyota." }),
  model: text(60).min(1, { error: "Enter the model, like 911 or RAV4." }),
  color: text(30),
  paintCondition: z.enum(values(paintConditions), {
    error: "Choose the closest match for your paint.",
  }),
  interiorCondition: z.enum(values(interiorConditions), {
    error: "Choose the closest match for your interior.",
  }),
  petHair: z.boolean(),
  smoke: z.boolean(),
});

export const addOnsStepSchema = z.object({
  addOns: z
    .array(
      z.string().refine((slug) => Boolean(getAddOn(slug)), {
        error: "One of those add-ons is no longer offered.",
      }),
    )
    .refine((list) => new Set(list).size === list.length, {
      error: "Each add-on can only be selected once.",
    }),
});

export const scheduleStepSchema = z.object({
  locationType: z.enum(locationTypes, { error: "Choose mobile service or studio drop-off." }),
  street: text(120),
  city: text(60),
  cityOther: text(60),
  zip: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{5}(-\d{4})?$/.test(v), { error: "Enter a 5-digit ZIP code." }),
  date: z.string().min(1, { error: "Choose a date." }),
  time: z.string().min(1, { error: "Choose a time." }),
});

export const contactStepSchema = z.object({
  name: text(80).min(2, { error: "Enter your full name." }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Enter a valid email, like you@example.com." }).max(254)),
  phone: z
    .string()
    .trim()
    .refine(isValidUsPhone, { error: "Enter a 10-digit US mobile number." })
    .transform(formatUsPhone),
  notes: text(1000),
  smsConsent: z.boolean(),
});

/** Every field. Cross-field rules run separately in `getCrossFieldErrors`. */
export const bookingSchema = z.object({
  ...serviceStepSchema.shape,
  ...vehicleStepSchema.shape,
  ...addOnsStepSchema.shape,
  ...scheduleStepSchema.shape,
  ...contactStepSchema.shape,
});

export type BookingData = z.output<typeof bookingSchema>;

const stepSchemas = {
  service: serviceStepSchema,
  vehicle: vehicleStepSchema,
  addons: addOnsStepSchema,
  schedule: scheduleStepSchema,
  contact: contactStepSchema,
} satisfies Record<BookingStepId, z.ZodType>;

/* ------------------------------------------------------------------ */
/* Cross-field rules                                                   */
/* ------------------------------------------------------------------ */

type CrossFieldInput = Pick<
  BookingDraft,
  | "service"
  | "size"
  | "addOns"
  | "locationType"
  | "street"
  | "city"
  | "cityOther"
  | "zip"
  | "date"
  | "time"
>;

/**
 * Rules that depend on more than one field or on the clock: studio-only
 * services, mobile address, open days, lead time and time-slot fit.
 */
export function getCrossFieldErrors(data: CrossFieldInput, now: Date): FieldErrors {
  const errors: FieldErrors = {};
  const service = getService(data.service);

  if (service && isStudioOnly(service.slug) && data.locationType !== "studio") {
    errors.locationType = `${service.name} is performed in our studio only. Choose studio drop-off.`;
  }

  if (data.locationType === "mobile") {
    if (!data.street.trim())
      errors.street = "Enter the street address where the car will be parked.";
    const city = data.city.trim();
    if (!city) errors.city = "Choose your city.";
    else if (city !== OTHER_CITY && !(siteConfig.serviceArea as readonly string[]).includes(city)) {
      errors.city = "Choose a city from the list, or Other.";
    } else if (city === OTHER_CITY && !data.cityOther.trim()) {
      errors.cityOther = "Tell us which city the car is in.";
    }
    if (!data.zip.trim()) errors.zip = "Enter a 5-digit ZIP code.";
  }

  if (data.date) {
    const reason = getDateUnavailableReason(data.date, now);
    if (reason === "invalid") errors.date = "Choose a date from the calendar.";
    else if (reason === "too-soon") {
      const first = getFirstBookableDate(now);
      errors.date = first
        ? `That date is too soon. The earliest available date is ${formatDateLong(first)}.`
        : "That date is too soon. Choose a later date.";
    } else if (reason === "too-far")
      errors.date = `We book up to ${BOOKING_WINDOW_DAYS} days out. Choose an earlier date.`;
    else if (reason === "closed") {
      const closed = getClosedWeekdays();
      errors.date = closed.length
        ? `We're closed on ${closed.join(" and ")}s. Choose another day.`
        : "We're closed that day.";
    }
  }

  if (data.date && data.time && !errors.date && service) {
    const slot = findTimeSlot({
      serviceSlug: service.slug,
      size: data.size,
      addOnSlugs: data.addOns,
      date: data.date,
      time: data.time,
    });
    if (!slot)
      errors.time = "That time doesn't fit this service on the chosen day. Pick another time.";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Validation entry points                                             */
/* ------------------------------------------------------------------ */

function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors))
      errors[field as BookingField] = issue.message;
  }
  return errors;
}

/** Errors for the fields of one step (empty object when the step is valid). */
export function validateStep(step: BookingStepId, draft: BookingDraft, now: Date): FieldErrors {
  const result = stepSchemas[step].safeParse(draft);
  const errors = result.success ? {} : toFieldErrors(result.error);
  if (step === "schedule") {
    const cross = getCrossFieldErrors(draft, now);
    for (const [field, message] of Object.entries(cross) as [BookingField, string][]) {
      errors[field] ??= message;
    }
  }
  return errors;
}

/** Errors across every step, in step order. */
export function validateAllSteps(draft: BookingDraft, now: Date): FieldErrors {
  return bookingSteps.reduce<FieldErrors>(
    (acc, step) => ({ ...acc, ...validateStep(step.id, draft, now) }),
    {},
  );
}

export type BookingValidationResult =
  { success: true; data: BookingData } | { success: false; fieldErrors: FieldErrors };

/** Full server-side validation of an untrusted payload. */
export function validateBooking(input: unknown, now: Date): BookingValidationResult {
  const result = bookingSchema.safeParse(input);
  if (!result.success) return { success: false, fieldErrors: toFieldErrors(result.error) };
  const cross = getCrossFieldErrors(result.data, now);
  if (Object.keys(cross).length > 0) return { success: false, fieldErrors: cross };
  return { success: true, data: result.data };
}

/** Service slugs, in catalog order. */
export const serviceSlugs = services.map((service) => service.slug);
