import Image from "next/image";
import BookButton from "@/components/booking/BookButton";
import TrackedLink from "@/components/ui/TrackedLink";
import { DIRECTIONS_URL, EMAIL, MAP_EMBED_URL, PHONE_DISPLAY, TEL_LINK, WHATSAPP_DISPLAY } from "@/lib/config";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import { DICT, type Lang } from "@/lib/i18n";

export default function FindUs({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  const dt = "text-[10px] tracking-[.2em] uppercase opacity-60 pt-1";
  const link = "border-b border-ivory/40";
  return (
    <section id="find" aria-labelledby="find-title" className="relative bg-wine-dark text-ivory overflow-hidden scroll-mt-16">
      <div className="absolute inset-0">
        <Image data-parallax="0.08" src="/images/restaurant/bacchus-from-the-sea-wide.jpg" alt="" aria-hidden="true" fill sizes="100vw" className="object-cover opacity-50" style={{ objectPosition: "center 60%", height: "120%", top: "-10%" }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-wine-dark/96 via-wine-dark/70 via-55% to-wine-dark/35" aria-hidden="true" />
      <div className="relative px-page py-section grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-12 items-end">
        <div>
          <p data-reveal="up" className="label opacity-70 m-0 mb-6">
            {t.navFind}
          </p>
          <h2 id="find-title" data-reveal="up" className="font-serif font-light text-[clamp(48px,6vw,96px)] leading-[.96] m-0 mb-8">
            {t.findH1}
            <br />
            {t.findH2}
          </h2>
          <div data-reveal="up" className="flex gap-3 flex-wrap">
            <TrackedLink event="directions_click" href={DIRECTIONS_URL} target="_blank" rel="noopener" className="btn bg-ivory text-wine-dark hover:bg-terracotta hover:text-ivory px-7 py-4">
              {t.directions}
            </TrackedLink>
            <BookButton variant="outlineLight" label={t.book} />
          </div>
        </div>
        <dl data-reveal="up" className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-[14px] text-[14px] leading-[1.5] content-end">
          <dt className={dt}>{t.where}</dt>
          <dd className="m-0">
            {t.address}
            <br />
            <span className="opacity-70">{t.addressHint}</span>
          </dd>
          <dt className={dt}>{t.hours}</dt>
          <dd className="m-0">
            {t.hoursLine}
            <br />
            <span className="opacity-70">{t.season}</span>
          </dd>
          <dt className={dt}>{t.phone}</dt>
          <dd className="m-0">
            <TrackedLink event="phone_click" href={TEL_LINK} className={link}>
              {PHONE_DISPLAY}
            </TrackedLink>
          </dd>
          <dt className={dt}>WhatsApp</dt>
          <dd className="m-0">
            <WhatsAppLink className={link}>
              {WHATSAPP_DISPLAY}
            </WhatsAppLink>
          </dd>
          <dt className={dt}>Email</dt>
          <dd className="m-0">
            <a href={`mailto:${EMAIL}`} className={link}>
              {EMAIL}
            </a>
          </dd>
        </dl>
      </div>
      <iframe title={t.mapTitle} src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="relative block w-full h-[360px] border-0" style={{ filter: "grayscale(1) contrast(1.05) opacity(.9)" }} />
    </section>
  );
}
