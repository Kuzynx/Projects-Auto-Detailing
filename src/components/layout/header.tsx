// STUB: replaced by the Shell agent. Keep the export name.
import Link from "next/link";
import { siteConfig, navigation } from "@/config/site";
import { Container } from "@/components/ui";

export function Header() {
  return (
    <header className="border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display font-semibold">{siteConfig.name}</Link>
        <nav className="hidden gap-6 text-sm md:flex">
          {navigation.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink-muted hover:text-ink">{n.label}</Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
