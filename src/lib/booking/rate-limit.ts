/**
 * In-memory token-bucket rate limiter for the booking Server Action.
 *
 * Each key (an IP or an email address) gets `capacity` tokens that refill evenly
 * over `windowMs`. State lives in the server process, so limits are per instance:
 * enough to stop one client hammering a single server; use a shared store (Redis,
 * Upstash) if the site runs on many instances.
 */

export interface RateLimitOptions {
  /** Requests allowed in a burst (and per window once drained). */
  capacity: number;
  /** Time for an empty bucket to refill completely. */
  windowMs: number;
  /** Upper bound on tracked keys; idle (full) buckets are pruned first. */
  maxKeys?: number;
  /** Injectable clock for tests. */
  now?: () => number;
}

interface Bucket {
  tokens: number;
  updatedAt: number;
}

export interface RateLimiter {
  /** True when `key` has a token available. Does not consume. */
  check(key: string): boolean;
  /** Consumes a token for `key`. Returns false (and consumes nothing) when empty. */
  take(key: string): boolean;
  /** Forget all keys (tests). */
  reset(): void;
}

export function createRateLimiter({
  capacity,
  windowMs,
  maxKeys = 10_000,
  now = () => Date.now(),
}: RateLimitOptions): RateLimiter {
  const buckets = new Map<string, Bucket>();
  const refillPerMs = capacity / windowMs;

  function current(key: string): Bucket {
    const time = now();
    const bucket = buckets.get(key);
    if (!bucket) return { tokens: capacity, updatedAt: time };
    const tokens = Math.min(capacity, bucket.tokens + (time - bucket.updatedAt) * refillPerMs);
    return { tokens, updatedAt: time };
  }

  function prune() {
    if (buckets.size < maxKeys) return;
    for (const [key] of buckets) {
      if (current(key).tokens >= capacity) buckets.delete(key);
    }
    // Still full of active keys: drop the oldest entries (Map keeps insertion order).
    for (const [key] of buckets) {
      if (buckets.size < maxKeys) break;
      buckets.delete(key);
    }
  }

  return {
    check(key) {
      return current(key).tokens >= 1;
    },
    take(key) {
      const bucket = current(key);
      if (bucket.tokens < 1) {
        buckets.set(key, bucket);
        return false;
      }
      if (!buckets.has(key)) prune();
      buckets.delete(key); // re-insert so insertion order tracks recent use
      buckets.set(key, { tokens: bucket.tokens - 1, updatedAt: bucket.updatedAt });
      return true;
    },
    reset() {
      buckets.clear();
    },
  };
}

/** Bookings per email address: 3 per hour. */
export const bookingEmailLimiter = createRateLimiter({ capacity: 3, windowMs: 60 * 60_000 });
/** Bookings per client IP: 5 per 10 minutes. */
export const bookingIpLimiter = createRateLimiter({ capacity: 5, windowMs: 10 * 60_000 });

/** Shared bucket for requests whose IP can't be determined. */
export const UNKNOWN_IP = "unknown";

/** Client IP from proxy headers: first x-forwarded-for entry, then x-real-ip. */
export function clientIpFrom(headers: Pick<Headers, "get">): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  const real = headers.get("x-real-ip")?.trim();
  return real || UNKNOWN_IP;
}

/**
 * Checks both limits and consumes a token from each only when both allow it, so a
 * request rejected by one limit doesn't drain the other.
 */
export function takeBookingSlot(ip: string, email: string): boolean {
  const emailKey = email.trim().toLowerCase();
  if (!bookingIpLimiter.check(ip) || !bookingEmailLimiter.check(emailKey)) return false;
  bookingIpLimiter.take(ip);
  bookingEmailLimiter.take(emailKey);
  return true;
}
