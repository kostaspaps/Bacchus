import hours from "@/content/hours.json";
import { ADDRESS, EMAIL, FACEBOOK_URL, GEO, INSTAGRAM_URL, PHONE_E164, SITE_URL, TRIPADVISOR_URL } from "./config";

export function openingHoursSpecification(year = new Date().getFullYear()) {
  const validFrom = `${year}-${hours.seasonStart}`;
  const validThrough = `${year}-${hours.seasonEnd}`;
  return [hours.regular, hours.monday].map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
    validFrom,
    validThrough,
  }));
}

export function restaurantJsonLd() {
  const sameAs = [TRIPADVISOR_URL, INSTAGRAM_URL, FACEBOOK_URL].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: "Bacchus Restaurant",
    alternateName: ["Tavern Bacchus", "Ταβέρνα Βάκχος"],
    url: SITE_URL,
    image: [
      `${SITE_URL}/images/restaurant/terrace-interior.jpg`,
      `${SITE_URL}/images/restaurant/pier-messonghi.jpg`,
      `${SITE_URL}/images/restaurant/bacchus-from-the-sea-close.jpg`,
    ],
    logo: `${SITE_URL}/images/heritage/bacchus_logo.png`,
    telephone: PHONE_E164,
    email: EMAIL,
    servesCuisine: ["Greek", "Corfiot", "Seafood", "Mediterranean"],
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
    openingHoursSpecification: openingHoursSpecification(),
    acceptsReservations: "True",
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/book`,
        actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
      },
      result: { "@type": "FoodEstablishmentReservation", name: "Table request" },
    },
    hasMenu: `${SITE_URL}/#menu`,
    sameAs,
  };
}
