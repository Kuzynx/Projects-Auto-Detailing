import { ArrowRight } from "lucide-react";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { bookingHref } from "@/config/site";
import { processSteps } from "@/data/process";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

export function Process() {
  return (
    <Section aria-labelledby="process-title">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title={
              <span id="process-title">
                Booked in a minute.{" "}
                <span className="text-gradient-brand">Done right the first time.</span>
              </span>
            }
            description="Five steps, the same on every car. You always know what happens next and who is doing it."
          />
        </Reveal>

        <RevealGroup
          as="ol"
          stagger={0.12}
          className="relative mt-14 grid gap-10 sm:mt-20 lg:grid-cols-5 lg:gap-6"
        >
          {/* Connecting line: vertical on mobile, horizontal through the numbers on desktop. */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-7 w-px bg-linear-to-b from-brand-500/60 via-border-strong to-transparent lg:top-7 lg:right-[10%] lg:bottom-auto lg:left-[10%] lg:h-px lg:w-auto lg:bg-linear-to-r"
          />
          {processSteps.map((step) => (
            <RevealItem
              as="li"
              key={step.step}
              className="relative flex gap-6 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
            >
              <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-brand-500/40 bg-bg font-display text-lg font-semibold text-brand-300 shadow-[0_0_0_6px_var(--color-bg)]">
                <span
                  className="absolute inset-1 rounded-full bg-linear-to-b from-brand-500/15 to-transparent"
                  aria-hidden="true"
                />
                <span className="relative">{String(step.step).padStart(2, "0")}</span>
              </span>
              <div className="pt-2 lg:mt-6 lg:max-w-[14rem] lg:pt-0">
                <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-ink-muted">
                  {step.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 flex justify-center sm:mt-16">
          <ButtonLink href={bookingHref} variant="outline" size="lg" className="group">
            Start step one
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}
