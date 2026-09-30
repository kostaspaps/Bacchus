import reviews from "@/content/reviews.json";
import { GOOGLE_REVIEWS_URL, TRIPADVISOR_URL } from "@/lib/config";
import { DICT, type Lang } from "@/lib/i18n";

export default function Guests({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  const link = "btn border border-wine-dark text-wine-dark hover:bg-wine-dark hover:text-ivory px-[22px] py-[14px] text-[11px]";
  return (
    <section aria-labelledby="guests-title" className="px-page py-section border-t border-wine-dark/12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-12 items-start">
      <div>
        <h2 id="guests-title" data-reveal="up" className="font-serif font-light text-[clamp(44px,5.5vw,88px)] leading-[.98] m-0 mb-6">
          {t.guestH1}
          <br />
          <em className="italic text-wine">{t.guestH2}</em>
        </h2>
        <p data-reveal="up" className="text-[15px] leading-[1.7] text-ink max-w-[420px] m-0 mb-7">
          {t.guestBody}
        </p>
        <div data-reveal="up" className="flex gap-3 flex-wrap">
          <a href={TRIPADVISOR_URL} target="_blank" rel="noopener" className={link}>
            TripAdvisor ↗
          </a>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener" className={link}>
            {t.googleReviews} ↗
          </a>
        </div>
      </div>
      <div className="grid gap-6">
        {reviews.map((r) => (
          <blockquote key={r.text} data-reveal="up" className="m-0 p-7 border border-wine/30 bg-white/35" lang="en">
            <p className="font-serif text-[24px] leading-[1.35] m-0 mb-4">“{r.text}”</p>
            <footer className="text-[11px] tracking-[.16em] uppercase text-olive">{t.reviewBy}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
