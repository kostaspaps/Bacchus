"use client";
import { useLang } from "@/components/LangProvider";
import { useBooking } from "@/components/booking/BookingProvider";
import { track } from "@/lib/analytics";
import { DIRECTIONS_URL, TEL_LINK } from "@/lib/config";

/** Sticky CALL | DIRECTIONS | BOOK bar, mobile & tablet only. */
export default function MobileBar({ bookHref }: { bookHref?: string }) {
  const { t } = useLang();
  const { open } = useBooking();
  const item = "flex items-center justify-center min-h-14 text-[11px] tracking-[.18em] uppercase font-semibold";
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-[60] grid grid-cols-[1fr_1fr_1.6fr] bg-wine-dark text-ivory border-t border-ivory/15 pb-[env(safe-area-inset-bottom)]">
      <a href={TEL_LINK} onClick={() => track("phone_click")} className={item}>
        {t.call}
      </a>
      <a href={DIRECTIONS_URL} target="_blank" rel="noopener" onClick={() => track("directions_click")} className={`${item} border-l border-ivory/15`}>
        {t.directionsShort}
      </a>
      {bookHref ? (
        <a href={bookHref} className={`${item} bg-wine text-[12px]`}>
          {t.bpBook}
        </a>
      ) : (
        <button type="button" onClick={open} className={`${item} bg-wine border-0 text-ivory text-[12px]`}>
          {t.book}
        </button>
      )}
    </div>
  );
}
