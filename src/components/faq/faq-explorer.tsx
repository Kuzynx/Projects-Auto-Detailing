"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { faqCategories, type FaqCategory, type FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";

type Filter = FaqCategory | "all";

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps search terms in <mark> for quick scanning. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-brand-500/25 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function FaqExplorer({ items }: { items: FaqItem[] }) {
  const [category, setCategory] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const deferredQuery = useDeferredValue(query);
  const uid = useId();

  const terms = useMemo(
    () =>
      normalize(deferredQuery)
        .split(/\s+/)
        .filter((term) => term.length > 1),
    [deferredQuery],
  );

  const indexed = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        index,
        haystack: normalize(`${item.question} ${item.answer}`),
      })),
    [items],
  );

  const matches = useMemo(
    () =>
      indexed.filter(
        ({ item, haystack }) =>
          (category === "all" || item.category === category) &&
          terms.every((term) => haystack.includes(term)),
      ),
    [indexed, category, terms],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: 0 };
    for (const { item, haystack } of indexed) {
      if (!terms.every((term) => haystack.includes(term))) continue;
      map.all += 1;
      map[item.category] = (map[item.category] ?? 0) + 1;
    }
    return map;
  }, [indexed, terms]);

  const groups = faqCategories
    .map((cat) => ({ ...cat, entries: matches.filter(({ item }) => item.category === cat.id) }))
    .filter((group) => group.entries.length > 0);

  const searching = terms.length > 0;
  const allOpen = matches.length > 0 && matches.every(({ index }) => open.has(index));

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleAll() {
    setOpen(allOpen ? new Set() : new Set(matches.map(({ index }) => index)));
  }

  const filters: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...faqCategories];

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-5">
        <div className="relative">
          <label htmlFor={`${uid}-search`} className="sr-only">
            Search frequently asked questions
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          />
          <input
            id={`${uid}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: coatings, rain, deposit, pet hair..."
            autoComplete="off"
            className="h-14 w-full rounded-full border border-border-strong bg-surface pr-12 pl-12 text-base text-ink transition-colors placeholder:text-ink-subtle hover:border-white/25 focus:border-brand-500 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-white/5 hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Filter questions by topic"
            className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
          >
            {filters.map((filter) => {
              const isActive = filter.id === category;
              const count = counts[filter.id] ?? 0;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCategory(filter.id)}
                  className={cn(
                    "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 font-display text-sm font-medium transition-colors",
                    isActive
                      ? "border-brand-500 bg-brand-500 text-bg"
                      : "border-border-strong bg-white/[0.03] text-ink-muted hover:border-brand-500/60 hover:text-ink",
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] tabular-nums",
                      isActive ? "bg-bg/15" : "bg-white/5 text-ink-subtle",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {matches.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="shrink-0 cursor-pointer self-start text-sm font-medium text-brand-300 underline-offset-4 hover:underline sm:self-auto"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          )}
        </div>

        <p aria-live="polite" className="text-sm text-ink-muted">
          {searching || category !== "all" ? (
            <>
              Showing <span className="font-semibold text-ink tabular-nums">{matches.length}</span>{" "}
              of {items.length} questions
              {searching && (
                <>
                  {" "}
                  for <span className="text-ink">&ldquo;{deferredQuery.trim()}&rdquo;</span>
                </>
              )}
            </>
          ) : (
            <>{items.length} questions, answered by our detailers</>
          )}
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border-strong px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold">No answers match that yet.</p>
          <p className="mt-2 text-ink-muted">
            Try a different word, or ask us directly. A detailer typically replies within 1 business
            hour.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-5 cursor-pointer text-sm font-medium text-brand-300 underline-offset-4 hover:underline"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`${uid}-group-${group.id}`}>
              <h2
                id={`${uid}-group-${group.id}`}
                className="mb-3 font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase"
              >
                {group.label}
              </h2>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
                {group.entries.map(({ item, index }) => {
                  const isOpen = open.has(index);
                  const buttonId = `${uid}-q-${index}`;
                  const panelId = `${uid}-a-${index}`;
                  return (
                    <li key={item.question}>
                      <h3>
                        <button
                          id={buttonId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggle(index)}
                          className="group flex w-full cursor-pointer items-start justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-surface-hover sm:px-6"
                        >
                          <span className="font-display text-base font-semibold text-ink sm:text-lg">
                            <Highlight text={item.question} terms={terms} />
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border-strong text-ink-muted transition-all duration-300",
                              isOpen &&
                                "rotate-180 border-brand-500 bg-brand-500/10 text-brand-300",
                            )}
                          >
                            <ChevronDown className="size-4" />
                          </span>
                        </button>
                      </h3>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        inert={!isOpen}
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-3xl px-5 pb-6 text-pretty text-ink-muted sm:px-6">
                            <Highlight text={item.answer} terms={terms} />
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
