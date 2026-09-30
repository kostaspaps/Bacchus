import messages from "@/content/messages.json";
import { WA_LINK, WHATSAPP_NUMBER } from "./config";
import type { Lang } from "./i18n";

export type BookingFields = {
  name: string;
  date: string;
  time: string;
  guests: number;
  hotel?: string;
  phone: string;
  notes?: string;
};

export function fill(template: string, vars: Record<string, string | number | undefined | null>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k];
    return v === undefined || v === null || v === "" ? "-" : String(v);
  });
}

/** Prefilled guest → Bacchus WhatsApp message (mirrors waText() in the prototype). */
export function waText(f: BookingFields, lang: Lang) {
  return fill(messages.whatsappRequest[lang], {
    name: f.name,
    date: f.date,
    time: f.time,
    guests: f.guests,
    hotel: f.hotel,
    phone: f.phone,
    notes: f.notes,
  });
}

export function waLink(f: BookingFields, lang: Lang) {
  return `${WA_LINK}?text=${encodeURIComponent(waText(f, lang))}`;
}

/** Owner → guest one-tap reply link (used in owner email and /admin). */
export function waReplyLink(guestPhoneE164: string, text: string) {
  const digits = guestPhoneE164.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Open a WhatsApp chat with Bacchus as directly as possible.
 *
 * - Phones/tablets: `wa.me` opens the WhatsApp app straight away.
 * - Computers: try the WhatsApp Desktop app first (`whatsapp://` scheme). If nothing
 *   picks it up within ~1.5 s (app not installed), fall back to WhatsApp Web with the
 *   same prefilled message. Never routes through the wa.me "Continue to chat" page.
 *
 * Returns the URL used so callers can keep an `href` for accessibility.
 */
export function openWhatsApp(text: string, phone: string = WHATSAPP_NUMBER) {
  const enc = encodeURIComponent(text);
  const mobileUrl = `https://wa.me/${phone}?text=${enc}`;
  if (typeof window === "undefined") return mobileUrl;

  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  if (isMobile) {
    window.location.href = mobileUrl;
    return mobileUrl;
  }

  const appUrl = `whatsapp://send?phone=${phone}&text=${enc}`;
  const webUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${enc}`;
  let switched = false;
  const onHide = () => {
    if (document.visibilityState === "hidden") switched = true;
  };
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("blur", onHide);
  const start = Date.now();
  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("blur", onHide);
    // If the desktop app took over, the tab lost focus/visibility (or the timer was delayed).
    if (!switched && Date.now() - start < 2500) window.open(webUrl, "_blank", "noopener");
  }, 1500);
  window.location.href = appUrl;
  return appUrl;
}
