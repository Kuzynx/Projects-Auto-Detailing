import type { Metadata } from "next";
import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBanner } from "@/components/layout/cta-banner";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from "@/components/ui";
import { Reveal } from "@/components/about/reveal";
import { InitialsAvatar } from "@/components/about/initials-avatar";
import { standards, values } from "@/components/about/content";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";
import { bookingHref, siteConfig } from "@/config/site";

const { founder } = siteConfig;

const title = "About";
const description = `${siteConfig.name} is owner-operated by ${founder.name}, known as ${founder.nickname}. Based in ${siteConfig.address.city}, detailing since ${founder.since} and fully mobile across the ${siteConfig.region}, with every car detailed by ${founder.name} personally.`;

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/about",
});

const facts = [
  { value: `${founder.since}`, label: "Detailing since" },
  { value: `${founder.startedAtAge}`, label: "Age he started" },
  { value: "100%", label: "Mobile" },
  { value: "1", label: "Owner on every job" },
];

const aboutJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteConfig.name}`,
    url: absoluteUrl("/about"),
    description,
    mainEntity: {
      "@type": "AutoWash",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      foundingDate: String(founder.since),
      founder: {
        "@type": "Person",
        name: founder.name,
        alternateName: founder.nickname,
        jobTitle: founder.title,
        image: absoluteUrl(founder.photo),
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />

      <PageHero
        eyebrow={`About ${siteConfig.name}`}
        title={`Obsessed with the details since ${founder.since}`}
        description={`An owner-operated, fully mobile detailing business in the ${siteConfig.region}. One detailer, one standard, right in your driveway.`}
        image="/images/hero-aston-sunset.jpg"
        imageAlt="Aston Martin parked beneath a concrete overpass at golden hour"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <Section aria-labelledby="story-heading">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow className="mb-4">Our story</Eyebrow>
            <h2
              id="story-heading"
              className="text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl"
            >
              It started alongside {founder.learnedFrom}.
            </h2>
            <div className="mt-6 space-y-5 text-base text-pretty text-ink-muted sm:text-lg">
              <p>
                {founder.name} got his start in {founder.origin}, detailing alongside{" "}
                {founder.learnedFrom}, and found a love for the work. After a little under a year he
                stepped away for school, then picked it back up a year and a half later because he
                missed it.
              </p>
              <p>
                He has been detailing for family and friends ever since. Now {siteConfig.name} is
                based in {siteConfig.address.city}, bringing the same care to customers across the{" "}
                {siteConfig.region}.
              </p>
              <p>
                It is still owner-operated, on purpose. Every car is detailed by {founder.name}{" "}
                personally, start to finish. No crews you have never met and no hand-offs: the
                person who looks at your car is the person who does the work.
              </p>
              <p>
                The business is fully mobile: every package is done at your home or work. Days start
                early to beat the desert heat, every wash uses the two-bucket method and pH-neutral
                soap, and every car is dried with clean microfiber only.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border shadow-card">
              <Image
                src="/images/work/shelby-gt350-two-bucket.jpg"
                alt="A Shelby GT350 mid-wash on a residential street, with separate wash and rinse buckets beside it"
                fill
                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5">
                <Badge className="bg-black/60 backdrop-blur-sm">Our work</Badge>
                <p className="text-sm text-ink">The two-bucket method, on a real client job.</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Facts */}
      <section aria-label="At a glance" className="border-y border-border bg-bg-elevated">
        <Container>
          <dl className="grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x">
            {facts.map((fact, i) => (
              <Reveal
                key={fact.label}
                delay={i * 0.06}
                className="flex flex-col-reverse px-4 py-10 text-center sm:py-12"
              >
                <dt className="mt-2 text-sm text-ink-muted">{fact.label}</dt>
                <dd className="text-gradient-brand font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  {fact.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Meet Kevin */}
      <Section aria-labelledby="founder-heading">
        <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[2rem] bg-brand-500/20 blur-2xl"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-brand-500/40 shadow-glow">
              <Image
                src={founder.photo}
                alt={`${founder.name}, known as ${founder.nickname}, founder of ${siteConfig.name}`}
                fill
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 384px"
                className="object-cover object-top"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow className="mb-4">The detailer</Eyebrow>
            <h2
              id="founder-heading"
              className="text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl"
            >
              Meet {founder.name}, aka {founder.nickname}
            </h2>
            <p className="mt-6 text-lg text-pretty text-ink-muted">{founder.bio}</p>
            <ul className="mt-8 space-y-3">
              {[
                `Learned the trade from ${founder.learnedFrom} in ${founder.origin}`,
                "Details every car himself, start to finish",
                `Fully mobile across ${siteConfig.address.city} and the ${siteConfig.region}`,
                "Walks every finished car with you before he leaves",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-ink">
                  <Check className="mt-1 size-4 shrink-0 text-brand-400" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={bookingHref}>Book with {founder.name}</ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Ask a question
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Team: real people only, from siteConfig */}
      {siteConfig.team.length > 0 && (
        <Section size="sm" aria-labelledby="team-heading" className="pt-0 sm:pt-0">
          <Container>
            <h2
              id="team-heading"
              className="font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase"
            >
              The team
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {siteConfig.team.map((member, i) => (
                <Reveal as="li" key={member.name} delay={i * 0.08}>
                  <Card className="flex h-full flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
                    {member.photo ? (
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-full border border-brand-500/40 shadow-glow">
                        <Image
                          src={member.photo}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover object-top"
                        />
                      </span>
                    ) : (
                      <InitialsAvatar name={member.name} />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm text-brand-300">{member.role}</p>
                      <p className="mt-3 text-sm text-pretty text-ink-muted">{member.bio}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Values */}
      <Section tone="elevated" aria-labelledby="values-heading" className="border-y border-border">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title={<span id="values-heading">Four rules we do not bend.</span>}
            description="They shape every quote, every appointment and every panel we touch."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title: valueTitle, description: valueDescription }, i) => (
              <Reveal as="li" key={valueTitle} delay={i * 0.06}>
                <Card className="h-full p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-md border border-brand-500/30 bg-brand-500/10 text-brand-300">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{valueTitle}</h3>
                  <p className="mt-2 text-sm text-pretty text-ink-muted">{valueDescription}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Standards */}
      <Section aria-labelledby="standards-heading">
        <Container className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Our standards"
              title={<span id="standards-heading">The process is the product.</span>}
              description="Great results come from boring, repeatable habits. These happen on every car, whether it is a work truck or a weekend toy."
            />
            <ButtonLink href="/services" variant="outline" className="mt-8">
              See our services
            </ButtonLink>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {standards.map((standard, i) => (
              <Reveal as="li" key={standard.title} delay={i * 0.04} className="flex gap-5 py-6">
                <span
                  className="font-display text-sm font-semibold text-brand-400 tabular-nums"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Check className="size-4 shrink-0 text-brand-400" aria-hidden />
                    {standard.title}
                  </h3>
                  <p className="mt-1.5 text-pretty text-ink-muted">{standard.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Community */}
      <Section size="sm" className="border-t border-border">
        <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-brand-300">
              <MapPin className="size-4" aria-hidden />
              Mobile across the {siteConfig.region}
            </p>
            <p className="mt-3 text-lg text-pretty text-ink-muted">
              Based in {siteConfig.address.city} and on the road across{" "}
              {siteConfig.serviceArea.slice(0, -1).join(", ")} and{" "}
              {siteConfig.serviceArea[siteConfig.serviceArea.length - 1]}. Local, owner-operated and
              easy to reach.
            </p>
          </div>
          <ButtonLink href={bookingHref} size="lg" className="shrink-0">
            Book your detail
          </ButtonLink>
        </Container>
      </Section>

      <CtaBanner
        title="Put these standards to work on your car."
        description={`Transparent pricing and one detailer who cares about the result: ${founder.name}.`}
      />
    </>
  );
}
