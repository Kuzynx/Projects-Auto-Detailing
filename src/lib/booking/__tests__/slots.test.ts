import { describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import {
  addDays,
  BUSINESS_TIME_ZONE,
  formatClock,
  getBookingWindow,
  getDateUnavailableReason,
  getFirstBookableDate,
  getJobDuration,
  getTimeSlots,
  getZonedNow,
  isIsoDate,
  parseClockTime,
  parseDayRange,
  parseDuration,
  parseWeeklyHours,
  weekdayOf,
  weeklyHours,
} from "../slots";

vi.mock("@/data/services", async (importOriginal) =>
  (await import("./fixtures/catalog")).withFixtureCatalog(await importOriginal<object>()),
);

// Wednesday 7 Oct 2026, 10:00 AM local (PDT, UTC-7). Time zone comes from siteConfig.timeZone.
const WED_MORNING = new Date("2026-10-07T17:00:00Z");
// Same day, 3:00 PM local: past the 2 PM next-day cutoff.
const WED_AFTERNOON = new Date("2026-10-07T22:00:00Z");

describe("hours parsing", () => {
  it("parses 12-hour clock times", () => {
    expect(parseClockTime("7:00 AM")).toBe(420);
    expect(parseClockTime("6:00 PM")).toBe(1080);
    expect(parseClockTime("12:00 PM")).toBe(720);
    expect(parseClockTime("12:30 AM")).toBe(30);
    expect(parseClockTime("Closed")).toBeNull();
    expect(parseClockTime("")).toBeNull();
  });

  it("expands day ranges", () => {
    expect(parseDayRange("Monday – Friday")).toEqual([1, 2, 3, 4, 5]);
    expect(parseDayRange("Saturday")).toEqual([6]);
    expect(parseDayRange("Mon-Wed, Fri")).toEqual([1, 2, 3, 5]);
    expect(parseDayRange("Friday – Monday")).toEqual([0, 1, 5, 6]);
  });

  it("derives the weekly schedule from siteConfig.hours", () => {
    expect(weeklyHours[0]).toBeNull();
    for (const day of [1, 2, 3, 4, 5]) expect(weeklyHours[day]).toEqual({ open: 420, close: 1080 });
    expect(weeklyHours[6]).toEqual({ open: 420, close: 960 });
  });

  it("treats closed rows and inverted windows as closed", () => {
    const week = parseWeeklyHours([{ days: "Tuesday", open: "5:00 PM", close: "9:00 AM" }]);
    expect(week[2]).toBeNull();
  });
});

describe("date helpers", () => {
  it("validates ISO calendar dates", () => {
    expect(isIsoDate("2026-10-10")).toBe(true);
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(isIsoDate("10/10/2026")).toBe(false);
  });

  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("knows the weekday", () => {
    expect(weekdayOf("2026-10-11")).toBe(0); // Sunday
    expect(weekdayOf("2026-10-10")).toBe(6); // Saturday
  });

  it("uses siteConfig.timeZone", () => {
    expect(BUSINESS_TIME_ZONE).toBe(siteConfig.timeZone);
  });

  it("reads the wall clock in the business time zone, not the server's", () => {
    // 03:30 UTC on 8 Oct is still the evening of 7 Oct in Pacific daylight time.
    expect(getZonedNow(new Date("2026-10-08T03:30:00Z"))).toEqual({
      date: "2026-10-07",
      minutes: 20 * 60 + 30,
    });
    // Standard time after the November DST change (UTC-8).
    expect(getZonedNow(new Date("2026-11-02T15:00:00Z"))).toEqual({
      date: "2026-11-02",
      minutes: 7 * 60,
    });
  });
});

describe("booking window", () => {
  it("allows next-day bookings before 2 PM", () => {
    expect(getBookingWindow(WED_MORNING)).toEqual({
      today: "2026-10-07",
      earliest: "2026-10-08",
      latest: "2026-12-06",
    });
  });

  it("pushes the earliest date out a day after 2 PM", () => {
    expect(getBookingWindow(WED_AFTERNOON).earliest).toBe("2026-10-09");
  });

  it("explains why a date is unavailable", () => {
    expect(getDateUnavailableReason("2026-10-07", WED_MORNING)).toBe("too-soon");
    expect(getDateUnavailableReason("2026-10-08", WED_MORNING)).toBeNull();
    expect(getDateUnavailableReason("2026-10-08", WED_AFTERNOON)).toBe("too-soon");
    expect(getDateUnavailableReason("2026-10-11", WED_MORNING)).toBe("closed");
    expect(getDateUnavailableReason("2026-12-07", WED_MORNING)).toBe("too-far");
    expect(getDateUnavailableReason("2026-12-06", WED_MORNING)).toBe("closed"); // a Sunday
    expect(getDateUnavailableReason("2026-12-05", WED_MORNING)).toBeNull();
    expect(getDateUnavailableReason("not-a-date", WED_MORNING)).toBe("invalid");
  });

  it("skips Sundays when finding the first open date", () => {
    // Saturday 10 Oct, 3 PM local: earliest is Monday 12 Oct because Sunday is closed.
    expect(getFirstBookableDate(new Date("2026-10-10T22:00:00Z"))).toBe("2026-10-12");
  });
});

describe("durations", () => {
  it("reads the upper bound of a duration label", () => {
    expect(parseDuration("1.5 hrs")).toEqual({ minutes: 90, dayBased: false });
    expect(parseDuration("4–5 hrs")).toEqual({ minutes: 300, dayBased: false });
    expect(parseDuration("~2.5–3.5 hrs")).toEqual({ minutes: 210, dayBased: false });
    expect(parseDuration(undefined)).toEqual({ minutes: 0, dayBased: false });
    expect(parseDuration("+45 min")).toEqual({ minutes: 45, dayBased: false });
    expect(parseDuration("1 day")).toEqual({ minutes: 0, dayBased: true });
    expect(parseDuration("2–3 days")).toEqual({ minutes: 0, dayBased: true });
  });

  it("adds add-on time to the service time", () => {
    expect(
      getJobDuration({
        serviceSlug: "fx-wash",
        size: "car",
        addOnSlugs: ["fx-engine", "odor-elimination"],
      }),
    ).toEqual({ minutes: 90 + 30 + 60, dayBased: false });
  });

  it("counts a repeated add-on once", () => {
    expect(
      getJobDuration({
        serviceSlug: "fx-wash",
        size: "car",
        addOnSlugs: ["fx-engine", "fx-engine"],
      }).minutes,
    ).toBe(120);
  });

  it("reads approximate labels like the live catalog's", () => {
    expect(getJobDuration({ serviceSlug: "fx-work", size: "truck" })).toEqual({
      minutes: 90,
      dayBased: false,
    });
  });
});

describe("time slots", () => {
  const values = (slots: { value: string }[]) => slots.map((s) => s.value);

  it("offers hourly starts from opening that finish by closing on weekdays", () => {
    const slots = getTimeSlots({ date: "2026-10-14", serviceSlug: "fx-wash", size: "car" });
    expect(values(slots)).toEqual([
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ]);
    expect(slots[0]).toEqual({ value: "07:00", label: "7:00 AM", kind: "start" });
  });

  it("uses Saturday hours", () => {
    // "4–5 hrs" fits on the upper bound: 11:00 + 5 h = 4 PM close.
    const slots = getTimeSlots({ date: "2026-10-10", serviceSlug: "fx-full", size: "car" });
    expect(values(slots)).toEqual(["07:00", "08:00", "09:00", "10:00", "11:00"]);
  });

  it("uses the duration for the chosen vehicle type", () => {
    const slots = getTimeSlots({ date: "2026-10-10", serviceSlug: "fx-full", size: "truck" });
    expect(values(slots)).toEqual(["07:00", "08:00", "09:00"]);
  });

  it("hides starts that would run past close once add-ons are included", () => {
    const slots = getTimeSlots({
      date: "2026-10-10",
      serviceSlug: "fx-full",
      size: "car",
      addOnSlugs: ["odor-elimination"],
    });
    expect(values(slots)).toEqual(["07:00", "08:00", "09:00", "10:00"]);
  });

  it("returns nothing on closed days", () => {
    expect(getTimeSlots({ date: "2026-10-11", serviceSlug: "fx-wash", size: "car" })).toEqual([]);
  });

  it("gives day-based services a single arrival at opening", () => {
    expect(getTimeSlots({ date: "2026-10-12", serviceSlug: "fx-garage", size: "suv" })).toEqual([
      { value: "07:00", label: "Arrival 7:00 AM", kind: "arrival" },
    ]);
    expect(
      getTimeSlots({ date: "2026-10-10", serviceSlug: "fx-garage", size: "car" })[0].label,
    ).toBe("Arrival 7:00 AM");
  });

  it("falls back to one full-day start when the job is longer than the day", () => {
    const slots = getTimeSlots({
      date: "2026-10-10",
      serviceSlug: "fx-full",
      size: "truck",
      addOnSlugs: ["odor-elimination", "fx-wheels", "fx-headlights", "fx-engine"],
    });
    expect(slots).toEqual([{ value: "07:00", label: "7:00 AM (full day)", kind: "full-day" }]);
  });

  it("returns nothing for an unknown service or a bad date", () => {
    expect(getTimeSlots({ date: "2026-10-14", serviceSlug: "nope", size: "car" })).toEqual([]);
    expect(getTimeSlots({ date: "2026-13-01", serviceSlug: "fx-wash", size: "car" })).toEqual([]);
  });

  it("formats clock labels", () => {
    expect(formatClock(0)).toBe("12:00 AM");
    expect(formatClock(720)).toBe("12:00 PM");
    expect(formatClock(1050)).toBe("5:30 PM");
  });
});
