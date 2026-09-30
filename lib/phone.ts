/**
 * Normalise a guest phone number to E.164 ("+306934693732") so the owner's
 * "Reply on WhatsApp" / "Call" links always work.
 *
 * Accepts "+30 693 469 3732", "0030 693…", "(+44) 7700-900123". A bare Greek
 * mobile ("69xxxxxxxx") gets +30. Anything else without a country code returns
 * null so the UI can ask for it.
 */
export function normalizePhone(raw: string): string | null {
  let s = (raw || "").trim().replace(/[\s().\- ]/g, "");
  if (s.startsWith("00")) s = "+" + s.slice(2);
  if (/^\+?[0-9]{10}$/.test(s) && /^\+?69/.test(s)) s = "+30" + s.replace(/^\+/, "");
  if (!s.startsWith("+")) return null;
  const digits = s.slice(1);
  if (!/^[1-9][0-9]{7,14}$/.test(digits)) return null;
  return "+" + digits;
}
