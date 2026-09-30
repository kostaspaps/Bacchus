import { DICT, type Lang } from "@/lib/i18n";
import Plates from "./Plates";

export default function Menu({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section id="menu" aria-labelledby="menu-title" className="px-page py-section scroll-mt-16">
      <div className="flex justify-between items-end flex-wrap gap-6 mb-14">
        <div>
          <p data-reveal="up" className="label text-olive m-0 mb-6">
            {t.menuLabel}
          </p>
          <h2 id="menu-title" data-reveal="up" className="font-serif font-light text-[clamp(48px,6vw,96px)] leading-[.96] m-0">
            {t.menuH1}
            <br />
            <em className="italic text-wine">{t.menuH2}</em>
          </h2>
        </div>
      </div>
      <Plates />
    </section>
  );
}
