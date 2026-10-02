/**
 * Transactional emails for a new booking: a confirmation for the customer and
 * a full job sheet for the shop. Table layout with inline styles so it renders
 * in Gmail, Apple Mail and Outlook. Every template returns HTML and plain text.
 */
import { siteConfig } from "@/config/site";
import { getService } from "@/data/services";
import { siteUrl } from "@/lib/seo/url";
import { formatPrice } from "@/lib/utils";
import {
  UTILITIES_CONFIRMED_LABEL,
  bookingContactName,
  getEstimateNote,
  detailerName,
  formatAppointment,
  formatServiceAddress,
  formatVehicle,
  getCancellationPolicy,
  getDepositPolicy,
  getInteriorConditionLabel,
  getPaintConditionLabel,
  getSizeLabel,
} from "./format";
import { toE164 } from "./phone";
import { formatEstimateTotal, type Estimate } from "./pricing";
import { requiresGarage, type BookingData } from "./schema";

export interface BookingEmailInput {
  reference: string;
  booking: BookingData;
  estimate: Estimate;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/* Brand palette, mirrored from globals.css (email clients cannot read CSS variables). */
const color = {
  bg: "#09090b",
  surface: "#141417",
  surfaceRaised: "#1a1a1f",
  border: "#26262b",
  ink: "#f2f2f3",
  muted: "#b8b7ba",
  subtle: "#838286",
  brand: "#c796f0",
  brandDeep: "#7f4db3",
};

const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "Owner-operated · Fully mobile · Since 2024 · Victorville, CA and the High Desert" */
function serviceAreaLine(): string {
  return `Owner-operated · Fully mobile · Since ${siteConfig.founded} · ${siteConfig.address.city}, ${siteConfig.address.state} and the ${siteConfig.region}`;
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

type Row = [label: string, value: string];

function bookingRows(input: BookingEmailInput, { internal }: { internal: boolean }): Row[] {
  const { booking, estimate } = input;
  const service = getService(booking.service);
  const vehicle = formatVehicle(booking) ?? "Not provided";
  const rows: Row[] = [
    [
      "Service",
      `${service?.name ?? booking.service} (${formatPrice(estimate.service?.price ?? 0)})`,
    ],
    ["Vehicle", `${vehicle} · ${getSizeLabel(booking.size)}`],
    ...(estimate.addOns.length > 0
      ? [
          [
            "Add-ons",
            estimate.addOns.map((a) => `${a.name} (${formatPrice(a.price)})`).join(", "),
          ] as Row,
        ]
      : []),
    ["When", formatAppointment(booking) ?? booking.date],
    ["Where", formatServiceAddress(booking)],
  ];
  if (booking.utilitiesConfirmed) rows.push(["Utilities", UTILITIES_CONFIRMED_LABEL]);
  if (requiresGarage(booking.service))
    rows.push(["Workspace", "Garage or covered space confirmed"]);
  if (estimate.durationLabel) rows.push(["Time on site", estimate.durationLabel]);

  if (internal) {
    const flags = [booking.petHair && "Pet hair", booking.smoke && "Smoke odor"]
      .filter(Boolean)
      .join(", ");
    rows.push(
      ["Paint", getPaintConditionLabel(booking.paintCondition) ?? booking.paintCondition],
      [
        "Interior",
        getInteriorConditionLabel(booking.interiorCondition) ?? booking.interiorCondition,
      ],
      ["Flags", flags || "None"],
      ["Customer", booking.name],
      ["Phone", booking.phone],
      ["Email", booking.email],
      ["SMS consent", booking.smsConsent ? "Yes, OK to text" : "No, call or email only"],
      ["Notes", booking.notes || "None"],
    );
  }
  return rows;
}

/* ------------------------------------------------------------------ */
/* HTML building blocks                                                */
/* ------------------------------------------------------------------ */

function layout({ preheader, body }: { preheader: string; body: string }): string {
  // siteUrl() uses the canonical domain, never localhost, so customers always see the logo.
  const logo = siteUrl(siteConfig.logo);
  const address = serviceAreaLine();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background:${color.bg};" bgcolor="${color.bg}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${color.bg};">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${color.bg}" style="background:${color.bg};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:${fontStack};">
<tr><td style="padding:0 0 24px 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="padding-right:12px;"><img src="${escapeHtml(logo)}" width="48" height="48" alt="${escapeHtml(siteConfig.name)}" style="display:block;border:0;border-radius:10px;"></td>
<td style="font-size:16px;font-weight:700;letter-spacing:-0.01em;color:${color.ink};">${escapeHtml(siteConfig.name)}</td>
</tr></table>
</td></tr>
<tr><td bgcolor="${color.surface}" style="background:${color.surface};border:1px solid ${color.border};border-top:3px solid ${color.brand};border-radius:16px;padding:32px 28px;">
${body}
</td></tr>
<tr><td style="padding:24px 8px 0 8px;font-size:12px;line-height:18px;color:${color.subtle};text-align:center;">
${escapeHtml(siteConfig.legalName)} · ${escapeHtml(address)}<br>
<a href="${siteConfig.phoneHref}" style="color:${color.muted};text-decoration:none;">${escapeHtml(siteConfig.phone)}</a> · <a href="mailto:${siteConfig.email}" style="color:${color.muted};text-decoration:none;">${escapeHtml(siteConfig.email)}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 12px 0;font-size:26px;line-height:32px;font-weight:700;letter-spacing:-0.02em;color:${color.ink};">${escapeHtml(text)}</h1>`;
}

function paragraph(html: string, extra = ""): string {
  return `<p style="margin:0 0 16px 0;font-size:15px;line-height:24px;color:${color.muted};${extra}">${html}</p>`;
}

function eyebrow(text: string): string {
  return `<p style="margin:0 0 8px 0;font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${color.brand};">${escapeHtml(text)}</p>`;
}

function referenceBlock(reference: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;">
<tr><td bgcolor="${color.surfaceRaised}" style="background:${color.surfaceRaised};border:1px solid ${color.border};border-radius:12px;padding:16px 20px;">
<span style="display:block;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${color.subtle};">Booking reference</span>
<span style="display:block;margin-top:4px;font-size:22px;font-weight:700;letter-spacing:0.08em;color:${color.brand};font-family:'SFMono-Regular',Menlo,Consolas,monospace;">${escapeHtml(reference)}</span>
</td></tr></table>`;
}

function detailsTable(rows: Row[]): string {
  const body = rows
    .map(
      ([label, value]) => `<tr>
<td valign="top" style="padding:10px 12px 10px 0;border-bottom:1px solid ${color.border};font-size:13px;line-height:20px;color:${color.subtle};width:120px;">${escapeHtml(label)}</td>
<td valign="top" style="padding:10px 0;border-bottom:1px solid ${color.border};font-size:14px;line-height:20px;color:${color.ink};">${escapeHtml(value)}</td>
</tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">${body}</table>`;
}

/** "$50", "from $100" or "$150+", matching the price shown on the site. */
function totalLabel(estimate: Estimate): string {
  return formatEstimateTotal(estimate) ?? formatPrice(estimate.total);
}

function totalBlock(estimate: Estimate, note: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
<tr>
<td style="font-size:14px;color:${color.muted};">Estimated total</td>
<td align="right" style="font-size:24px;font-weight:700;color:${color.ink};">${escapeHtml(totalLabel(estimate))}</td>
</tr>
<tr><td colspan="2" style="padding-top:4px;font-size:12px;line-height:18px;color:${color.subtle};">${escapeHtml(note)}</td></tr>
</table>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0 0;"><tr>
<td bgcolor="${color.brand}" style="background:${color.brand};border-radius:999px;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:${color.bg};text-decoration:none;">${escapeHtml(label)}</a>
</td></tr></table>`;
}

/* ------------------------------------------------------------------ */
/* Customer confirmation                                               */
/* ------------------------------------------------------------------ */

function nextSteps(booking: BookingData): [string, string][] {
  const founder = detailerName;
  const contactLine = booking.smsConsent
    ? `${bookingContactName} will text ${booking.phone} within the hour (during business hours) to lock in your slot.`
    : `${bookingContactName} will call ${booking.phone} within the hour (during business hours) to lock in your slot.`;
  const dayBefore = requiresGarage(booking.service)
    ? `The day before, you'll get ${founder}'s arrival time. Clear the garage or covered space so he can work all the way around the car. You provide the hose spigot and outlet; he brings the rest.`
    : `The day before, you'll get ${founder}'s arrival window. You provide the hose spigot and outlet; he brings the rest.`;
  return [
    [`${bookingContactName} confirms your time`, contactLine],
    ["Day-before reminder", dayBefore],
    [
      "Walkthrough, then the work",
      `${founder} walks the car with you and confirms the final price and plan before any work begins.`,
    ],
  ];
}

export function renderCustomerConfirmationEmail(input: BookingEmailInput): RenderedEmail {
  const { booking, estimate, reference } = input;
  const service = getService(booking.service);
  const serviceName = service?.name ?? "your detail";
  const when = formatAppointment(booking) ?? booking.date;
  const policy = getCancellationPolicy();
  const deposit = requiresGarage(booking.service) ? getDepositPolicy() : null;
  const subject = `Request received: ${serviceName}, ${when} (${reference})`;
  const rows = bookingRows(input, { internal: false });
  const steps = nextSteps(booking);

  const stepsHtml = steps
    .map(
      ([title, body], i) => `<tr>
<td valign="top" style="padding:0 14px 16px 0;width:28px;">
<div style="width:28px;height:28px;border-radius:999px;background:${color.surfaceRaised};border:1px solid ${color.brandDeep};color:${color.brand};font-size:13px;font-weight:700;line-height:28px;text-align:center;">${i + 1}</div>
</td>
<td valign="top" style="padding:0 0 16px 0;">
<p style="margin:0;font-size:14px;font-weight:700;color:${color.ink};">${escapeHtml(title)}</p>
<p style="margin:2px 0 0 0;font-size:14px;line-height:21px;color:${color.muted};">${escapeHtml(body)}</p>
</td></tr>`,
    )
    .join("");

  const readyHtml = siteConfig.customerProvides.length
    ? `<h2 style="margin:8px 0 8px 0;font-size:17px;font-weight:700;color:${color.ink};">What to have ready</h2>
<ul style="margin:0 0 16px 0;padding-left:20px;font-size:14px;line-height:21px;color:${color.muted};">${siteConfig.customerProvides
        .map((item) => `<li style="margin:0 0 4px 0;">${escapeHtml(item)}</li>`)
        .join("")}</ul>`
    : "";

  const body = `${eyebrow("Request received")}
${heading(`Thanks, ${firstName(booking.name)}. Your slot is held.`)}
${paragraph(`We've reserved <strong style="color:${color.ink};">${escapeHtml(when)}</strong> for your ${escapeHtml(serviceName)}. Keep this email for your records.`)}
${referenceBlock(reference)}
${detailsTable(rows)}
${totalBlock(estimate, getEstimateNote(booking.service, booking.size))}
<h2 style="margin:0 0 16px 0;font-size:17px;font-weight:700;color:${color.ink};">What happens next</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${stepsHtml}</table>
${readyHtml}
${deposit ? paragraph(escapeHtml(deposit), "font-size:13px;line-height:20px;") : ""}
<h2 style="margin:8px 0 8px 0;font-size:17px;font-weight:700;color:${color.ink};">Need to reschedule?</h2>
${paragraph(`${escapeHtml(policy)} Call or text <a href="${siteConfig.phoneHref}" style="color:${color.brand};text-decoration:none;">${escapeHtml(siteConfig.phone)}</a> and quote ${escapeHtml(reference)}.`)}
${button(siteConfig.phoneHref, `Call ${siteConfig.phone}`)}`;

  const text = [
    `Thanks, ${firstName(booking.name)}. Your slot is held.`,
    "",
    `We've reserved ${when} for your ${serviceName}.`,
    "",
    `Booking reference: ${reference}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Estimated total: ${totalLabel(estimate)}`,
    getEstimateNote(booking.service, booking.size),
    "",
    "WHAT HAPPENS NEXT",
    ...steps.map(([title, body], i) => `${i + 1}. ${title}: ${body}`),
    ...(siteConfig.customerProvides.length
      ? ["", "WHAT TO HAVE READY", ...siteConfig.customerProvides.map((item) => `- ${item}`)]
      : []),
    ...(deposit ? ["", deposit] : []),
    "",
    "NEED TO RESCHEDULE?",
    `${policy} Call or text ${siteConfig.phone} and quote ${reference}.`,
    "",
    `${siteConfig.name}`,
    serviceAreaLine(),
    `${siteConfig.phone} · ${siteConfig.email}`,
  ].join("\n");

  return {
    subject,
    html: layout({
      preheader: `Reference ${reference}. ${bookingContactName} confirms within the hour.`,
      body,
    }),
    text,
  };
}

/* ------------------------------------------------------------------ */
/* Shop notification                                                   */
/* ------------------------------------------------------------------ */

export function renderBusinessNotificationEmail(input: BookingEmailInput): RenderedEmail {
  const { booking, estimate, reference } = input;
  const service = getService(booking.service);
  const when = formatAppointment(booking) ?? booking.date;
  const subject = `New booking ${reference}: ${service?.name ?? booking.service}, ${when}`;
  const rows = bookingRows(input, { internal: true });
  const confirmAction = booking.smsConsent
    ? `Text ${booking.phone} to confirm.`
    : `Call ${booking.phone} to confirm (no SMS consent).`;

  const body = `${eyebrow("New booking request")}
${heading(`${booking.name}, ${service?.name ?? booking.service}`)}
${paragraph(`${escapeHtml(when)}. ${escapeHtml(confirmAction)}`)}
${referenceBlock(reference)}
${detailsTable(rows)}
${totalBlock(estimate, getEstimateNote(booking.service, booking.size))}
${button(`tel:${toE164(booking.phone) ?? booking.phone}`, `Call ${firstName(booking.name)}`)}`;

  const text = [
    `New booking request ${reference}`,
    `${when}. ${confirmAction}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Estimated total: ${totalLabel(estimate)} (starting price)`,
  ].join("\n");

  return {
    subject,
    html: layout({ preheader: `${when} · ${totalLabel(estimate)}`, body }),
    text,
  };
}
