import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Noto_Serif_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import AnalyticsScripts from "@/components/analytics/Scripts";
import Effects from "@/components/Effects";
import { LangProvider } from "@/components/LangProvider";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { GTM_ID, SITE_URL } from "@/lib/config";
import { LANGS, htmlLang, isLang, type Lang } from "@/lib/i18n";
import { restaurantJsonLd } from "@/lib/jsonld";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
/*
 * Greek headline face: Cormorant Garamond has no Greek glyphs, so --font-serif (globals.css) lists
 * "Cormorant Garamond" then "Noto Serif Display" by literal family name. Latin resolves to Cormorant,
 * Greek falls through to Noto Light. Literal names skip next/font's local "Fallback" faces, which
 * carry no unicode-range and would otherwise capture the other script.
 */
const greekSerif = Noto_Serif_Display({
  subsets: ["greek"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-greek-serif",
  display: "swap",
  adjustFontFallback: false,
});
const manrope = Manrope({ subsets: ["latin", "greek"], weight: ["300", "400", "500", "600"], variable: "--font-manrope", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#F4EFE5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Bacchus Restaurant",
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: { type: "website", siteName: "Bacchus Restaurant" },
  twitter: { card: "summary_large_image" },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang: Lang = raw;
  return (
    <html lang={htmlLang(lang)} className={`${cormorant.variable} ${greekSerif.variable} ${manrope.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }} />
      </head>
      <body className="font-sans bg-ivory text-wine-dark antialiased">
        {GTM_ID && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="gtm" />
          </noscript>
        )}
        <LangProvider lang={lang}>
          <BookingProvider>{children}</BookingProvider>
        </LangProvider>
        <Effects />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
