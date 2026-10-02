import { Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "./reveal";

const { founder } = siteConfig;

/** Plain, verifiable facts about the business. No counters, ratings or invented numbers. */
const facts = [
  {
    value: String(siteConfig.founded),
    label: "Founded",
    detail: `By ${founder.name}, "${founder.nickname}"`,
  },
  {
    value: String(founder.startedAtAge),
    label: `Age ${founder.name} started`,
    detail: "Owner-operated from day one",
  },
  { value: "100%", label: "Mobile", detail: `Anywhere in the ${siteConfig.region}` },
  { value: "1", label: "Detailer on every car", detail: `${founder.name}, every time` },
];

export function StatsBar() {
  return (
    <section
      id="home-facts"
      aria-label={`${siteConfig.name} at a glance`}
      className="relative scroll-mt-20 border-y border-border bg-bg-elevated"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/50 to-transparent"
      />
      <Container>
        <RevealGroup as="ul" className="grid grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <RevealItem
              as="li"
              key={fact.label}
              className={cn(
                "flex flex-col px-2 py-9 sm:px-6 sm:py-12 lg:px-8",
                i % 2 === 1 && "border-l border-border",
                i >= 2 && "border-t border-border lg:border-t-0",
                i === 2 && "lg:border-l",
              )}
            >
              <span className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {fact.value}
              </span>
              <span className="mt-3 font-display text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
                {fact.label}
              </span>
              <span className="mt-1 text-sm text-ink-subtle">{fact.detail}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
