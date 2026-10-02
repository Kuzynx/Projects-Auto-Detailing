import { describe, expect, it } from "vitest";
import { addOnMinutes } from "@/data/services";
import { joinUrl } from "@/lib/utils";

describe("addOnMinutes", () => {
  // Regression: the parser takes the first integer and ignores the unit, so "+1 hr" counts as
  // 1 minute and "+1.5 hrs" as 1 minute. Latent today (addOns is empty) but any hour-long add-on
  // would under-report the sidebar time and the booking slot length.
  it("understands hour durations", () => {
    expect(addOnMinutes({ duration: "+45 min" })).toBe(45);
    expect(addOnMinutes({ duration: "+1 hr" })).toBe(60);
    expect(addOnMinutes({ duration: "+1.5 hrs" })).toBe(90);
  });
});

describe("joinUrl", () => {
  // Regression: a protocol-relative path ("//host/x") with a root base is resolved by
  // `new URL("//host/x", origin)` as a different host, so the result leaves the site origin.
  it("never leaves the base origin for a path starting with //", () => {
    expect(new URL(joinUrl("https://example.com", "//evil.example/x")).origin).toBe(
      "https://example.com",
    );
  });
});
