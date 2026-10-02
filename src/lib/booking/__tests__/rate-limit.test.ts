import { describe, expect, it } from "vitest";
import { clientIpFrom, createRateLimiter, UNKNOWN_IP } from "../rate-limit";

function clock(start = 0) {
  let time = start;
  return { now: () => time, advance: (ms: number) => (time += ms) };
}

describe("createRateLimiter", () => {
  it("allows a burst up to capacity, then refuses", () => {
    const c = clock();
    const limiter = createRateLimiter({ capacity: 3, windowMs: 60_000, now: c.now });
    expect([limiter.take("a"), limiter.take("a"), limiter.take("a")]).toEqual([true, true, true]);
    expect(limiter.take("a")).toBe(false);
    expect(limiter.check("a")).toBe(false);
  });

  it("keeps keys independent", () => {
    const limiter = createRateLimiter({ capacity: 1, windowMs: 60_000, now: clock().now });
    expect(limiter.take("a")).toBe(true);
    expect(limiter.take("b")).toBe(true);
    expect(limiter.take("a")).toBe(false);
  });

  it("refills evenly over the window", () => {
    const c = clock();
    const limiter = createRateLimiter({ capacity: 3, windowMs: 60_000, now: c.now });
    for (let i = 0; i < 3; i++) limiter.take("a");
    c.advance(19_999);
    expect(limiter.take("a")).toBe(false);
    c.advance(1);
    expect(limiter.take("a")).toBe(true); // one token per 20 s
    c.advance(10 * 60_000);
    expect([limiter.take("a"), limiter.take("a"), limiter.take("a")]).toEqual([true, true, true]);
    expect(limiter.take("a")).toBe(false); // never above capacity
  });

  it("check() does not consume", () => {
    const limiter = createRateLimiter({ capacity: 1, windowMs: 60_000, now: clock().now });
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(true);
    expect(limiter.take("a")).toBe(true);
  });

  it("bounds memory by pruning idle keys first", () => {
    const c = clock();
    const limiter = createRateLimiter({ capacity: 1, windowMs: 1000, maxKeys: 3, now: c.now });
    limiter.take("a");
    limiter.take("b");
    limiter.take("c");
    c.advance(1000); // a, b, c are full again (idle)
    limiter.take("d");
    expect(limiter.take("e")).toBe(true);
    // An exhausted, recently used key is kept.
    expect(limiter.take("e")).toBe(false);
  });
});

describe("clientIpFrom", () => {
  it("uses the first x-forwarded-for entry, then x-real-ip, then a shared bucket", () => {
    expect(clientIpFrom(new Headers({ "x-forwarded-for": " 203.0.113.7 , 10.0.0.1" }))).toBe(
      "203.0.113.7",
    );
    expect(clientIpFrom(new Headers({ "x-real-ip": "192.0.2.44" }))).toBe("192.0.2.44");
    expect(clientIpFrom(new Headers())).toBe(UNKNOWN_IP);
  });
});
