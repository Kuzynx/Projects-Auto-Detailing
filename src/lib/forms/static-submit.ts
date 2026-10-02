/**
 * Form delivery for static hosting (GitHub Pages), where Server Actions cannot run.
 *
 * 1. If NEXT_PUBLIC_FORM_ENDPOINT is set (a Formspree-style endpoint that accepts JSON),
 *    the submission is POSTed there.
 * 2. Otherwise the visitor's messaging app is opened with a pre-filled text to the shop's
 *    phone number. The shop has no email inbox, and a text reaches the owner's phone directly.
 *
 * Both paths return the same state shapes the Server Actions return, so the UI is unchanged.
 */

import { siteConfig } from "@/config/site";

export type StaticDelivery = "endpoint" | "sms";

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

/** The shop's number in E.164 form (+18402044176), taken from the tel: link. */
export const shopSmsNumber = siteConfig.phoneHref.replace(/^tel:/, "");

/**
 * sms: link that opens the visitor's messaging app addressed to the shop with `body` filled in.
 * "?&body=" is the one form both iOS (which reads "&body=") and Android ("?body=") accept.
 */
export function buildSmsHref(body: string, to = shopSmsNumber) {
  return `sms:${to}?&body=${encodeURIComponent(body)}`;
}

/** Open the messaging app. Returns false when no window is available (tests, SSR). */
export function openSms(href: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.location.assign(href);
    return true;
  } catch {
    return false;
  }
}
