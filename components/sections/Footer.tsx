"use client";
import Image from "next/image";
import { useLang } from "@/components/LangProvider";
import { useBooking } from "@/components/booking/BookingProvider";
import { DIRECTIONS_URL, EMAIL, FACEBOOK_URL, INSTAGRAM_URL, TRIPADVISOR_URL } from "@/lib/config";

export default function Footer() {
  const { t } = useLang();
  const { open } = useBooking();
  const navCls = "grid gap-3 text-[12px] tracking-[.16em] uppercase";
  return (
    <footer className="bg-wine-dark text-ivory pt-16 px-page pb-[120px] lg:pb-10 border-t border-ivory/12">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-10 items-start">
        <div>
          <Image src="/images/heritage/bacchus_logo.png" alt="" aria-hidden="true" width={56} height={47} className="object-contain block mb-[14px]" />
          <p className="font-serif text-[32px] tracking-[.18em] m-0 mb-2">BACCHUS</p>
          <p className="text-[11px] tracking-[.2em] uppercase opacity-60 m-0">{t.footerPlace}</p>
        </div>
        <nav aria-label="Footer" className={navCls}>
          <a href="#story">{t.navStory}</a>
          <a href="#sea">{t.navSea}</a>
          <a href="#menu">{t.navMenu}</a>
          <a href="#gallery">{t.navGallery}</a>
          <a href="#find">{t.navFind}</a>
        </nav>
        <nav aria-label="Actions" className={navCls}>
          <button type="button" onClick={open} className="bg-transparent border-0 text-inherit p-0 text-left text-[12px] tracking-[.16em] uppercase">
            {t.reservations}
          </button>
          <a href={DIRECTIONS_URL} target="_blank" rel="noopener">
            {t.directionsShort}
          </a>
          <a href={`mailto:${EMAIL}`}>{t.contact}</a>
        </nav>
        <nav aria-label="Social" className={navCls}>
          {INSTAGRAM_URL && (
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="opacity-80">
              Instagram
            </a>
          )}
          {FACEBOOK_URL && (
            <a href={FACEBOOK_URL} target="_blank" rel="noopener" className="opacity-80">
              Facebook
            </a>
          )}
          <a href={TRIPADVISOR_URL} target="_blank" rel="noopener" className="opacity-80">
            TripAdvisor
          </a>
        </nav>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4 mt-14 pt-6 border-t border-ivory/12 text-[11px] tracking-[.14em] opacity-60">
        <span>© {new Date().getFullYear()} Bacchus Restaurant</span>
        <span className="font-serif italic text-[18px] tracking-normal opacity-100">{t.seeYou}</span>
      </div>
    </footer>
  );
}
