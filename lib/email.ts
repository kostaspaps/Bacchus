import "server-only";
import messages from "@/content/messages.json";
import { DIRECTIONS_URL, PHONE_DISPLAY, PHONE_E164, SITE_URL, WHATSAPP_DISPLAY } from "./config";
import type { Lang } from "./i18n";
import { localeTag } from "./i18n";
import type { Reservation } from "./schema";
import { fill, waReplyLink } from "./whatsapp";
import { quickKey } from "./admin-session";

type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

const FROM = process.env.FROM_EMAIL || "bookings@bacchus.gr";
const FROM_NAME = "Bacchus Restaurant";

/**
 * Sends via Resend when RESEND_API_KEY is set, else via SMTP (IP.gr mailbox)
 * when SMTP_HOST is set, else logs and returns false.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const from = `${FROM_NAME} <${FROM}>`;
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: mail.replyTo,
    });
    if (error) {
      console.error("[email] resend failed", error);
      return false;
    }
    return true;
  }
  if (process.env.SMTP_HOST) {
    const nodemailer = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    try {
      await transport.sendMail({ from, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html, replyTo: mail.replyTo });
      return true;
    } catch (e) {
      console.error("[email] smtp failed", e);
      return false;
    }
  }
  console.warn("[email] no provider configured — skipped:", mail.subject);
  return false;
}

export function formatDate(date: string, lang: Lang) {
  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString(localeTag(lang), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch {
    return date;
  }
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

export function confirmText(r: Reservation, lang: Lang) {
  return fill(messages.ownerReplies.confirm[lang], { name: r.name, guests: r.guests, date: formatDate(r.date, lang), time: r.time });
}

export type OwnerReply = { key: string; label: string; text: string };
/** Ready-made WhatsApp replies for the owner (confirm / OK today / full → tomorrow / other time / please call / decline). */
export function ownerReplies(r: Reservation, lang: Lang): OwnerReply[] {
  const vars = { name: r.name, guests: r.guests, date: formatDate(r.date, lang), time: r.time, phone_restaurant: PHONE_DISPLAY };
  return Object.entries(messages.ownerReplies).map(([key, t]) => ({ key, label: t.label[lang], text: fill(t[lang], vars) }));
}

export function declineText(r: Reservation, lang: Lang, alternatives = "…") {
  return fill(messages.ownerReplyDecline[lang], { name: r.name, guests: r.guests, date: formatDate(r.date, lang), time: r.time, alternatives });
}

/** 1. Email to owner on every new request. */
export async function notifyOwner(r: Reservation) {
  const to = process.env.OWNER_EMAIL;
  if (!to) {
    console.warn("[email] OWNER_EMAIL not set — owner notification skipped");
    return false;
  }
  const lang = r.language;
  const wa = waReplyLink(r.phone, confirmText(r, lang));
  const call = `tel:${r.phone.replace(/[^\d+]/g, "")}`;
  const admin = `${SITE_URL}/admin/reservations/${r.id}`;
  const quick = `${SITE_URL}/q/${r.id.slice(0, 8)}/${await quickKey(r.id)}`;
  const subject = `Booking request · ${r.date} ${r.time} · ${r.guests} pax · ${r.name}`;
  const rows: [string, string][] = [
    ["Name", r.name],
    ["Date", `${r.date} (${formatDate(r.date, "en")})`],
    ["Time", r.time],
    ["Guests", String(r.guests)],
    ["Hotel", r.hotel || "-"],
    ["Phone", r.phone],
    ["Email", r.email || "-"],
    ["Special request", r.special_request || "-"],
    ["Language", lang === "el" ? "Greek" : "English"],
    ["Source", r.source],
    ["UTM", [r.utm_source, r.utm_medium, r.utm_campaign, r.utm_content, r.utm_term].filter(Boolean).join(" / ") || "-"],
    ["gclid", r.gclid || "-"],
    ["Received", new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Europe/Athens" })],
  ];
  const text = [
    "New table request",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Confirm or decline (one tap, emails the guest): ${quick}`,
    `Reply on WhatsApp: ${wa}`,
    `Call: ${call}`,
    `Admin: ${admin}`,
  ].join("\n");
  const html = `
<div style="font-family:Manrope,system-ui,sans-serif;color:#1B0B11;max-width:560px">
  <p style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#596441;margin:0 0 8px">Bacchus · table request</p>
  <h1 style="font-family:Georgia,serif;font-weight:300;font-size:28px;margin:0 0 20px">${esc(r.name)} · ${esc(r.date)} ${esc(r.time)} · ${r.guests} pax</h1>
  <table style="border-collapse:collapse;font-size:14px;width:100%">
    ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#596441;font-size:11px;letter-spacing:.16em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join("")}
  </table>
  <p style="margin:28px 0 12px"><a href="${quick}" style="display:inline-block;background:#596441;color:#F4EFE5;padding:14px 22px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;text-decoration:none">Confirm / decline</a>
  &nbsp; <a href="${wa}" style="display:inline-block;background:#4A1028;color:#F4EFE5;padding:14px 22px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;text-decoration:none">Reply on WhatsApp</a>
  &nbsp; <a href="${call}" style="display:inline-block;border:1px solid #1B0B11;color:#1B0B11;padding:13px 22px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;text-decoration:none">Call</a></p>
  <p style="font-size:12px;color:#596441">Confirm / decline updates the request and emails the guest automatically (if they gave an email). <a href="${admin}" style="color:#4A1028">Open in admin</a> · status: pending</p>
</div>`;
  return sendMail({ to, subject, text, html, replyTo: r.email || undefined });
}

/** 2. "We received your request" to the guest (only if an email was given). */
export async function notifyGuestReceived(r: Reservation) {
  if (!r.email) return false;
  const lang = r.language;
  const vars = {
    name: r.name,
    date: formatDate(r.date, lang),
    time: r.time,
    guests: r.guests,
    hotel: r.hotel,
    phone: r.phone,
    notes: r.special_request,
    whatsapp: WHATSAPP_DISPLAY,
    phone_restaurant: PHONE_DISPLAY,
  };
  const text = fill(messages.guestEmailBody[lang], vars);
  return sendMail({ to: r.email, subject: messages.guestEmailSubject[lang], text, html: textToHtml(text), replyTo: process.env.OWNER_EMAIL });
}

/** 4. Status change → confirmation / decline email to guest (if email present). */
export async function notifyGuestStatus(r: Reservation) {
  if (!r.email) return false;
  const lang = r.language;
  const vars = {
    name: r.name,
    date: formatDate(r.date, lang),
    time: r.time,
    guests: r.guests,
    whatsapp: WHATSAPP_DISPLAY,
    directions: DIRECTIONS_URL,
    phone_restaurant: PHONE_E164,
  };
  if (r.status === "confirmed") {
    const text = fill(messages.guestConfirmedBody[lang], vars);
    return sendMail({ to: r.email, subject: messages.guestConfirmedSubject[lang], text, html: textToHtml(text), replyTo: process.env.OWNER_EMAIL });
  }
  if (r.status === "declined") {
    const text = fill(messages.guestDeclinedBody[lang], vars);
    return sendMail({ to: r.email, subject: messages.guestDeclinedSubject[lang], text, html: textToHtml(text), replyTo: process.env.OWNER_EMAIL });
  }
  return false;
}

function textToHtml(text: string) {
  const body = esc(text).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color:#4A1028">$1</a>').replace(/\n/g, "<br>");
  return `<div style="font-family:Manrope,system-ui,sans-serif;color:#1B0B11;font-size:15px;line-height:1.7;max-width:560px">${body}</div>`;
}
