/**
 * Site configuration. Public values are read from NEXT_PUBLIC_* env vars with
 * the production defaults from the handoff spec. Never hardcode staff names
 * other than Dimitris (founder) and Yanna — see CHEF_NAME.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://bacchus.gr").replace(/\/$/, "");
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "306934693732";
export const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE || "+302661075301";
export const PHONE_DISPLAY = "+30 26610 75301";
export const WHATSAPP_DISPLAY = "+30 693 469 3732";
export const EMAIL = "info@bacchus.gr";
export const CHEF_NAME = process.env.NEXT_PUBLIC_CHEF_NAME || "The chef";

export const BOOKING_SLOTS = (process.env.NEXT_PUBLIC_BOOKING_SLOTS || process.env.BOOKING_SLOTS || "18:30,19:00,19:30,20:00,20:30,21:00,21:30,22:00")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const MAX_GUESTS = 20;

export const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Restaurant_Review-g1073595-d2572148-Reviews-Bacchus_Restaurant-Messonghi_Corfu_Ionian_Islands.html";
export const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=bacchus+messonghi";
export const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=Bacchus+Restaurant+Messonghi+Corfu";
export const MAP_EMBED_URL = "https://www.google.com/maps?q=Bacchus+Restaurant+Messonghi+Corfu&output=embed";
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
export const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export const ADDRESS = {
  street: "Messonghi Beach",
  locality: "Messonghi",
  region: "Corfu",
  postalCode: "49080",
  country: "GR",
};

/** Approximate — verify against the Google Business Profile pin before launch. */
export const GEO = { lat: 39.4857, lng: 19.9253 };

export const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const TEL_LINK = `tel:${PHONE_E164}`;
