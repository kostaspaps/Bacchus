import Image from "next/image";
import catchItems from "@/content/catch.json";
import { Frame } from "@/components/ui/Frame";
import { DICT, type Lang } from "@/lib/i18n";

export default function Catch({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section id="sea" aria-labelledby="catch-title" className="relative overflow-hidden bg-sea text-ivory px-page py-section scroll-mt-16">
      <div aria-hidden="true" className="absolute inset-0 opacity-[.07] grain" />
      <div aria-hidden="true" className="absolute inset-x-0 -bottom-[2px] h-[120px] opacity-[.16] overflow-hidden">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none" className="w-[200%] h-full anim-wave">
          <path d="M0 60 Q150 20 300 60 T600 60 T900 60 T1200 60 T1500 60 T1800 60 T2100 60 T2400 60 V120 H0 Z" fill="#F4EFE5" />
        </svg>
      </div>
      <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-[clamp(40px,6vw,100px)] items-center">
        <div>
          <p data-reveal="up" className="label opacity-75 m-0 mb-6">
            {t.catchLabel}
          </p>
          <h2 id="catch-title" data-reveal="up" className="font-serif font-light text-[clamp(48px,6vw,96px)] leading-[.96] m-0 mb-7">
            {t.catchH1}
            <br />
            {t.catchH2}
          </h2>
          <p data-reveal="up" className="font-serif italic text-[clamp(22px,2.2vw,30px)] m-0 mb-7 max-w-[420px]">
            {t.catchQuote}
          </p>
          <p data-reveal="up" className="text-[15px] leading-[1.7] opacity-90 max-w-[440px] m-0 mb-9">
            {t.catchBody}
          </p>
          <ul data-reveal="up" className="list-none p-0 m-0 grid border-t border-ivory/25 max-w-[440px]">
            {catchItems.map((c) => (
              <li key={c.name.en} className="flex justify-between items-baseline py-4 border-b border-ivory/25 gap-4">
                <span className="font-serif text-[24px]">{c.name[lang]}</span>
                <span className="text-[11px] tracking-[.16em] uppercase opacity-75 text-right">{c.how[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-5 items-end">
          <Frame tone="sea" pad={10} reveal="mask" caption={t.capLangoustines} className="col-span-full">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image data-parallax="0.05" src="/images/food/seafood-tray-langoustines.jpg" alt={t.altLangoustines} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" style={{ objectPosition: "center 50%", height: "112%" }} />
            </div>
          </Frame>
          <Frame tone="sea" pad={10} caption={t.capGrill}>
            <div className="group relative aspect-[3/4] overflow-hidden">
              <Image src="/images/food/the-grill-fresh-fish.jpg" alt={t.altGrill} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover img-hover" style={{ objectPosition: "center 45%" }} />
            </div>
          </Frame>
          <Frame tone="sea" pad={10} caption={t.capBream}>
            <div className="group relative aspect-[3/4] overflow-hidden">
              <Image src="/images/food/whole-fish-grilled-veg.jpg" alt={t.altBream} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover img-hover" style={{ objectPosition: "center 48%" }} />
            </div>
          </Frame>
        </div>
      </div>
    </section>
  );
}
