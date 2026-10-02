"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "querystring-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * A single query-string value kept in sync with the URL without a navigation.
 * Static-safe: renders `fallback` on the server and hydrates to the URL value,
 * so pages using it stay prerendered and need no Suspense boundary.
 * Every component using the same key stays in sync.
 */
export function useQueryParam<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  );
  const value =
    raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;

  const setValue = useCallback(
    (next: T) => {
      const url = new URL(window.location.href);
      if (next === fallback) url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key, fallback],
  );

  return [value, setValue] as const;
}
