import Image from "next/image";
import BookButton from "@/components/booking/BookButton";
import { DICT, type Lang } from "@/lib/i18n";

/** 04 · Food. Wine. Sea. Corfu. */
export default function Moment({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section aria-labelledby="moment-title" className="relative overflow-hidden bg-wine-dark text-ivory px-page py-[clamp(120px,16vw,220px)]">
      <div aria-hidden="true" className="absolute inset-0 opacity-[.09] grain" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-b from-wine/0 to-wine/80 anim-pour" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[40%] h-20 opacity-30 overflow-hidden">
        <svg viewBox="0 0 2400 80" preserveAspectRatio="none" className="w-[200%] h-full anim-wave-reverse">
          <path d="M0 40 Q150 10 300 40 T600 40 T900 40 T1200 40 T1500 40 T1800 40 T2100 40 T2400 40 V80 H0 Z" fill="#4A1028" />
        </svg>
      </div>
      <svg aria-hidden="true" viewBox="0 0 1200 600" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none opacity-55">
        <path d="M 1240 80 C 1000 120, 900 300, 700 260 S 400 100, 200 220 S 40 420, -40 380" fill="none" stroke="#B89457" strokeWidth="1" strokeDasharray="2600" strokeDashoffset="2600" className="anim-vine-slow" />
        <circle cx="700" cy="260" r="4" fill="#B89457" className="anim-shimmer" style={{ animationDuration: "4s" }} />
        <circle cx="200" cy="220" r="4" fill="#B89457" className="anim-shimmer" style={{ animationDuration: "4s", animationDelay: "2s" }} />
      </svg>
      <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,420px)_minmax(200px,320px)] gap-[clamp(32px,4vw,64px)] items-end">
        <h2 id="moment-title" data-reveal="left" className="font-serif font-light text-[clamp(72px,12vw,200px)] leading-[.88] tracking-[-.01em] m-0">
          {t.w1}
          <br />
          {t.w2}
          <br />
          {t.w3}
          <br />
          <em className="italic text-gold">{t.w4}</em>
        </h2>
        <div data-reveal="up" className="max-w-[420px] min-w-0">
          <p className="label opacity-70 m-0 mb-6">{t.wineLabel}</p>
          <p className="font-serif italic text-[clamp(26px,2.6vw,36px)] leading-[1.25] m-0 mb-6">{t.wineQuote}</p>
          <p className="text-[15px] leading-[1.7] opacity-85 m-0 mb-8">{t.wineBody}</p>
          <BookButton variant="outlineLight" label={t.book} />
        </div>
        <div aria-hidden="true" data-reveal="up" className="hidden lg:block justify-self-end w-full max-w-[320px] aspect-[3/4] p-[10px] border border-gold/35 arch anim-drift">
          <div className="relative w-full h-full overflow-hidden arch">
            <Image src="/images/restaurant/wedding-table-flowers.jpg" alt="" fill sizes="320px" className="object-cover" style={{ objectPosition: "center 35%", filter: "saturate(.85) sepia(.15)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
