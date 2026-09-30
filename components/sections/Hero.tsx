import Image from "next/image";
import BookButton from "@/components/booking/BookButton";
import { LinkButton } from "@/components/ui/Buttons";
import { DICT, type Lang } from "@/lib/i18n";

/** Hero A · editorial frame (default variant from the prototype). Video on desktop, still image on mobile / reduced motion. */
export default function Hero({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden min-h-[100svh] grid grid-rows-[1fr_auto] px-page pt-[104px] pb-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[clamp(24px,4vw,64px)] items-center py-8">
        <div className="anim-rise" style={{ animationDelay: ".15s" }}>
          <p className="label text-olive m-0 mb-6 flex items-center gap-[14px]">
            <span className="inline-block w-8 h-px bg-wine" aria-hidden="true" />
            {t.place}
          </p>
          <h1 id="hero-title" className="font-serif font-light text-[clamp(64px,10.5vw,168px)] leading-[.9] tracking-[-.01em] m-0 mb-7">
            {t.h1a}
            <br />
            {t.h1b}
            <br />
            <em className="italic text-wine">{t.h1c}</em>
          </h1>
          <p className="max-w-[380px] text-[15px] leading-[1.65] text-ink m-0 mb-8">{t.heroSub}</p>
          <div className="flex gap-[14px] flex-wrap">
            <BookButton label={t.book} />
            <LinkButton href="#story" variant="textDark">
              {t.explore}
            </LinkButton>
          </div>
        </div>
        <figure className="m-0 relative p-[14px] border border-wine/35 anim-rise justify-self-end w-full max-w-[640px]" style={{ animationDelay: ".3s", animationDuration: "1.1s" }}>
          <div className="absolute inset-[6px] border border-wine/18 pointer-events-none" aria-hidden="true" />
          <div className="relative aspect-[4/3] overflow-hidden bg-wine-dark">
            <video
              data-inview-video
              data-start="1.5"
              src="/images/restaurant/bacchus-drone.mp4#t=1.5"
              poster="/images/restaurant/bacchus-from-the-sea-close.jpg"
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={t.heroVideoLabel}
              className="hero-video absolute inset-0 w-full h-full object-cover hidden lg:block"
            />
            <Image
              data-parallax="0.06"
              src="/images/restaurant/bacchus-from-the-sea-close.jpg"
              alt={t.heroImgAlt}
              fill
              priority
              sizes="(min-width: 1024px) 640px, 100vw"
              className="hero-img object-cover lg:hidden anim-zoom"
              style={{ objectPosition: "center 58%", height: "112%" }}
            />
          </div>
          <figcaption className="caption text-olive flex justify-between pt-3 px-[2px]">
            <span>{t.capTerrace}</span>
            <span>{t.placeShort}</span>
          </figcaption>
        </figure>
      </div>
      <div className="flex justify-between items-center text-[11px] tracking-[.16em] text-olive border-t border-wine-dark/12 pt-4">
        <span>{t.openLine}</span>
        <span className="font-serif italic text-[16px] tracking-normal">{t.scroll}</span>
      </div>
    </section>
  );
}
