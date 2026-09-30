import Gallery from "@/components/gallery/Gallery";
import { DICT, type Lang } from "@/lib/i18n";

export default function GallerySection({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="px-page py-section scroll-mt-16">
      <div className="flex justify-between items-end flex-wrap gap-6 mb-0">
        <div>
          <p data-reveal="up" className="label text-olive m-0 mb-6">
            {t.galLabel}
          </p>
          <h2 id="gallery-title" data-reveal="up" className="font-serif font-light text-[clamp(48px,6vw,96px)] leading-[.96] m-0 mb-8 lg:mb-0">
            {t.galH1}
            <br />
            <em className="italic text-wine">{t.galH2}</em>
          </h2>
        </div>
        <Gallery />
      </div>
    </section>
  );
}
