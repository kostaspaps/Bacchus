/** Dial codes for the booking form's country selector. Greece first, then Bacchus's usual guests, then the rest A–Z. */
export type Country = { iso: string; name: string; dial: string; flag: string };

export const COUNTRIES: Country[] = [
  { iso: "GR", name: "Greece", dial: "30", flag: "🇬🇷" },
  { iso: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { iso: "DE", name: "Germany", dial: "49", flag: "🇩🇪" },
  { iso: "NL", name: "Netherlands", dial: "31", flag: "🇳🇱" },
  { iso: "IT", name: "Italy", dial: "39", flag: "🇮🇹" },
  { iso: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { iso: "AT", name: "Austria", dial: "43", flag: "🇦🇹" },
  { iso: "CH", name: "Switzerland", dial: "41", flag: "🇨🇭" },
  { iso: "BE", name: "Belgium", dial: "32", flag: "🇧🇪" },
  { iso: "IE", name: "Ireland", dial: "353", flag: "🇮🇪" },
  { iso: "PL", name: "Poland", dial: "48", flag: "🇵🇱" },
  { iso: "CZ", name: "Czechia", dial: "420", flag: "🇨🇿" },
  { iso: "SE", name: "Sweden", dial: "46", flag: "🇸🇪" },
  { iso: "NO", name: "Norway", dial: "47", flag: "🇳🇴" },
  { iso: "DK", name: "Denmark", dial: "45", flag: "🇩🇰" },
  { iso: "FI", name: "Finland", dial: "358", flag: "🇫🇮" },
  { iso: "US", name: "United States / Canada", dial: "1", flag: "🇺🇸" },
  { iso: "AL", name: "Albania", dial: "355", flag: "🇦🇱" },
  { iso: "AU", name: "Australia", dial: "61", flag: "🇦🇺" },
  { iso: "BG", name: "Bulgaria", dial: "359", flag: "🇧🇬" },
  { iso: "HR", name: "Croatia", dial: "385", flag: "🇭🇷" },
  { iso: "CY", name: "Cyprus", dial: "357", flag: "🇨🇾" },
  { iso: "EE", name: "Estonia", dial: "372", flag: "🇪🇪" },
  { iso: "HU", name: "Hungary", dial: "36", flag: "🇭🇺" },
  { iso: "IS", name: "Iceland", dial: "354", flag: "🇮🇸" },
  { iso: "IL", name: "Israel", dial: "972", flag: "🇮🇱" },
  { iso: "LV", name: "Latvia", dial: "371", flag: "🇱🇻" },
  { iso: "LT", name: "Lithuania", dial: "370", flag: "🇱🇹" },
  { iso: "LU", name: "Luxembourg", dial: "352", flag: "🇱🇺" },
  { iso: "MT", name: "Malta", dial: "356", flag: "🇲🇹" },
  { iso: "NZ", name: "New Zealand", dial: "64", flag: "🇳🇿" },
  { iso: "MK", name: "North Macedonia", dial: "389", flag: "🇲🇰" },
  { iso: "PT", name: "Portugal", dial: "351", flag: "🇵🇹" },
  { iso: "RO", name: "Romania", dial: "40", flag: "🇷🇴" },
  { iso: "RU", name: "Russia", dial: "7", flag: "🇷🇺" },
  { iso: "RS", name: "Serbia", dial: "381", flag: "🇷🇸" },
  { iso: "SK", name: "Slovakia", dial: "421", flag: "🇸🇰" },
  { iso: "SI", name: "Slovenia", dial: "386", flag: "🇸🇮" },
  { iso: "ZA", name: "South Africa", dial: "27", flag: "🇿🇦" },
  { iso: "ES", name: "Spain", dial: "34", flag: "🇪🇸" },
  { iso: "TR", name: "Türkiye", dial: "90", flag: "🇹🇷" },
  { iso: "UA", name: "Ukraine", dial: "380", flag: "🇺🇦" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", flag: "🇦🇪" },
];

/** Default selector value: Greek site → Greece, English site → United Kingdom. */
export function defaultIso(lang: string) {
  return lang === "el" ? "GR" : "GB";
}

/** Combine a selected country with what the guest typed. A full "+…" / "00…" number wins over the selector. */
export function composePhone(iso: string, typed: string) {
  const raw = typed.trim();
  if (raw.startsWith("+") || raw.startsWith("00")) return raw;
  const c = COUNTRIES.find((x) => x.iso === iso);
  const national = raw.replace(/[^\d]/g, "").replace(/^0+/, "");
  if (!c || !national) return raw;
  return `+${c.dial}${national}`;
}
