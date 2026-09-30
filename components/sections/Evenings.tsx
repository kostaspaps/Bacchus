import Image from "next/image";
import BookButton from "@/components/booking/BookButton";
import { Frame } from "@/components/ui/Frame";
import { DICT, type Lang } from "@/lib/i18n";

export default function Evenings({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section aria-labelledby="eve-title" className="bg-wine-dark text-ivory px-page py-section grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-[clamp(40px,6vw,100px)] items-center">
      <div>
        <p data-reveal="up" className="label opacity-70 m-0 mb-6">
          {t.eveLabel}
        </p>
        <h2 id="eve-title" data-reveal="up" className="font-serif font-light text-[clamp(44px,5.5vw,88px)] leading-[.98] m-0 mb-7">
          {t.eveH1}
          <br />
          {t.eveH2}
          <br />
          <em className="italic text-gold">{t.eveH3}</em>
        </h2>
        <p data-reveal="up" className="text-[15px] leading-[1.7] opacity-85 max-w-[440px] m-0 mb-8">
          {t.eveBody}
        </p>
        <div data-reveal="up">
          <BookButton variant="outlineLight" label={t.planBtn} />
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-5 items-end justify-self-end w-full max-w-[640px]">
        <Frame tone="gold" pad={10} caption={t.capGreekNight}>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image src="/images/restaurant/greek-night-dancers.jpg" alt={t.altGreekNight} fill sizes="(min-width: 1024px) 320px, 50vw" className="object-cover" />
          </div>
        </Frame>
        <Frame tone="gold" pad={10} caption={t.capDancing}>
          <div className="relative aspect-[3/4] overflow-hidden bg-black">
            <video data-inview-video src="/images/restaurant/dancing.mp4" muted loop playsInline preload="metadata" aria-label={t.altDancing} className="w-full h-full object-cover block" />
          </div>
        </Frame>
      </div>
    </section>
  );
}
