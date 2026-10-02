import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { bookingHref, siteConfig } from "@/config/site";
import { Reveal } from "./reveal";

const { founder } = siteConfig;

/** The founder, in his own (client-supplied) words. Every fact here comes from `siteConfig.founder`. */
export function MeetKevin() {
  const facts = [
    { label: "Detailing since", value: String(founder.since) },
    { label: "Started at", value: String(founder.startedAtAge) },
    { label: "Detailer on your car", value: founder.name },
  ];

  return (
    <Section aria-labelledby="founder-title" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/2 -left-48 size-[34rem] -translate-y-1/2 rounded-full bg-brand-700/10 blur-[150px]"
      />
      <Container className="relative grid items-center gap-12 md:grid-cols-12 lg:gap-16">
        <Reveal className="md:col-span-5 lg:col-span-4">
          <figure className="relative mx-auto max-w-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border shadow-card">
              <Image
                src={founder.photo}
                alt={`${founder.name}, known as ${founder.nickname}, founder of ${siteConfig.name}`}
                fill
                sizes="(min-width: 1024px) 384px, (min-width: 768px) 40vw, 100vw"
                className="object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent"
              />
            </div>
            <figcaption className="absolute -bottom-4 left-4 rounded-full border border-brand-500/40 bg-bg/90 px-4 py-2 font-display text-sm font-semibold text-ink backdrop-blur-md">
              {founder.name}{" "}
              <span className="text-brand-300">&ldquo;{founder.nickname}&rdquo;</span>
              <span className="text-ink-subtle"> · {founder.title}</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-7 lg:col-span-8">
          <SectionHeading
            eyebrow="Meet the detailer"
            title={
              <span id="founder-title">
                One owner. <span className="text-gradient-brand">Every car.</span>
              </span>
            }
            description={founder.bio}
          />

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-surface p-4 sm:p-5">
                <dt className="text-xs text-ink-subtle">{fact.label}</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={bookingHref} className="group">
              Book with {founder.name}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink href="/about" variant="ghost">
              More about {founder.name}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
