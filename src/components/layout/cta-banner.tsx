// STUB: the Shell agent owns this file. Keep this props contract.
import { Container, Section, ButtonLink } from "@/components/ui";
import { bookingHref, siteConfig } from "@/config/site";

export interface CtaBannerProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
}

export function CtaBanner({ title = "Ready for a showroom finish?", description, primaryLabel = "Book your detail", primaryHref = bookingHref }: CtaBannerProps) {
  return (
    <Section tone="elevated">
      <Container className="text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-ink-muted">{description}</p>}
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href={primaryHref} size="lg">{primaryLabel}</ButtonLink>
          <ButtonLink href={siteConfig.phoneHref} variant="outline" size="lg">Call {siteConfig.phone}</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
