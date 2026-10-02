// STUB: the Shell agent owns this file and will make it cinematic. Keep this props contract.
import { Container, Eyebrow } from "@/components/ui";

export interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Background image from /public/images. */
  image?: string;
  imageAlt?: string;
  /** Breadcrumb trail, last item is the current page. */
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <div className="border-b border-border py-20">
      <Container>
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-ink-muted">{description}</p>}
        {children}
      </Container>
    </div>
  );
}
