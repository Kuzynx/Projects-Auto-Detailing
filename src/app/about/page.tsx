import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Check, MapPin, Quote, ShieldCheck } from "lucide-react";
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
import { credentials, founder, standards, team, values } from "@/components/about/content";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";
import { bookingHref, siteConfig } from "@/config/site";

const title = "About";
const description = `Meet the team behind ${siteConfig.name}: IDA-certified detailers serving ${siteConfig.address.city} since ${siteConfig.founded}, with ${siteConfig.stats.vehiclesDetailed.toLocaleString("en-US")}+ vehicles detailed and a ${siteConfig.stats.googleRating}-star rating.`;

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/about",
});

const stats = [
  {
    value: `${siteConfig.stats.vehiclesDetailed.toLocaleString("en-US")}+`,
    label: "Vehicles detailed",
  },
  { value: `${siteConfig.stats.yearsInBusiness}`, label: "Years in business" },
  { value: siteConfig.stats.googleRating.toFixed(1), label: "Average Google rating" },
  { value: `${siteConfig.stats.reviewCount}`, label: "Verified reviews" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
          ],
        }}
      />

      <PageHero
        eyebrow={`About ${siteConfig.name}`}
        title={`Obsessed with the details since ${siteConfig.founded}`}
        description={`A fully mobile team of certified detailers in the ${siteConfig.region}. We measure paint, sweat the edges and treat a family SUV with the same care as a supercar, right in your driveway.`}
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
              It started with one driveway and a second bucket.
            </h2>
            <div className="mt-6 space-y-5 text-base text-pretty text-ink-muted sm:text-lg">
              <p>
                In {siteConfig.founded}, {founder.name} was washing cars on weekends around{" "}
                {siteConfig.address.city} and noticing the same thing on almost every one: swirl
                marks from automatic washes and quick-detail shops. Damage done by people who were
                supposed to be helping.
              </p>
              <p>
                So he did it the slow way, and he did it at the customer&rsquo;s house. Two buckets
                and grit guards. A paint-depth gauge before any polisher. Inspection lights that
                show every flaw. Word spread from one driveway to the next, and {siteConfig.name}{" "}
                grew into a fully mobile team covering the {siteConfig.region}.
              </p>
              <p>
                We still have no shop, on purpose. We roll out early to beat the desert heat, carry
                our own water and power, and do paint correction and ceramic coatings in your
                garage, out of the sun and wind.{" "}
                {siteConfig.stats.vehiclesDetailed.toLocaleString("en-US")} cars later, the rule has
                not changed: we only hand back a car we would be proud to drive ourselves.
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
            <div
              aria-hidden
              className="absolute -right-4 -bottom-4 -z-10 hidden size-40 rounded-lg border border-brand-500/30 bg-brand-500/10 blur-[1px] lg:block"
            />
          </Reveal>
        </Container>
      </Section>

      {/* Stats */}
      <section aria-label="By the numbers" className="border-y border-border bg-bg-elevated">
        <Container>
          <dl className="grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.06}
                className="flex flex-col-reverse px-4 py-10 text-center sm:py-12"
              >
                <dt className="mt-2 text-sm text-ink-muted">{stat.label}</dt>
                <dd className="text-gradient-brand font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  {stat.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Founder note */}
      <Section aria-labelledby="founder-heading">
        <Container>
          <Card className="relative overflow-hidden p-8 sm:p-12 lg:p-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brand-500/15 blur-3xl"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <figure>
                <h2 id="founder-heading" className="sr-only">
                  A note from our founder
                </h2>
                <Quote className="size-10 text-brand-400" aria-hidden />
                <blockquote className="mt-6 font-display text-2xl leading-snug font-medium text-balance text-ink sm:text-3xl">
                  &ldquo;Most paint damage I see was done by someone trying to clean it. Our whole
                  business is built around not being that someone. If we would not put the towel on
                  our own car, it does not touch yours.&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <InitialsAvatar name={founder.name} className="size-14 text-lg" />
                  <div>
                    <p className="font-display font-semibold text-ink">{founder.name}</p>
                    <p className="text-sm text-ink-muted">
                      {founder.role}, {founder.credential}
                    </p>
                  </div>
                </figcaption>
              </figure>
              <div className="mx-auto w-48 sm:w-56 lg:w-64">
                <Image
                  src={siteConfig.logoTransparent}
                  alt={`${siteConfig.name} logo`}
                  width={947}
                  height={929}
                  sizes="(min-width: 1024px) 256px, 224px"
                  className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,.6)]"
                />
              </div>
            </div>
          </Card>
        </Container>
      </Section>

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

      {/* Team */}
      <Section tone="elevated" aria-labelledby="team-heading" className="border-y border-border">
        <Container>
          <SectionHeading
            eyebrow="The team"
            title={<span id="team-heading">The people on your car.</span>}
            description="No subcontractors and no trainees practicing on your paint. Every technician is certified, insured and background checked."
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {team.map((member, i) => (
              <Reveal as="li" key={member.name} delay={i * 0.08}>
                <Card className="flex h-full flex-col p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <InitialsAvatar name={member.name} />
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm text-brand-300">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 flex-1 text-sm text-pretty text-ink-muted">{member.bio}</p>
                  <ul
                    className="mt-6 flex flex-wrap gap-2"
                    aria-label={`${member.name} credentials`}
                  >
                    {member.credentials.map((credential) => (
                      <li key={credential}>
                        <Badge tone="neutral">{credential}</Badge>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Certifications and insurance */}
      <section aria-labelledby="credentials-heading" className="py-12 sm:py-16">
        <Container>
          <h2
            id="credentials-heading"
            className="flex items-center justify-center gap-2 text-center font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase"
          >
            <ShieldCheck className="size-4 text-brand-400" aria-hidden />
            Certified, insured and accountable
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {credentials.map((item, i) => (
              <li
                key={item.label}
                className={`flex flex-col items-center gap-1 bg-bg px-4 py-6 text-center${i === credentials.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <BadgeCheck className="size-5 text-brand-400" aria-hidden />
                <span className="mt-1 font-display font-semibold text-ink">{item.label}</span>
                <span className="text-xs text-ink-muted">{item.detail}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Community */}
      <Section size="sm" className="border-t border-border">
        <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-brand-300">
              <MapPin className="size-4" aria-hidden />
              Mobile across the {siteConfig.region}
            </p>
            <p className="mt-3 text-lg text-pretty text-ink-muted">
              Based in {siteConfig.address.city} and on the road every day across{" "}
              {siteConfig.serviceArea.slice(0, -1).join(", ")} and{" "}
              {siteConfig.serviceArea[siteConfig.serviceArea.length - 1]}. We sponsor local
              cars-and-coffee meets and offer discounted details to school and nonprofit fleets.
            </p>
          </div>
          <ButtonLink href={bookingHref} size="lg" className="shrink-0">
            Book with our team
          </ButtonLink>
        </Container>
      </Section>

      <CtaBanner
        title="Put our standards to work on your car."
        description="Transparent pricing, certified technicians and a satisfaction guarantee on every appointment."
      />
    </>
  );
}
