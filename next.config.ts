import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
/** GA4 is optional (see src/components/analytics.tsx); its domains are allowed only when configured. */
const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA_ID);
const ga = (...sources: string[]) => (gaEnabled ? sources : []);

/**
 * Content Security Policy, set statically (no nonces) so every page stays prerendered.
 *
 * Trade-offs, documented on purpose:
 * - script-src 'unsafe-inline': Next.js inlines hydration/RSC payload scripts, and the
 *   alternative (per-request nonces via proxy.ts) forces dynamic rendering on every page,
 *   which costs us static HTML and CDN caching. The site renders no user-generated HTML,
 *   and JSON-LD is escaped, so the residual XSS surface is small. Revisit with nonces or
 *   SRI if the site ever accepts and displays user content.
 * - 'unsafe-eval' is added in development only (React uses eval for debug stack traces).
 * - style-src 'unsafe-inline': Tailwind and `motion` write inline style attributes.
 * - frame-src allows Google Maps embeds (contact page). Vercel's preview toolbar
 *   (vercel.live) is not allowed; add it to script-src/frame-src if you want it on previews.
 * - upgrade-insecure-requests is omitted so `pnpm start` over http://localhost (e2e) works;
 *   HTTPS is enforced by HSTS and the host instead.
 */
const csp = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    ...ga("https://www.googletagmanager.com"),
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    ...ga("https://www.googletagmanager.com", "https://*.google-analytics.com"),
  ],
  "font-src": ["'self'", "data:"],
  "connect-src": [
    "'self'",
    ...ga(
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://www.googletagmanager.com",
    ),
  ],
  "media-src": ["'self'"],
  "frame-src": ["'self'", "https://www.google.com", "https://maps.google.com"],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
} satisfies Record<string, string[]>;

const contentSecurityPolicy = Object.entries(csp)
  .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Ignored by browsers over plain http (localhost), enforced on the production domain.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves listed quality values; 75 is the default `quality`.
    qualities: [60, 75, 85, 90],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
