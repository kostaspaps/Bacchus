import { SITE_URL } from "./config";
import { formatDate, confirmText } from "./email";
import type { Reservation } from "./schema";
import { waReplyLink } from "./whatsapp";

/**
 * Push a new table request into the owner's WhatsApp (server-side, guest needs no WhatsApp).
 *
 * Providers, checked in order:
 *  1. Meta WhatsApp Cloud API — WHATSAPP_CLOUD_TOKEN + WHATSAPP_CLOUD_PHONE_ID (+ optional
 *     WHATSAPP_CLOUD_TEMPLATE for business-initiated messages outside the 24 h window).
 *  2. CallMeBot (free personal bridge) — CALLMEBOT_APIKEY.
 * Recipient for both: WHATSAPP_OWNER_NUMBER (digits only, e.g. 306934693732).
 *
 * Never throws; returns false when nothing is configured or the send fails.
 */
export async function notifyOwnerWhatsApp(r: Reservation): Promise<boolean> {
  const to = (process.env.WHATSAPP_OWNER_NUMBER || "").replace(/[^\d]/g, "");
  if (!to) return false;

  const text = ownerWhatsAppText(r);

  if (process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_CLOUD_PHONE_ID) {
    return sendViaCloudApi(to, text, r);
  }
  if (process.env.CALLMEBOT_APIKEY) {
    return sendViaCallMeBot(to, text);
  }
  console.warn("[whatsapp] no provider configured — owner WhatsApp skipped");
  return false;
}

export function ownerWhatsAppText(r: Reservation) {
  const lines = [
    `🍷 New table request`,
    `${r.name} · ${r.guests} pax`,
    `${formatDate(r.date, "en")} · ${r.time}`,
    r.hotel ? `Hotel: ${r.hotel}` : null,
    `Phone: ${r.phone}`,
    r.email ? `Email: ${r.email}` : null,
    r.special_request ? `Note: ${r.special_request}` : null,
    ``,
    `Reply: ${waReplyLink(r.phone, confirmText(r, r.language))}`,
    `Admin: ${SITE_URL}/admin/reservations/${r.id}`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

async function sendViaCloudApi(to: string, text: string, r: Reservation) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN!;
  const phoneId = process.env.WHATSAPP_CLOUD_PHONE_ID!;
  const template = process.env.WHATSAPP_CLOUD_TEMPLATE;
  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
  const body = template
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_CLOUD_TEMPLATE_LANG || "en" },
          components: [
            {
              type: "body",
              parameters: [r.name, String(r.guests), `${r.date} ${r.time}`, r.phone, r.hotel || "-"].map((v) => ({ type: "text", text: v })),
            },
          ],
        },
      }
    : { messaging_product: "whatsapp", to, type: "text", text: { body: text, preview_url: false } };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("[whatsapp] cloud api failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[whatsapp] cloud api error", e);
    return false;
  }
}

async function sendViaCallMeBot(to: string, text: string) {
  const key = process.env.CALLMEBOT_APIKEY!;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(to)}&apikey=${encodeURIComponent(key)}&text=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const t = await res.text();
    if (!res.ok || /error|invalid|not found/i.test(t)) {
      console.error("[whatsapp] callmebot failed", res.status, t.slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[whatsapp] callmebot error", e);
    return false;
  }
}
