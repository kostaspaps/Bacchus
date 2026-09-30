"use client";
import type { AnchorHTMLAttributes } from "react";
import { WA_LINK } from "@/lib/config";
import { openWhatsApp } from "@/lib/whatsapp";

/** Link to the Bacchus WhatsApp that opens the app directly (phone or desktop) instead of the wa.me interstitial. */
export default function WhatsAppLink({ text = "", onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { text?: string }) {
  return (
    <a
      href={WA_LINK}
      rel="noopener"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        openWhatsApp(text);
      }}
    />
  );
}
