import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { siteConfig } from "@/config/site";

/** Sidebar card that routes unanswered questions to a person. */
export function StillHaveQuestions() {
  return (
    <Card className="relative overflow-hidden p-6 hover:border-border sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-brand-500/15 blur-3xl"
      />
      <div className="relative">
        <span className="inline-flex size-11 items-center justify-center rounded-md border border-brand-500/30 bg-brand-500/10 text-brand-300">
          <MessageSquare className="size-5" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-semibold">Still have questions?</h2>
        <p className="mt-2 text-pretty text-ink-muted">
          Send a photo of the car and what is bothering you. A detailer, not a script, will tell you
          exactly what it needs and what it costs.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href="/contact" className="w-full">
            Message a detailer
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-strong font-display text-sm font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-300"
          >
            <Phone className="size-4" aria-hidden />
            Call {siteConfig.phone}
          </a>
        </div>
        <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
          {siteConfig.hours.map((row) => (
            <div key={row.days} className="flex justify-between gap-4">
              <dt className="text-ink-muted">{row.days}</dt>
              <dd className="text-ink tabular-nums">
                {row.close ? `${row.open} – ${row.close}` : row.open}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}
