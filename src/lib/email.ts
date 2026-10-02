import "server-only";

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  /** True when no provider is configured and the message was logged instead. */
  simulated?: boolean;
}

/**
 * Transactional email adapter. Uses Resend when RESEND_API_KEY is set; otherwise
 * logs the message so local development and CI work without credentials.
 */
export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL ?? "Project's Auto Detailing <onboarding@resend.dev>";

  if (!apiKey) {
    console.info("[email:simulated]", { from, to: message.to, subject: message.subject });
    console.info(message.text);
    return { ok: true, simulated: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}
