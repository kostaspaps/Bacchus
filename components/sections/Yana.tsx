import Image from "next/image";
import { Frame } from "@/components/ui/Frame";
import { DICT, type Lang } from "@/lib/i18n";

export default function Yanna({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section aria-labelledby="yana-title" className="px-page pb-[clamp(96px,12vw,160px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[clamp(40px,6vw,110px)] items-center">
      <div className="order-2">
        <p data-reveal="up" className="label text-olive m-0 mb-6">
          {t.yanaLabel}
        </p>
        <h2 id="yana-title" data-reveal="up" className="font-serif font-light text-[clamp(40px,4.6vw,72px)] leading-[1.02] m-0 mb-8">
          {t.yanaH1}
          <br />
          {t.yanaH2}
        </h2>
        <div data-reveal="up" className="grid gap-[18px] text-[15px] leading-[1.7] text-ink max-w-[480px]">
          <p className="m-0">{t.yana1}</p>
          <p className="m-0">{t.yana2}</p>
        </div>
      </div>
      <Frame caption={t.capEarly} captionRight={t.family} className="order-1 justify-self-end w-full max-w-[560px]">
        <div className="group relative aspect-[4/3] overflow-hidden">
          <Image
            src="/images/heritage/dimitris-and-yana-early-years.jpg"
            alt={t.earlyAlt}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover img-hover"
            style={{ objectPosition: "center 40%", filter: "sepia(.18) contrast(1.04)" }}
          />
        </div>
      </Frame>
    </section>
  );
}
