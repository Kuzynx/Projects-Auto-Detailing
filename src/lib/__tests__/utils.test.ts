import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, cn, formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("drops cents for whole dollar amounts", () => {
    expect(formatPrice(89)).toBe("$89");
    expect(formatPrice(0)).toBe("$0");
  });

  it("adds thousands separators", () => {
    expect(formatPrice(1199)).toBe("$1,199");
    expect(formatPrice(12500)).toBe("$12,500");
  });

  it("keeps two decimals for fractional amounts", () => {
    expect(formatPrice(49.5)).toBe("$49.50");
    expect(formatPrice(19.99)).toBe("$19.99");
  });
});

describe("absoluteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("joins paths onto NEXT_PUBLIC_SITE_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(absoluteUrl("/services/ceramic-coating")).toBe(
      "https://example.com/services/ceramic-coating",
    );
  });

  it("defaults to the site root", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(absoluteUrl()).toBe("https://example.com/");
  });

  it("does not duplicate slashes when the origin has a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    expect(absoluteUrl("/book")).toBe("https://example.com/book");
  });

  it("falls back to localhost when the env var is not set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    expect(absoluteUrl("/faq")).toBe("http://localhost:3000/faq");
  });
});

describe("cn", () => {
  it("merges conflicting Tailwind classes, last one wins", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});
