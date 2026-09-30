import Image from "next/image";
import { DICT, type Lang } from "@/lib/i18n";

export default function Intro({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section id="story" aria-labelledby="intro-title" className="relative overflow-hidden text-center px-page py-[clamp(96px,14vw,180px)] scroll-mt-16">
      <p aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(160px,28vw,420px)] leading-none text-wine/[.045] tracking-[.1em] m-0 pointer-events-none select-none whitespace-nowrap">
        ΒΑΚΧΟΣ
      </p>
      <svg aria-hidden="true" viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
        <path d="M -20 300 C 200 260, 300 120, 520 180 S 800 320, 1000 160 S 1150 80, 1240 140" fill="none" stroke="#596441" strokeWidth="1" strokeDasharray="2400" strokeDashoffset="2400" className="anim-vine opacity-50" />
        <path d="M 300 150 c -12 -22 6 -40 22 -32 c 8 -20 32 -14 30 6 c 18 -6 30 14 16 28 c -20 14 -54 16 -68 -2 z" fill="#4A1028" opacity=".35" className="anim-shimmer" />
        <path d="M 900 250 c -12 -22 6 -40 22 -32 c 8 -20 32 -14 30 6 c 18 -6 30 14 16 28 c -20 14 -54 16 -68 -2 z" fill="#4A1028" opacity=".35" className="anim-shimmer" style={{ animationDelay: "2s" }} />
      </svg>
      <div data-reveal="up" className="relative inline-block p-[18px] border border-wine/30 arch mb-7">
        <Image src="/images/heritage/bacchus_logo.png" alt={t.emblemAlt} width={83} height={70} className="block drop-shadow-[0_6px_16px_rgba(74,16,40,.18)]" />
      </div>
      <p data-reveal="up" className="relative text-[11px] tracking-[.28em] uppercase text-olive m-0 mb-8">
        {t.introLabel}
      </p>
      <h2 id="intro-title" data-reveal="up" className="relative font-serif font-light text-[clamp(34px,4.4vw,68px)] leading-[1.15] max-w-[920px] mx-auto mb-7">
        {t.introH}
      </h2>
      <p data-reveal="up" className="relative font-serif italic text-[clamp(22px,2.4vw,32px)] text-wine m-0">
        {t.introSub}
      </p>
    </section>
  );
}
