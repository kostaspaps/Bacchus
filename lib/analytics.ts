"use client";

export type AnalyticsEvent =
  | "view_booking"
  | "start_booking"
  | "submit_booking"
  | "whatsapp_booking_click"
  | "directions_click"
  | "phone_click"
  | "menu_view";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "bacchus:utm";

/** Read UTM/gclid from the URL and persist for the session (called once per page load). */
export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fresh: Utm = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) fresh[k] = v.slice(0, 200);
  });
  try {
    if (Object.keys(fresh).length) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Utm) : {};
  } catch {
    return fresh;
  }
}

export function getUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Utm) : {};
  } catch {
    return {};
  }
}

export function track(event: AnalyticsEvent, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}
