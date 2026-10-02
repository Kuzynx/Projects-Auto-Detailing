import { ArrowRight, Plus } from "lucide-react";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { faqs, type FaqItem } from "@/data/faq";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

/**
 * One question per topic, in the order a first-time customer tends to ask them. Chosen by
 * category (never by question text) so it survives FAQ rewrites; topics that no longer exist
 * are skipped and the list is topped up from the remaining questions.
 */
const TOPICS: string[] = ["mobile", "booking", "services", "general"];
const COUNT = 4;

/** Skip answers that state claims the business has not confirmed (see `siteConfig.claims`). */
const UNVERIFIED = /insur|warrant|certif/i;

function pickFaqs(): FaqItem[] {
  const usable = faqs.filter((f) => !UNVERIFIED.test(f.answer));
  const picked = TOPICS.map((topic) => usable.find((f) => f.category === topic)).filter(
    (f) => f !== undefined,
  );
  const extra = usable.filter((f) => !picked.includes(f));
  return [...picked, ...extra].slice(0, COUNT);
}

export function FaqTeaser() {
  const items = pickFaqs();

  return (
    <Section aria-labelledby="faq-title">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <span id="faq-title">
                Questions, <span className="text-gradient-brand">answered straight.</span>
              </span>
            }
            description="The things owners ask us most before they book. Anything else, we are a text or a call away."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/faq" variant="outline" className="group">
              Read all FAQs
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
            <a
              href={siteConfig.phoneHref}
              className="px-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              or call <span className="font-semibold text-ink">{siteConfig.phone}</span>
            </a>
          </div>
        </Reveal>

        <RevealGroup as="ul" stagger={0.08} className="flex flex-col gap-3 lg:col-span-7">
          {items.map((faq, i) => (
            <RevealItem as="li" key={faq.question}>
              <details
                name="home-faq"
                open={i === 0}
                className="group rounded-lg border border-border bg-surface transition-colors open:border-brand-500/35 open:bg-surface-hover hover:border-border-strong"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-base font-semibold text-ink sm:text-lg">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-border-strong text-ink-muted transition-all duration-300 group-open:rotate-45 group-open:border-brand-500 group-open:bg-brand-500 group-open:text-bg"
                  >
                    <Plus className="size-4" />
                  </span>
                </summary>
                <p className="-mt-1 px-5 pb-6 text-sm leading-relaxed text-pretty text-ink-muted sm:px-6 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
