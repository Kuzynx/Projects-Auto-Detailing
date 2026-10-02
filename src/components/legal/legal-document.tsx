import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container, Section } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export interface LegalSection {
  /** Anchor id, also used by the table of contents. */
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalDocumentProps {
  /** ISO date, e.g. "2026-10-02". */
  lastUpdated: string;
  summary?: React.ReactNode;
  sections: LegalSection[];
  related: { label: string; href: string };
}

/**
 * Prose styles without the typography plugin. Children are plain semantic HTML
 * (p, ul, li, a, strong, h3), so legal copy stays easy to edit.
 */
const prose = cn(
  "text-base leading-7 text-ink-muted",
  "[&_p]:mt-4 [&_p]:text-pretty",
  "[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand-500",
  "[&_a]:font-medium [&_a]:text-brand-400 [&_a]:underline [&_a]:decoration-brand-400/40 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-brand-300 hover:[&_a]:decoration-brand-300",
  "[&_strong]:font-semibold [&_strong]:text-ink",
);

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function LegalDocument({ lastUpdated, summary, sections, related }: LegalDocumentProps) {
  const { address } = siteConfig;

  return (
    <Section size="sm">
      <Container className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm text-ink-subtle">
            Last updated{" "}
            <time dateTime={lastUpdated} className="text-ink-muted">
              {formatDate(lastUpdated)}
            </time>
          </p>
          <nav
            aria-labelledby="toc-heading"
            className="mt-6 rounded-lg border border-border bg-surface p-5 lg:border-0 lg:bg-transparent lg:p-0"
          >
            <h2
              id="toc-heading"
              className="font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase"
            >
              On this page
            </h2>
            <ol className="mt-4 space-y-1 border-l border-border text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px flex gap-2 border-l border-transparent py-1.5 pl-4 text-ink-muted transition-colors hover:border-brand-500 hover:text-ink"
                  >
                    <span className="w-5 shrink-0 text-ink-subtle tabular-nums">{index + 1}.</span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-3xl min-w-0">
          {summary && (
            <div className="rounded-lg border border-brand-500/25 bg-brand-500/5 p-5 text-ink sm:p-6 [&_p+p]:mt-3">
              {summary}
            </div>
          )}

          <div className={prose}>
            {sections.map((section, index) => (
              <section
                key={section.id}
                aria-labelledby={section.id}
                className={cn(
                  "pt-10",
                  index > 0 && "mt-10 border-t border-border",
                  !summary && index === 0 && "pt-0",
                )}
              >
                <h2
                  id={section.id}
                  className="scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-balance text-ink"
                >
                  <span className="mr-2 text-brand-400 tabular-nums">{index + 1}.</span>
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              Questions about this page?
            </h2>
            <p className="mt-2 text-ink-muted">
              A real person on our team will answer. You can also read our{" "}
              <Link
                href={related.href}
                className="font-medium text-brand-400 underline underline-offset-4 hover:text-brand-300"
              >
                {related.label}
              </Link>
              .
            </p>
            <ul className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all text-ink hover:text-brand-300"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <a href={siteConfig.phoneHref} className="text-ink hover:text-brand-300">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <address className="text-ink-muted not-italic">
                  {siteConfig.legalName}
                  <br />
                  {address.street ? (
                    <>
                      {address.street}
                      <br />
                    </>
                  ) : null}
                  {address.city}, {address.state} {address.zip}
                  {siteConfig.mobileOnly && (
                    <>
                      <br />
                      Mobile service across the {siteConfig.region}
                    </>
                  )}
                </address>
              </li>
            </ul>
          </div>
        </article>
      </Container>
    </Section>
  );
}
