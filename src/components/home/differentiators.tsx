import {
  BadgeCheck,
  FileCheck,
  Gauge,
  Handshake,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card, Container, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { differentiators } from "@/data/process";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

/** Icons keyed by differentiator title; anything new falls back to a neutral mark. */
const icons: Record<string, LucideIcon> = {
  "Certified technicians": BadgeCheck,
  "Paint-depth measured": Gauge,
  "Written warranty": FileCheck,
  "Fully insured": ShieldCheck,
  "Transparent pricing": ReceiptText,
  "Satisfaction guaranteed": Handshake,
};

export function Differentiators() {
  return (
    <Section tone="elevated" aria-labelledby="why-title" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_bottom,black,transparent_65%)] opacity-60"
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow={`Why ${siteConfig.shortName}`}
            title={
              <span id="why-title">
                The details behind <span className="text-gradient-brand">the detail.</span>
              </span>
            }
            description="Anyone can make a car shine for a week. These are the standards that make it last, and the promises we put in writing."
          />
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.08}
          className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {differentiators.map((item) => {
            const Icon = icons[item.title] ?? Sparkles;
            return (
              <RevealItem as="li" key={item.title} className="h-full">
                <Card className="group relative h-full overflow-hidden p-7 hover:bg-surface-hover">
                  <div
                    aria-hidden="true"
                    className="absolute -top-16 -right-16 size-40 rounded-full bg-brand-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="relative grid size-12 place-items-center rounded-md border border-brand-500/30 bg-linear-to-b from-brand-500/15 to-brand-500/0 text-brand-300">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-6 text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                    {item.description}
                  </p>
                </Card>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
