import messages from "@/content/messages.json";
import { WA_LINK } from "./config";
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
