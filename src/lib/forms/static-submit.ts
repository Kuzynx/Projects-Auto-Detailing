/**
 * Form delivery for static hosting (GitHub Pages), where Server Actions cannot run.
 *
 * 1. If NEXT_PUBLIC_FORM_ENDPOINT is set (a Formspree-style endpoint that accepts JSON),
 *    the submission is POSTed there.
 * 2. Otherwise the visitor's mail app is opened with a pre-filled message to the shop.
 *
 * Both paths return the same state shapes the Server Actions return, so the UI is unchanged.
 */

export type StaticDelivery = "endpoint" | "mailto";

export const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() || null;

export interface EndpointSubmission {
  subject: string;
  replyTo: string;
  fields: Record<string, string | number | boolean | string[]>;
}

/** POST to the configured endpoint. Resolves true on a 2xx response. */
export async function postToFormEndpoint(submission: EndpointSubmission): Promise<boolean> {
  if (!formEndpoint) return false;
  try {
    const response = await fetch(formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...submission.fields,
        // Formspree conventions; harmless for other providers.
        _subject: submission.subject,
        _replyto: submission.replyTo,
        email: submission.replyTo,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Longest mailto: link we hand to the browser. Some mail handlers (Outlook and
 * older Windows handlers) fail or truncate past roughly 2,000 characters.
 */
export const MAX_MAILTO_LENGTH = 1800;

const TRUNCATION_NOTE =
  "\n\n[Message shortened to fit your mail app. Add anything missing before you send.]";

function encodeMailto(to: string, subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which mail clients render literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}

/**
 * Build a mailto: link no longer than `maxLength`. When the body is too long it is
 * cut from the end (the free-text notes come last) and a short note is appended.
 */
export function buildMailto(
  to: string,
  subject: string,
  body: string,
  maxLength = MAX_MAILTO_LENGTH,
) {
  const full = encodeMailto(to, subject, body);
  if (full.length <= maxLength) return full;
  // Binary search for the longest prefix of the body that fits with the note.
  let low = 0;
  let high = body.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const candidate = encodeMailto(to, subject, body.slice(0, mid).trimEnd() + TRUNCATION_NOTE);
    if (candidate.length <= maxLength) low = mid;
    else high = mid - 1;
  }
  return encodeMailto(to, subject, body.slice(0, low).trimEnd() + TRUNCATION_NOTE);
}

/** Open the mail app. Returns false when no window is available (tests, SSR). */
export function openMailto(href: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.location.assign(href);
    return true;
  } catch {
    return false;
  }
}
