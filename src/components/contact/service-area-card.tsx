import { Clock, MapPin, Truck } from "lucide-react";
import { Badge } from "@/components/ui";
import { siteConfig } from "@/config/site";

/**
 * "We come to you" card. The business is mobile only, so instead of an address
 * we show where we work and when. The street grid is an abstract,
 * decorative SVG: no third-party iframe, tracking or API key.
 */
export function ServiceAreaCard() {
  return (
    <section
      id="service-area"
      aria-labelledby="service-area-heading"
      className="relative grid overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-card lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      <div className="relative order-2 p-6 sm:p-8 lg:order-1 lg:p-10">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
          Service area
        </p>
        <h2 id="service-area-heading" className="mt-2 text-2xl font-semibold sm:text-3xl">
          We come to you
        </h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-ink">
          <MapPin className="size-4 text-brand-400" aria-hidden />
          Based in {siteConfig.address.city}, {siteConfig.address.state}
        </p>
        <p className="mt-3 text-pretty text-ink-muted">
          Fully mobile across the {siteConfig.region}. Every package is done wherever your car is
          parked, and we bring our own water and power.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Towns we serve">
          {siteConfig.serviceArea.map((area) => (
            <li key={area}>
              <Badge tone="neutral" className="text-xs font-medium tracking-normal normal-case">
                {area}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-center gap-2 text-xs text-ink-subtle">
          <Truck className="size-3.5" aria-hidden />
          Just outside the list? Ask anyway. We often can for larger jobs.
        </p>

        <div className="mt-8 border-t border-border pt-6">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
            <Clock className="size-4 text-brand-400" aria-hidden />
            Hours
          </h3>
          <table className="mt-3 w-full text-sm">
            <caption className="sr-only">Appointment and phone hours</caption>
            <tbody className="divide-y divide-border">
              {siteConfig.hours.map((row) => {
                const closed = row.open.toLowerCase() === "closed";
                return (
                  <tr key={row.days}>
                    <th scope="row" className="py-2 pr-4 text-left font-normal text-ink-muted">
                      {row.days}
                    </th>
                    <td
                      className={
                        closed
                          ? "py-2 text-right text-ink-subtle"
                          : "py-2 text-right font-medium text-ink tabular-nums"
                      }
                    >
                      {closed ? "Closed" : `${row.open} – ${row.close}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-ink-subtle">
            Early starts in summer to beat the desert heat. Messages sent after hours are answered
            first thing the next business morning.
          </p>
        </div>
      </div>

      <div className="relative order-1 h-56 sm:h-72 lg:order-2 lg:h-auto lg:min-h-[28rem]">
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

          {/* Main route */}
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

          {/* Service radius */}
          <circle
            cx="600"
            cy="245"
            r="205"
            fill="none"
            stroke="var(--color-brand-400)"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeDasharray="4 10"
          />

          {/* Home base */}
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
    </section>
  );
}
