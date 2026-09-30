import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin", "greek"], weight: ["400", "500", "600"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = { title: "Bacchus · Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans bg-ivory text-wine-dark antialiased">
        <main className="max-w-[1100px] mx-auto px-5 py-8">{children}</main>
      </body>
    </html>
  );
}
