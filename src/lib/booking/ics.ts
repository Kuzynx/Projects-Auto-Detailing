/**
 * Minimal RFC 5545 calendar file, generated client-side for the "Add to
 * calendar" button. Times are converted from business-local time to UTC so every
 * calendar app shows the right wall-clock time without a VTIMEZONE block.
 */
import { BUSINESS_TIME_ZONE, parseTimeValue } from "./slots";

/** Offset of `timeZone` from UTC at `instant`, in minutes (Los Angeles in October: -420). */
function getTimeZoneOffsetMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return Math.round((asUtc - instant.getTime()) / 60_000);
}

/** Wall-clock date + "HH:MM" in `timeZone` -> the matching UTC instant. */
export function zonedDateTimeToUtc(
  isoDate: string,
  time: string,
  timeZone: string = BUSINESS_TIME_ZONE,
): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  const minutes = parseTimeValue(time) ?? 0;
  const naive = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60);
  // Two passes settle the offset correctly across DST transitions.
  let utc = naive - getTimeZoneOffsetMinutes(new Date(naive), timeZone) * 60_000;
  utc = naive - getTimeZoneOffsetMinutes(new Date(utc), timeZone) * 60_000;
  return new Date(utc);
}

/** 2026-10-10T14:00:00.000Z -> "20261010T140000Z" */
export function formatIcsDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Folds content lines to 75 octets as the spec requires. */
function foldLine(line: string): string {
  const bytes = new TextEncoder();
  if (bytes.encode(line).length <= 75) return line;
  const out: string[] = [];
  let current = "";
  for (const char of line) {
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes.encode(current + char).length > limit) {
      out.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  out.push(current);
  return out.join("\r\n ");
}

export interface CalendarEvent {
  uid: string;
  start: Date;
  end: Date;
  title: string;
  description?: string;
  location?: string;
  url?: string;
  /** Defaults to now; injectable for deterministic tests. */
  stamp?: Date;
  organizerName?: string;
}

export function buildIcs(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeText(event.organizerName ?? "Booking")}//Booking//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${formatIcsDate(event.stamp ?? new Date())}`,
    `DTSTART:${formatIcsDate(event.start)}`,
    `DTEND:${formatIcsDate(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeText(event.description)}` : null,
    event.location ? `LOCATION:${escapeText(event.location)}` : null,
    event.url ? `URL:${event.url}` : null,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "TRIGGER:-PT12H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function icsDataUrl(ics: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

/** Google Calendar "add event" link as a secondary option to the .ics file. */
export function googleCalendarUrl(
  event: Omit<CalendarEvent, "uid" | "stamp" | "organizerName">,
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatIcsDate(event.start)}/${formatIcsDate(event.end)}`,
  });
  if (event.description) params.set("details", event.description);
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
