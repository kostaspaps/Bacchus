import Image from "next/image";
import { Frame } from "@/components/ui/Frame";
import { DICT, type Lang } from "@/lib/i18n";
import Album from "./Album";

export default function Story({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section aria-labelledby="story-title" className="px-page pb-[clamp(96px,12vw,160px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[clamp(40px,6vw,110px)] items-center">
      <div className="grid gap-5 min-w-0">
        <Frame arch caption={t.capDimitris} captionCenter>
          <div className="group relative aspect-[4/5] arch overflow-hidden">
            <Image src="/images/heritage/dimitris-taverna-sign.jpg" alt={t.dimitrisAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover img-hover" style={{ objectPosition: "center 30%" }} />
          </div>
        </Frame>
        <Album />
      </div>
      <div>
        <p data-reveal="up" className="label text-olive m-0 mb-6">
          {t.storyLabel}
        </p>
        <h2 id="story-title" data-reveal="up" className="font-serif font-light text-[clamp(40px,4.6vw,72px)] leading-[1.02] m-0 mb-8">
          {t.storyH1}
          <br />
          {t.storyH2}
          <br />
          {t.storyH3}
        </h2>
        <div data-reveal="up" className="grid gap-[18px] text-[15px] leading-[1.7] text-ink max-w-[480px]">
          <p className="m-0">{t.story1}</p>
          <p className="m-0">{t.story2}</p>
          <p className="m-0">{t.story3}</p>
        </div>
        <p data-reveal="up" className="font-serif italic text-[22px] text-wine mt-8 m-0">
          {t.signature}
        </p>
      </div>
    </section>
  );
}
