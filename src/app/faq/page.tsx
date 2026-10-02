import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Container, Section } from "@/components/ui";
import { FaqExplorer } from "@/components/faq/faq-explorer";
import { StillHaveQuestions } from "@/components/faq/still-have-questions";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";

const title = "FAQ";
const description = `Straight answers about detailing with ${siteConfig.name}: pricing by vehicle, what each package includes, booking, payment and mobile service.`;

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: "/faq",
});

const faqJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "FAQ", item: absoluteUrl("/faq") },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />

      <PageHero
        eyebrow="FAQ"
        title="Answers, before you ask"
        description="Packages, pricing, scheduling and mobile service, explained plainly. Search below or filter by topic."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <Section size="sm" className="pt-10 sm:pt-14">
        <Container className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          <FaqExplorer items={faqs} />
          <aside aria-label="Contact options" className="lg:sticky lg:top-28 lg:self-start">
            <StillHaveQuestions />
          </aside>
        </Container>
      </Section>

      <CtaBanner
        title="Ready when you are."
        description="Published prices, no deposit on most services and free rescheduling up to 24 hours out."
      />
    </>
  );
}
