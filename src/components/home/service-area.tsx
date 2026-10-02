import Image from "next/image";
import { Check, Clock, MapPin, Phone } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { Reveal } from "./reveal";
import styles from "./home.module.css";

type LabelSide = "left" | "right" | "above" | "below";

/**
 * Approximate town centers, used only to place dots on the stylized radar around
 * `siteConfig.geo` (the home-base town, drawn as the pin). Names come from
 * `siteConfig.serviceArea`; any town missing here still shows as a chip. `label` overrides
 * the default left/right placement where neighbours or the edge of the map would collide.
 */
const townCoords: Record<string, { lat: number; lng: number; label?: LabelSide }> = {
  Adelanto: { lat: 34.5828, lng: -117.4092 },
  Helendale: { lat: 34.7436, lng: -117.3248, label: "right" },
  "Apple Valley": { lat: 34.5008, lng: -117.1859, label: "right" },
  "Spring Valley Lake": { lat: 34.4936, lng: -117.2689, label: "below" },
  Hesperia: { lat: 34.4264, lng: -117.3009, label: "right" },
  "Oak Hills": { lat: 34.3836, lng: -117.3803 },
  Phelan: { lat: 34.4261, lng: -117.5723, label: "above" },
  "Pinon Hills": { lat: 34.4333, lng: -117.6467, label: "below" },
  "Lucerne Valley": { lat: 34.4439, lng: -116.9675, label: "below" },
};

const SIZE = 400;
const CENTER = SIZE / 2;
/** SVG units per kilometre: keeps the farthest town (about 34 km out) inside the outer ring. */
const SCALE = 4.6;
const KM_PER_MILE = 1.609;
const RINGS_MILES = [10, 20, 25];

function project(lat: number, lng: number) {
  const { lat: lat0, lng: lng0 } = siteConfig.geo;
  const kmX = (lng - lng0) * 111.32 * Math.cos((lat0 * Math.PI) / 180);
  const kmY = (lat - lat0) * 110.57;
  return { x: CENTER + kmX * SCALE, y: CENTER - kmY * SCALE };
}

function labelPosition(x: number, y: number, side: LabelSide) {
  switch (side) {
    case "left":
      return { x: x - 11, y: y + 4, anchor: "end" as const };
    case "right":
      return { x: x + 11, y: y + 4, anchor: "start" as const };
    case "above":
      return { x, y: y - 12, anchor: "middle" as const };
    case "below":
      return { x, y: y + 20, anchor: "middle" as const };
  }
}

function RadarMap() {
  const cities = siteConfig.serviceArea
    .filter((name) => name in townCoords)
    .map((name) => {
      const town = townCoords[name];
      const point = project(town.lat, town.lng);
      const side = town.label ?? (point.x >= CENTER ? "right" : "left");
      return { name, ...point, label: labelPosition(point.x, point.y, side) };
    });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-labelledby="radar-title"
      className="h-auto w-full"
    >
      <title id="radar-title">{`Stylized map of the towns we cover around ${siteConfig.address.city}, across the ${siteConfig.region}`}</title>
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

      {/* Distance rings, labelled on the north-east diagonal where no towns sit. */}
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
              x={CENTER + r * Math.SQRT1_2 + 4}
              y={CENTER - r * Math.SQRT1_2 - 4}
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
              x={city.label.x}
              y={city.label.y}
              textAnchor={city.label.anchor}
              fill="var(--color-ink-muted)"
              fontSize="11"
              className="font-sans"
            >
              {city.name}
            </text>
          </g>
        );
      })}

      {/* Home-base pin. */}
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
          y={CENTER - 18}
          textAnchor="middle"
          fill="var(--color-brand-300)"
          fontSize="10"
          fontWeight="600"
          letterSpacing="1"
          className="font-display"
        >
          {siteConfig.address.city.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}

export function ServiceArea() {
  const { address, region } = siteConfig;

  return (
    <Section tone="elevated" aria-labelledby="area-title" className="overflow-hidden">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5 lg:self-center">
          <SectionHeading
            eyebrow="Service area"
            title={
              <span id="area-title">
                Mobile detailing across <span className="text-gradient-brand">the {region}.</span>
              </span>
            }
            description="We work in your driveway, your garage or your office lot. All we need from you is an outdoor spigot, a standard outlet and a little room around the vehicle. We bring the rest."
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
          {siteConfig.customerProvides.length > 0 && (
            <>
              <h3 className="mt-10 font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase">
                What you provide
              </h3>
              <ul className="mt-4 space-y-2.5">
                {siteConfig.customerProvides.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-6 text-sm text-ink-muted">
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
                    Based in {address.city}, serving the {region}
                  </p>
                  <p className="mt-0.5 text-ink-muted">
                    Fully mobile. Just a spigot, an outlet and a little room around the car.
                  </p>
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
