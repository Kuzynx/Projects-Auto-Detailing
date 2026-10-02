import { Plus } from "lucide-react";
import type { ServiceFaq as Faq } from "@/data/services";

/** Native disclosure accordion. Works without JavaScript. */
export function ServiceFaq({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
      {items.map((item, index) => (
        <details key={item.question} className="group" open={index === 0 || undefined}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-display text-base font-semibold text-ink transition-colors hover:bg-white/[0.02] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <Plus
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-brand-400 transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-pretty text-ink-muted sm:px-6 sm:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
