/**
 * Scheduling rules for the booking flow. Pure functions only: every function
 * that depends on the current time takes `now` as an argument so the client,
 * the server action and the unit tests all agree.
 *
 * Dates are passed around as ISO calendar dates ("2026-10-10") and times as
 * 24-hour "HH:MM" strings, both interpreted in the studio's time zone.
 */
import { siteConfig } from "@/config/site";
import { getAddOn, getService, type VehicleSize } from "@/data/services";

/** The studio is in Austin, TX. All appointment times are local to it. */
export const BUSINESS_TIME_ZONE = siteConfig.timeZone;
/** How far ahead customers can book online. */
export const BOOKING_WINDOW_DAYS = 60;
/** Minimum notice, in calendar days. Same-day bookings are by phone only. */
export const MIN_LEAD_DAYS = 1;
/** After this local hour, next-day appointments close and the lead grows by a day. */
export const NEXT_DAY_CUTOFF_HOUR = 14;
/** Appointment starts are offered on the hour. */
export const SLOT_INTERVAL_MINUTES = 60;

export type IsoDate = string;

/** Opening window for one weekday, in minutes from midnight. `null` when closed. */
export type DayHours = { open: number; close: number } | null;
/** Index 0 is Sunday, matching `Date#getUTCDay`. */
export type WeeklyHours = readonly DayHours[];

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

/* ------------------------------------------------------------------ */
/* Parsing business hours from siteConfig                              */
/* ------------------------------------------------------------------ */

/** "8:00 AM" -> 480, "6:00 PM" -> 1080. Returns null for "Closed" or junk. */
export function parseClockTime(value: string): number | null {
  const match = /^\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*$/i.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  if (hour < 1 || hour > 12 || minute > 59) return null;
  const isPm = match[3].toLowerCase() === "pm";
  return ((hour % 12) + (isPm ? 12 : 0)) * 60 + minute;
}

function dayIndex(token: string): number | null {
  const key = token.trim().slice(0, 3).toLowerCase();
  const index = DAY_KEYS.indexOf(key as (typeof DAY_KEYS)[number]);
  return index === -1 ? null : index;
}

/** "Monday – Friday" -> [1,2,3,4,5]; "Saturday" -> [6]; "Mon, Wed" -> [1,3]. */
export function parseDayRange(days: string): number[] {
  const result = new Set<number>();
  for (const part of days.split(",")) {
    const [startToken, endToken] = part.split(/\s*(?:–|—|-|\bto\b)\s*/i);
    const start = startToken ? dayIndex(startToken) : null;
    if (start === null) continue;
    const end = endToken ? dayIndex(endToken) : start;
    if (end === null) continue;
    for (let i = 0, day = start; i < 7; i++, day = (day + 1) % 7) {
      result.add(day);
      if (day === end) break;
    }
  }
  return [...result].sort((a, b) => a - b);
}

export function parseWeeklyHours(
  hours: readonly { days: string; open: string; close: string }[],
): WeeklyHours {
  const week: DayHours[] = Array.from({ length: 7 }, () => null);
  for (const row of hours) {
    const open = parseClockTime(row.open);
    const close = parseClockTime(row.close);
    const window = open !== null && close !== null && close > open ? { open, close } : null;
    for (const day of parseDayRange(row.days)) week[day] = window;
  }
  return week;
}

/** Business hours derived from `siteConfig.hours`, the single source of truth. */
export const weeklyHours: WeeklyHours = parseWeeklyHours(siteConfig.hours);

/* ------------------------------------------------------------------ */
/* ISO date helpers (time-zone safe: all math happens in UTC)          */
/* ------------------------------------------------------------------ */

function toUtcDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtcDate(date: Date): IsoDate {
  return date.toISOString().slice(0, 10);
}

export function isIsoDate(value: unknown): value is IsoDate {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return fromUtcDate(toUtcDate(value)) === value;
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = toUtcDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtcDate(date);
}

/** 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(iso: IsoDate): number {
  return toUtcDate(iso).getUTCDay();
}

export function toIsoDate(year: number, monthIndex: number, day: number): IsoDate {
  return fromUtcDate(new Date(Date.UTC(year, monthIndex, day)));
}

/** "Saturday, October 10, 2026" */
export function formatDateLong(iso: IsoDate): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(iso));
}

/** "Sat, Oct 10" */
export function formatDateShort(iso: IsoDate): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(iso));
}

/** Calendar date and minutes-past-midnight for `now` in the studio's time zone. */
export function getZonedNow(
  now: Date,
  timeZone: string = BUSINESS_TIME_ZONE,
): { date: IsoDate; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "0";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/* ------------------------------------------------------------------ */
/* Bookable dates                                                      */
/* ------------------------------------------------------------------ */

export interface BookingWindow {
  /** Today in the studio's time zone. */
  today: IsoDate;
  /** Earliest date a customer can pick (ignores closed days). */
  earliest: IsoDate;
  /** Last date a customer can pick. */
  latest: IsoDate;
}

export function getBookingWindow(now: Date): BookingWindow {
  const { date: today, minutes } = getZonedNow(now);
  const lead = MIN_LEAD_DAYS + (minutes >= NEXT_DAY_CUTOFF_HOUR * 60 ? 1 : 0);
  return { today, earliest: addDays(today, lead), latest: addDays(today, BOOKING_WINDOW_DAYS) };
}

export type DateUnavailableReason = "invalid" | "too-soon" | "too-far" | "closed";

export function getDateUnavailableReason(
  iso: string,
  now: Date,
  hours: WeeklyHours = weeklyHours,
): DateUnavailableReason | null {
  if (!isIsoDate(iso)) return "invalid";
  const window = getBookingWindow(now);
  if (iso < window.earliest) return "too-soon";
  if (iso > window.latest) return "too-far";
  if (!hours[weekdayOf(iso)]) return "closed";
  return null;
}

export function isDateBookable(iso: string, now: Date, hours: WeeklyHours = weeklyHours): boolean {
  return getDateUnavailableReason(iso, now, hours) === null;
}

/** First open, bookable date on or after the earliest allowed date. */
export function getFirstBookableDate(now: Date, hours: WeeklyHours = weeklyHours): IsoDate | null {
  const { earliest, latest } = getBookingWindow(now);
  for (let day = earliest; day <= latest; day = addDays(day, 1)) {
    if (hours[weekdayOf(day)]) return day;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Durations                                                           */
/* ------------------------------------------------------------------ */

export interface ParsedDuration {
  /** Working minutes. 0 for day-based (drop-off) durations. */
  minutes: number;
  /** True when the label is measured in days: a studio drop-off job. */
  dropOff: boolean;
}

/**
 * Reads the first number in a duration label: "4–5 hrs" -> 240 minutes,
 * "1.5 hrs" -> 90, "+45 min" -> 45, "2–3 days" -> drop-off.
 */
export function parseDuration(label: string): ParsedDuration {
  const match = /(\d+(?:\.\d+)?)/.exec(label);
  if (!match) return { minutes: 0, dropOff: false };
  const value = Number(match[1]);
  if (/day/i.test(label)) return { minutes: 0, dropOff: true };
  if (/min/i.test(label)) return { minutes: Math.round(value), dropOff: false };
  return { minutes: Math.round(value * 60), dropOff: false };
}

export interface JobInput {
  serviceSlug: string;
  size: VehicleSize;
  addOnSlugs?: readonly string[];
}

/** Total on-site time for a service plus its add-ons. */
export function getJobDuration({ serviceSlug, size, addOnSlugs = [] }: JobInput): ParsedDuration {
  const service = getService(serviceSlug);
  if (!service) return { minutes: 0, dropOff: false };
  const base = parseDuration(service.duration[size]);
  if (base.dropOff) return base;
  const extra = [...new Set(addOnSlugs)].reduce((sum, slug) => {
    const addOn = getAddOn(slug);
    return sum + (addOn ? parseDuration(addOn.duration).minutes : 0);
  }, 0);
  return { minutes: base.minutes + extra, dropOff: false };
}

/* ------------------------------------------------------------------ */
/* Time slots                                                          */
/* ------------------------------------------------------------------ */

export type TimeSlotKind = "start" | "drop-off" | "full-day";

export interface TimeSlot {
  /** "09:00" */
  value: string;
  /** "9:00 AM" or "Drop-off 8:00 AM" */
  label: string;
  kind: TimeSlotKind;
}

/** 540 -> "9:00 AM" */
export function formatClock(minutes: number): string {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${hour24 < 12 ? "AM" : "PM"}`;
}

/** 540 -> "09:00" */
export function toTimeValue(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** "09:00" -> 540, or null when malformed. */
export function parseTimeValue(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/**
 * Appointment starts for a date. Hourly from opening, keeping only starts that
 * finish by closing. Day-based services get a single drop-off at opening; jobs
 * longer than the whole day get a single full-day start at opening.
 */
export function getTimeSlots(
  input: JobInput & { date: string },
  hours: WeeklyHours = weeklyHours,
): TimeSlot[] {
  if (!isIsoDate(input.date)) return [];
  const day = hours[weekdayOf(input.date)];
  if (!day) return [];
  const job = getJobDuration(input);
  if (!getService(input.serviceSlug)) return [];

  if (job.dropOff) {
    return [
      {
        value: toTimeValue(day.open),
        label: `Drop-off ${formatClock(day.open)}`,
        kind: "drop-off",
      },
    ];
  }

  const slots: TimeSlot[] = [];
  for (let start = day.open; start + job.minutes <= day.close; start += SLOT_INTERVAL_MINUTES) {
    slots.push({ value: toTimeValue(start), label: formatClock(start), kind: "start" });
  }
  if (slots.length === 0) {
    return [
      {
        value: toTimeValue(day.open),
        label: `${formatClock(day.open)} (full day)`,
        kind: "full-day",
      },
    ];
  }
  return slots;
}

export function findTimeSlot(
  input: JobInput & { date: string; time: string },
  hours: WeeklyHours = weeklyHours,
) {
  return getTimeSlots(input, hours).find((slot) => slot.value === input.time);
}

/** Human-readable opening hours for one date, e.g. "8:00 AM – 6:00 PM". */
export function formatHoursForDate(iso: IsoDate, hours: WeeklyHours = weeklyHours): string | null {
  const day = hours[weekdayOf(iso)];
  return day ? `${formatClock(day.open)} – ${formatClock(day.close)}` : null;
}

/** Weekday names the studio is closed, e.g. ["Sunday"]. */
export function getClosedWeekdays(hours: WeeklyHours = weeklyHours): string[] {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return names.filter((_, i) => !hours[i]);
}
