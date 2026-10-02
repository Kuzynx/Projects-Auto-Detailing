"use server";

import { z } from "zod";
import { siteConfig } from "@/config/site";
import { sendEmail } from "@/lib/email";
import { buildContactEmail } from "@/lib/contact/email";
import {
  HONEYPOT_FIELD,
  contactSchema,
  readContactFormData,
  type ContactFormState,
} from "@/lib/contact/schema";

/**
 * Contact form Server Action. Public endpoint: everything is re-validated here,
 * regardless of what the client already checked.
 */
export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = readContactFormData(formData);

  // Honeypot filled: pretend it worked so bots learn nothing.
  const trap = formData.get(HONEYPOT_FIELD);
  if (typeof trap === "string" && trap.trim() !== "") {
    return { status: "success", submittedAt: Date.now() };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: raw,
    };
  }

  const { subject, text, html } = buildContactEmail(parsed.data);
  const result = await sendEmail({
    // `||` (not `??`) so an empty BOOKING_NOTIFY_EMAIL in the host's env still falls back.
    to: process.env.BOOKING_NOTIFY_EMAIL || siteConfig.email,
    subject,
    text,
    html,
    replyTo: parsed.data.email,
  });

  if (!result.ok) {
    console.error("[contact] email failed", result.error);
    return {
      status: "error",
      message: `We could not send your message just now. Please call or text us at ${siteConfig.phone}.`,
      values: raw,
    };
  }

  return { status: "success", submittedAt: Date.now() };
}
