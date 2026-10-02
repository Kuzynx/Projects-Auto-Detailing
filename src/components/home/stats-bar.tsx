import { Star } from "lucide-react";
import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { CountUp } from "./count-up";
import { RevealGroup, RevealItem } from "./reveal";

const { vehiclesDetailed, yearsInBusiness, googleRating, reviewCount } = siteConfig.stats;

const stats = [
  {
    value: vehiclesDetailed,
    suffix: "+",
    label: "Vehicles detailed",
    detail: "Daily drivers to supercars",
  },
  {
    value: yearsInBusiness,
    suffix: "",
    label: `Years in ${siteConfig.address.city}`,
    detail: `Detailing since ${siteConfig.founded}`,
  },
  {
    value: googleRating,
    decimals: 1,
    suffix: "",
    label: "Google rating",
    detail: "Average across every review",
    star: true,
  },
  {
    value: reviewCount,
    suffix: "",
    label: "Owner reviews",
    detail: `Written by ${siteConfig.region} drivers`,
  },
];

export function StatsBar() {
  return (
    <section
      id="home-stats"
      aria-label="By the numbers"
      className="relative scroll-mt-20 border-y border-border bg-bg-elevated"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/50 to-transparent"
      />
      <Container>
        <RevealGroup as="ul" className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <RevealItem
              as="li"
              key={stat.label}
              className={[
                "flex flex-col px-2 py-9 sm:px-6 sm:py-12 lg:px-8",
                i % 2 === 1 ? "border-l border-border" : "",
                i >= 2 ? "border-t border-border lg:border-t-0" : "",
                i === 2 ? "lg:border-l" : "",
              ].join(" ")}
            >
              <span className="flex items-baseline gap-1 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                {stat.star && (
                  <Star
                    aria-hidden="true"
                    className="size-6 self-center fill-amber-400 text-amber-400 sm:size-8"
                    strokeWidth={1.5}
                  />
                )}
              </span>
              <span className="mt-3 font-display text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
                {stat.label}
              </span>
              <span className="mt-1 text-sm text-ink-subtle">{stat.detail}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
