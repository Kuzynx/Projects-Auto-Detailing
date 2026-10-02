import { Navigation } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { siteConfig } from "@/config/site";

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.zip}`;
export const directionsHref = `https://maps.google.com/?q=${encodeURIComponent(`${siteConfig.name}, ${fullAddress}`)}`;

/**
 * Stylized, static "map". No third-party iframe, tracking or API key: an abstract
 * street grid drawn in SVG with the studio pinned at the center.
 */
export function MapCard() {
  return (
    <section
      aria-labelledby="studio-heading"
      className="relative overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-card"
    >
      <div className="relative h-72 sm:h-80 lg:h-96">
        <svg
          aria-hidden
          viewBox="0 0 1200 480"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
        >
          <defs>
            <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="map-vignette" cx="50%" cy="50%" r="75%">
              <stop offset="55%" stopColor="var(--color-bg-elevated)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--color-bg-elevated)" stopOpacity="1" />
            </radialGradient>
            <pattern
              id="map-blocks"
              width="64"
              height="48"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-8)"
            >
              <path d="M64 0H0V48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
            </pattern>
          </defs>

          <rect width="1200" height="480" fill="var(--color-bg-elevated)" />
          <rect width="1200" height="480" fill="url(#map-blocks)" />

          {/* Parks */}
          <rect
            x="140"
            y="300"
            width="150"
            height="110"
            rx="10"
            fill="rgba(255,255,255,0.025)"
            transform="rotate(-8 215 355)"
          />
          <rect
            x="860"
            y="70"
            width="190"
            height="90"
            rx="10"
            fill="rgba(255,255,255,0.025)"
            transform="rotate(-8 955 115)"
          />

          {/* River */}
          <path
            d="M-20 95 C 180 60, 300 150, 480 120 S 760 40, 920 92 S 1120 150, 1220 120"
            fill="none"
            stroke="rgba(150,160,190,0.14)"
            strokeWidth="26"
            strokeLinecap="round"
          />

          {/* Secondary streets */}
          <g stroke="rgba(255,255,255,0.09)" strokeWidth="5" fill="none" strokeLinecap="round">
            <path d="M0 210 L1200 170" />
            <path d="M0 330 L1200 290" />
            <path d="M0 420 L1200 385" />
            <path d="M330 0 L380 480" />
            <path d="M820 0 L870 480" />
            <path d="M1010 120 L1050 480" />
          </g>

          {/* Highway */}
          <path
            d="M120 480 C 200 360, 260 260, 300 0"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Main avenue to the studio */}
          <path
            d="M565 -10 L635 490"
            fill="none"
            stroke="var(--color-brand-500)"
            strokeOpacity="0.55"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M565 -10 L635 490"
            fill="none"
            stroke="var(--color-brand-300)"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="6 10"
          />

          {/* Pin */}
          <circle cx="600" cy="245" r="150" fill="url(#map-glow)" />
          <circle
            className="motion-reduce:hidden"
            cx="600"
            cy="245"
            r="26"
            fill="none"
            stroke="var(--color-brand-400)"
            strokeOpacity="0.5"
            strokeWidth="2"
          >
            <animate attributeName="r" values="18;46" dur="2.4s" repeatCount="indefinite" />
            <animate
              attributeName="stroke-opacity"
              values="0.6;0"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
          <g transform="translate(600 245)">
            <path
              d="M0 0 C -6 -14, -22 -24, -22 -42 A 22 22 0 1 1 22 -42 C 22 -24, 6 -14, 0 0 Z"
              fill="var(--color-brand-500)"
            />
            <circle cx="0" cy="-42" r="8" fill="var(--color-bg)" />
          </g>

          <rect width="1200" height="480" fill="url(#map-vignette)" />
        </svg>
      </div>

      <div className="relative -mt-24 px-4 pb-4 sm:absolute sm:inset-x-auto sm:bottom-6 sm:left-6 sm:mt-0 sm:max-w-sm sm:p-0">
        <div className="rounded-lg border border-border-strong bg-bg/85 p-5 backdrop-blur-md sm:p-6">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
            Studio
          </p>
          <h2 id="studio-heading" className="mt-2 text-xl font-semibold">
            {siteConfig.name}
          </h2>
          <address className="mt-2 text-sm leading-relaxed text-ink-muted not-italic">
            {siteConfig.address.street}
            <br />
            {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
          </address>
          <p className="mt-2 text-xs text-ink-subtle">
            Studio visits by appointment. Mobile service comes to you.
          </p>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary", "sm", "mt-5")}
          >
            <Navigation className="size-4" aria-hidden />
            Get directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
