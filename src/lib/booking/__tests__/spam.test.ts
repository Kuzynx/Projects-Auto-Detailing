import { describe, expect, it } from "vitest";
import { isLikelyAutomated } from "../spam";
import { MIN_FILL_TIME_MS } from "../types";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("isLikelyAutomated", () => {
  it("accepts a human fill time with an empty honeypot", () => {
    expect(isLikelyAutomated(form({ elapsedMs: "90000", company_website: "" }))).toBe(false);
  });

  it("flags a filled honeypot", () => {
    expect(isLikelyAutomated(form({ elapsedMs: "90000", company_website: "x" }))).toBe(true);
  });

  it("flags missing, malformed, non-positive or too-fast fill times", () => {
    expect(isLikelyAutomated(form({}))).toBe(true);
    expect(isLikelyAutomated(form({ elapsedMs: "" }))).toBe(true);
    expect(isLikelyAutomated(form({ elapsedMs: "soon" }))).toBe(true);
    expect(isLikelyAutomated(form({ elapsedMs: "Infinity" }))).toBe(true);
    expect(isLikelyAutomated(form({ elapsedMs: "0" }))).toBe(true);
    expect(isLikelyAutomated(form({ elapsedMs: "-5000" }))).toBe(true);
    expect(isLikelyAutomated(form({ elapsedMs: String(MIN_FILL_TIME_MS - 1) }))).toBe(true);
    expect(isLikelyAutomated(form({ elapsedMs: String(MIN_FILL_TIME_MS) }))).toBe(false);
  });

  it("ignores a legacy absolute startedAt", () => {
    expect(isLikelyAutomated(form({ startedAt: String(Date.now() - 60_000) }))).toBe(true);
  });
});
