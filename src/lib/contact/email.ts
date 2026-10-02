import { siteConfig } from "@/config/site";
import { topicLabel, type ContactData } from "./schema";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Builds the internal notification email for a contact form submission. */
export function buildContactEmail(data: ContactData) {
  const topic = topicLabel(data.topic);
  const subject = `[${siteConfig.name}] ${topic} inquiry from ${data.name}`;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone ?? "Not provided"],
    ["Topic", topic],
    ["Vehicle", data.vehicle ?? "Not provided"],
  ];

  const text = [
    `New contact form message for ${siteConfig.name}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
    "",
    "Reply to this email to respond directly to the customer.",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
        <tr><td style="background:#09090b;color:#f2f2f3;padding:20px 24px;font-size:16px;font-weight:600">
          New ${escapeHtml(topic)} inquiry
        </td></tr>
        <tr><td style="padding:20px 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
            ${rows
              .map(
                ([label, value]) =>
                  `<tr><td style="padding:6px 0;color:#71717a;width:110px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </table>
          <div style="margin-top:16px;padding:16px;background:#fafafa;border-radius:8px;border:1px solid #f4f4f5;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(data.message)}</div>
          <p style="margin:16px 0 0;font-size:12px;color:#71717a">Reply to this email to respond directly to ${escapeHtml(data.name)}.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}
