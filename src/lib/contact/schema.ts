import { z } from "zod";

/** Contact form topics, in display order. Values are stable identifiers sent to the server. */
export const contactTopics = [
  { value: "quote", label: "Quote" },
  { value: "question", label: "Question" },
  { value: "fleet", label: "Fleet & commercial" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["value"];

const topicValues = contactTopics.map((t) => t.value) as [ContactTopic, ...ContactTopic[]];

export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  phone: 32,
  vehicle: 120,
  message: 2000,
} as const;

const optionalText = (max: number, error: string) =>
  z
    .string()
    .trim()
    .max(max, { error })
    .optional()
    .transform((value) => (value ? value : undefined));

/** Shared by the client (instant feedback) and the server action (source of truth). */
export const contactSchema = z.object({
  name: z
    .string({ error: "Please tell us your name." })
    .trim()
    .min(2, { error: "Please tell us your name." })
    .max(CONTACT_LIMITS.name, { error: `Keep your name under ${CONTACT_LIMITS.name} characters.` }),
  email: z
    .string({ error: "Enter your email so we can reply." })
    .trim()
    .min(1, { error: "Enter your email so we can reply." })
    .max(CONTACT_LIMITS.email, { error: "That email address is too long." })
    .pipe(z.email({ error: "Enter a valid email, like you@example.com." })),
  phone: optionalText(CONTACT_LIMITS.phone, "That phone number is too long.").refine(
    (value) => !value || (/^[+()\-.\s\d]+$/.test(value) && value.replace(/\D/g, "").length >= 10),
    { error: "Enter a 10-digit phone number, or leave it blank." },
  ),
  topic: z.enum(topicValues, { error: "Choose what this is about." }),
  vehicle: optionalText(
    CONTACT_LIMITS.vehicle,
    `Keep this under ${CONTACT_LIMITS.vehicle} characters.`,
  ),
  message: z
    .string({ error: "Add a short message." })
    .trim()
    .min(10, { error: "Add a little more detail (at least 10 characters)." })
    .max(CONTACT_LIMITS.message, {
      error: `Keep your message under ${CONTACT_LIMITS.message} characters.`,
    }),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export const contactFields = [
  "name",
  "email",
  "phone",
  "topic",
  "vehicle",
  "message",
] as const satisfies readonly ContactField[];

/** Name of the hidden anti-spam field. Real people never fill it in. */
export const HONEYPOT_FIELD = "company_website";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  /** Form-level message (shown above the submit button on error). */
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
  /** Echoed back on error so inputs keep what the visitor typed. */
  values?: Partial<Record<ContactField, string>>;
  /** Changes on every successful send so the client can tell submissions apart. */
  submittedAt?: number;
  /** How the message was delivered; "mailto" means the visitor's mail app was opened (static hosting). */
  delivery?: "email" | "endpoint" | "mailto";
  mailtoHref?: string;
}

export const initialContactState: ContactFormState = { status: "idle" };

/** Pull the known string fields out of FormData. */
export function readContactFormData(formData: FormData): Record<ContactField, string> {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    name: read("name"),
    email: read("email"),
    phone: read("phone"),
    topic: read("topic"),
    vehicle: read("vehicle"),
    message: read("message"),
  };
}

export function topicLabel(topic: ContactTopic) {
  return contactTopics.find((t) => t.value === topic)?.label ?? "General";
}
