import { describe, expect, it } from "vitest";
import { buildIcs, formatIcsDate, googleCalendarUrl, icsDataUrl, zonedDateTimeToUtc } from "../ics";

describe("zonedDateTimeToUtc", () => {
  it("converts Pacific daylight time (UTC-7)", () => {
    expect(zonedDateTimeToUtc("2026-10-10", "09:00").toISOString()).toBe(
      "2026-10-10T16:00:00.000Z",
    );
  });

  it("converts Pacific standard time (UTC-8)", () => {
    expect(zonedDateTimeToUtc("2026-12-05", "09:00").toISOString()).toBe(
      "2026-12-05T17:00:00.000Z",
    );
  });

  it("handles the day after the DST change", () => {
    expect(zonedDateTimeToUtc("2026-11-02", "07:00").toISOString()).toBe(
      "2026-11-02T15:00:00.000Z",
    );
  });
});

describe("buildIcs", () => {
  const start = new Date("2026-10-10T14:00:00Z");
  const end = new Date("2026-10-10T19:00:00Z");
  const ics = buildIcs({
    uid: "PAD-7F3K2Q@example.com",
    start,
    end,
    stamp: new Date("2026-10-07T15:00:00Z"),
    title: "The Full Detail, mobile",
    description: "Reference: PAD-7F3K2Q\nQuestions; call us",
    location: "123 Main St, Hesperia, CA 92345",
    organizerName: "Test Detailing",
  });
  const lines = ics.split("\r\n");

  it("produces a valid VEVENT with UTC times", () => {
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines).toContain("DTSTART:20261010T140000Z");
    expect(lines).toContain("DTEND:20261010T190000Z");
    expect(lines).toContain("DTSTAMP:20261007T150000Z");
    expect(lines).toContain("UID:PAD-7F3K2Q@example.com");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("escapes commas, semicolons and newlines", () => {
    expect(lines).toContain("SUMMARY:The Full Detail\\, mobile");
    expect(ics).toContain("DESCRIPTION:Reference: PAD-7F3K2Q\\nQuestions\\; call us");
  });

  it("folds long lines to 75 octets", () => {
    const long = buildIcs({ uid: "x", start, end, title: "A".repeat(200) });
    for (const line of long.split("\r\n"))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect(long).toContain("\r\n A");
  });

  it("encodes as a data URL", () => {
    expect(icsDataUrl("BEGIN:VCALENDAR")).toBe(
      "data:text/calendar;charset=utf-8,BEGIN%3AVCALENDAR",
    );
  });
});

describe("calendar links", () => {
  it("formats compact UTC timestamps", () => {
    expect(formatIcsDate(new Date("2026-10-10T14:05:09.123Z"))).toBe("20261010T140509Z");
  });

  it("builds a Google Calendar template link", () => {
    const url = new URL(
      googleCalendarUrl({
        start: new Date("2026-10-10T14:00:00Z"),
        end: new Date("2026-10-10T15:00:00Z"),
        title: "Detail",
      }),
    );
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("dates")).toBe("20261010T140000Z/20261010T150000Z");
  });
});
