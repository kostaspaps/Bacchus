import { SITE_URL } from "./config";
import { formatDate, confirmText } from "./email";
import type { Reservation } from "./schema";
import { waReplyLink } from "./whatsapp";
import { quickKey } from "./admin-session";

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

  const text = await ownerWhatsAppText(r);

  if (process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_CLOUD_PHONE_ID) {
    return sendViaCloudApi(to, text, r);
  }
  if (process.env.CALLMEBOT_APIKEY) {
    return sendViaCallMeBot(to, text);
  }
  console.warn("[whatsapp] no provider configured — owner WhatsApp skipped");
  return false;
}

export async function ownerWhatsAppText(r: Reservation) {
  const quick = `${SITE_URL}/q/${r.id}/${await quickKey(r.id)}`;
  const wa = waReplyLink(r.phone, confirmText(r, r.language));
  const guests = r.guests === 1 ? "1 guest" : `${r.guests} guests`;
  const lines = [
    `🍷 *Bacchus – new table request!*`,
    ``,
    `👤 *${r.name}* · ${guests}`,
    `📅 ${formatDate(r.date, "en")} at *${r.time}*`,
    r.hotel ? `🏨 ${r.hotel}` : null,
    `📞 ${r.phone}`,
    r.email ? `✉️ ${r.email}` : null,
    r.special_request ? `📝 "${r.special_request}"` : null,
    r.language === "el" ? `🇬🇷 Greek-speaking guest` : null,
    ``,
    `✅ Confirm or ❌ decline with one tap (the guest gets an email automatically):`,
    quick,
    ``,
    `💬 Or reply on WhatsApp:`,
    wa,
    ``,
    `Καλή δουλειά! 🌊`,
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
