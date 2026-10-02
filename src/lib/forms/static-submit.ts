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

/** Build a mailto: link. Bodies are kept short because some mail clients cap URL length. */
export function buildMailto(to: string, subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which mail clients render literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
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
