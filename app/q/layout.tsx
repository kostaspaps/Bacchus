import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin", "greek"], weight: ["400", "500", "600"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = { title: "Table request · Bacchus", robots: { index: false, follow: false } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F4EFE5" };

/** Owner one-tap pages (/q/<id>): phone-first, same look as the site, no nav. */
export default function QuickLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans bg-ivory text-wine-dark antialiased">{children}</body>
    </html>
  );
}
