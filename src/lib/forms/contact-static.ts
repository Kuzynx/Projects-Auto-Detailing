/**
 * Static-hosting replacement for src/app/contact/actions.ts. Same signature, no server.
 * Aliased in by next.config.ts when STATIC_EXPORT=true; never imported directly.
 */
import { z } from "zod";
import { siteConfig } from "@/config/site";
import {
  HONEYPOT_FIELD,
  contactSchema,
  readContactFormData,
  topicLabel,
  type ContactFormState,
} from "@/lib/contact/schema";
import { buildMailto, formEndpoint, openMailto, postToFormEndpoint } from "./static-submit";

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = readContactFormData(formData);
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

  const data = parsed.data;
  const subject = `${topicLabel(data.topic)} from ${data.name} via the website`;
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : "",
    data.vehicle ? `Vehicle: ${data.vehicle}` : "",
    `Topic: ${topicLabel(data.topic)}`,
    "",
    data.message,
  ]
    .filter((line) => line !== "")
    .join("\n");

  if (formEndpoint) {
    const sent = await postToFormEndpoint({
      subject,
      replyTo: data.email,
      fields: { ...data, phone: data.phone ?? "", vehicle: data.vehicle ?? "" },
    });
    if (sent) return { status: "success", submittedAt: Date.now(), delivery: "endpoint" };
    return {
      status: "error",
      message: `We could not send your message just now. Please call us at ${siteConfig.phone} or email ${siteConfig.email}.`,
      values: raw,
    };
  }

  const mailtoHref = buildMailto(siteConfig.email, subject, body);
  openMailto(mailtoHref);
  return { status: "success", submittedAt: Date.now(), delivery: "mailto", mailtoHref };
}
