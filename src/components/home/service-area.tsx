import Image from "next/image";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { Reveal } from "./reveal";
import styles from "./home.module.css";

/**
 * Approximate city centers, used only to place dots on the stylized radar.
 * Names come from `siteConfig.serviceArea`; any city missing here still shows as a chip.
 */
const cityCoords: Record<string, { lat: number; lng: number }> = {
  "Round Rock": { lat: 30.508, lng: -97.679 },
  "Cedar Park": { lat: 30.505, lng: -97.82 },
  Pflugerville: { lat: 30.439, lng: -97.62 },
  Lakeway: { lat: 30.364, lng: -97.976 },
  "Bee Cave": { lat: 30.308, lng: -97.945 },
  Buda: { lat: 30.085, lng: -97.84 },
  Kyle: { lat: 29.989, lng: -97.877 },
  Georgetown: { lat: 30.633, lng: -97.677 },
  Leander: { lat: 30.579, lng: -97.853 },
};

const SIZE = 400;
const CENTER = SIZE / 2;
/** SVG units per kilometre: keeps the farthest city (about 45 km) inside the outer ring. */
const SCALE = 3.9;
const KM_PER_MILE = 1.609;
const RINGS_MILES = [10, 20, 30];

function project(lat: number, lng: number) {
  const { lat: lat0, lng: lng0 } = siteConfig.geo;
  const kmX = (lng - lng0) * 111.32 * Math.cos((lat0 * Math.PI) / 180);
  const kmY = (lat - lat0) * 110.57;
  return { x: CENTER + kmX * SCALE, y: CENTER - kmY * SCALE };
}

function RadarMap() {
  const cities = siteConfig.serviceArea
    .filter((name) => name in cityCoords)
    .map((name) => ({ name, ...project(cityCoords[name].lat, cityCoords[name].lng) }));

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-labelledby="radar-title"
      className="h-auto w-full"
    >
      <title id="radar-title">{`Stylized map of our mobile service radius around the ${siteConfig.address.city} studio`}</title>
      <defs>
        <radialGradient id="radar-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.18" />
          <stop offset="70%" stopColor="var(--color-brand-500)" stopOpacity="0.04" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-brand-400)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={CENTER - 4} fill="url(#radar-fade)" />

      {/* Crosshairs. */}
      <g stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="2 6">
        <line x1={CENTER} y1="8" x2={CENTER} y2={SIZE - 8} />
        <line x1="8" y1={CENTER} x2={SIZE - 8} y2={CENTER} />
      </g>

      {/* Distance rings, labelled along the south axis where no cities sit. */}
      {RINGS_MILES.map((miles, i) => {
        const r = miles * KM_PER_MILE * SCALE;
        return (
          <g key={miles}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke={
                i === RINGS_MILES.length - 1
                  ? "var(--color-brand-500)"
                  : "var(--color-border-strong)"
              }
              strokeOpacity={i === RINGS_MILES.length - 1 ? 0.45 : 1}
              strokeWidth="1"
            />
            <text
              x={CENTER + 6}
              y={CENTER + r - 6}
              fill="var(--color-ink-subtle)"
              fontSize="10"
              letterSpacing="1.5"
              className="font-display"
            >
              {miles} MI
            </text>
          </g>
        );
      })}

      {/* Rotating sweep. */}
      <g className={styles.sweep}>
        <path
          d={`M ${CENTER} ${CENTER} L ${SIZE - 8} ${CENTER} A ${CENTER - 8} ${CENTER - 8} 0 0 0 ${CENTER + (CENTER - 8) * Math.cos(Math.PI / 5)} ${CENTER - (CENTER - 8) * Math.sin(Math.PI / 5)} Z`}
          fill="url(#radar-sweep)"
        />
      </g>

      {/* Cities. */}
      {cities.map((city) => {
        const right = city.x >= CENTER;
        return (
          <g key={city.name}>
            <circle cx={city.x} cy={city.y} r="3" fill="var(--color-ink)" />
            <circle
              cx={city.x}
              cy={city.y}
              r="7"
              fill="none"
              stroke="var(--color-ink-subtle)"
              strokeOpacity="0.6"
            />
            <text
              x={city.x + (right ? 11 : -11)}
              y={city.y + 4}
              textAnchor={right ? "start" : "end"}
              fill="var(--color-ink-muted)"
              fontSize="11"
              className="font-sans"
            >
              {city.name}
            </text>
          </g>
        );
      })}

      {/* Studio pin. */}
      <g>
        <circle
          cx={CENTER}
          cy={CENTER}
          r="10"
          fill="var(--color-brand-500)"
          fillOpacity="0.5"
          className={styles.ping}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="9"
          fill="var(--color-bg)"
          stroke="var(--color-brand-400)"
          strokeWidth="2"
        />
        <circle cx={CENTER} cy={CENTER} r="4" fill="var(--color-brand-400)" />
        <text
          x={CENTER}
          y={CENTER + 28}
          textAnchor="middle"
          fill="var(--color-brand-300)"
          fontSize="11"
          fontWeight="600"
          letterSpacing="1.5"
          className="font-display"
        >
          STUDIO
        </text>
      </g>
    </svg>
  );
}

export function ServiceArea() {
  const { address } = siteConfig;
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.name}, ${fullAddress}`)}`;

  return (
    <Section tone="elevated" aria-labelledby="area-title" className="overflow-hidden">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5 lg:self-center">
          <SectionHeading
            eyebrow="Service area"
            title={
              <span id="area-title">
                Mobile detailing across{" "}
                <span className="text-gradient-brand">greater {address.city}.</span>
              </span>
            }
            description="We work in your driveway, your office garage or your apartment lot. Our mobile unit carries its own water, power and lighting, so all we need is the car and a little room to walk around it."
          />

          <h3 className="mt-10 font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase">
            Where we come to you
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {siteConfig.serviceArea.map((city) => (
              <li
                key={city}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-white/[0.03] px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-brand-500/60"
              >
                <MapPin className="size-3.5 text-brand-400" aria-hidden="true" />
                {city}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-muted">
            Outside the list? Call{" "}
            <a
              href={siteConfig.phoneHref}
              className="font-semibold text-ink underline decoration-brand-500/60 underline-offset-4 hover:text-brand-300"
            >
              {siteConfig.phone}
            </a>{" "}
            and we will tell you honestly whether we can make it work.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          <Reveal delay={0.1}>
            <figure className="relative h-full min-h-[26rem] overflow-hidden rounded-lg border border-border">
              <Image
                src="/images/work/shelby-gt350-rinse.jpg"
                alt="Freshly rinsed red Shelby GT350 in a homeowner's driveway in front of the garage"
                fill
                sizes="(min-width: 1280px) 400px, (min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-[50%_60%]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-bg/90 via-transparent to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
                  On location
                </p>
                <p className="mt-1 text-sm text-ink">
                  Mobile wash, in the customer&apos;s own driveway.
                </p>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.2} className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-bg/60 p-4">
              <RadarMap />
            </div>
            <address className="flex flex-1 flex-col gap-4 rounded-lg border border-border bg-surface p-5 not-italic">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-display font-semibold text-ink">
                    Studio, South {address.city}
                  </p>
                  <p className="mt-0.5 text-ink-muted">
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-2 inline-flex items-center gap-1 font-display text-sm font-semibold text-brand-300 hover:text-ink"
                  >
                    Get directions
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">(opens Google Maps in a new tab)</span>
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  {siteConfig.hours.map((h) => (
                    <div key={h.days} className="contents">
                      <dt className="text-ink-muted">{h.days}</dt>
                      <dd className="text-right text-ink">
                        {h.close ? `${h.open} – ${h.close}` : h.open}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <a
                  href={siteConfig.phoneHref}
                  className="text-sm font-semibold text-ink hover:text-brand-300"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </address>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
