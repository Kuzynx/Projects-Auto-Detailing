// STUB: replaced by the Shell agent. Keep the export name.
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-sm text-ink-muted">
      <Container>© {new Date().getFullYear()} {siteConfig.legalName}</Container>
    </footer>
  );
}
