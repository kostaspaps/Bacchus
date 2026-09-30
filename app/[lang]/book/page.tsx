import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookPage from "@/components/booking/BookPage";
import MobileBar from "@/components/sections/MobileBar";
import TrackedLink from "@/components/ui/TrackedLink";
import { DIRECTIONS_URL, PHONE_DISPLAY, SITE_URL, TEL_LINK } from "@/lib/config";
import { DICT, isLang, localePath, type Lang } from "@/lib/i18n";

const META = {
  en: {
    title: "Book a table — Bacchus, dinner by the sea in Messonghi, Corfu",
    description: "Request a table at Bacchus, a family-run seafood taverna on Messonghi Beach, Corfu. Fresh fish, Corfiot cuisine, waterfront tables. Confirmed by WhatsApp.",
  },
  el: {
    title: "Κράτηση τραπεζιού — Βάκχος, δείπνο δίπλα στη θάλασσα στη Μεσογγή, Κέρκυρα",
    description: "Κάντε αίτημα για τραπέζι στον Βάκχο, οικογενειακή ψαροταβέρνα στην παραλία Μεσογγής, Κέρκυρα. Φρέσκο ψάρι, κερκυραϊκή κουζίνα, τραπέζια στο κύμα. Επιβεβαίωση μέσω WhatsApp.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const m = META[lang];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${SITE_URL}${localePath(lang, "/book")}`,
      languages: { en: `${SITE_URL}/book`, el: `${SITE_URL}/el/book`, "x-default": `${SITE_URL}/book` },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${SITE_URL}${localePath(lang, "/book")}`,
      locale: lang === "el" ? "el_GR" : "en_GB",
      images: [{ url: "/og/book.jpg", width: 1200, height: 630, alt: "Table by the sea at Bacchus, Messonghi" }],
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images: ["/og/book.jpg"] },
  };
}

export default async function Book({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = DICT[lang];
  const home = localePath(lang, "/");
  return (
    <>
      <main id="top" className="min-h-[100svh] grid grid-cols-[repeat(auto-fit,minmax(min(100%,512px),1fr))]">
        <section aria-label="Bacchus" className="relative lg:sticky top-0 self-start bg-wine-dark text-ivory min-h-[44svh] lg:min-h-[100svh] flex flex-col justify-between py-6 pb-10 px-page overflow-hidden">
          <Image src="/images/restaurant/wedding-table-sea.jpg" alt="" aria-hidden="true" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-55" style={{ objectPosition: "center 45%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-wine-dark/50 via-wine-dark/20 via-45% to-wine-dark/92" aria-hidden="true" />
          <Link href={home} className="relative font-serif text-[24px] tracking-[.18em] flex items-center gap-3">
            <Image src="/images/heritage/bacchus_logo.png" alt="" aria-hidden="true" width={34} height={29} className="object-contain" />
            BACCHUS
          </Link>
          <div className="relative anim-rise" style={{ animationDuration: ".9s" }}>
            <p className="label opacity-80 m-0 mb-4">{t.place}</p>
            <h1 className="font-serif font-light text-[clamp(44px,6vw,88px)] leading-[.95] m-0 mb-5">
              {t.bpTitle1}
              <br />
              {t.bpTitle2}
            </h1>
            <p className="text-[13px] tracking-[.14em] uppercase opacity-85 m-0 mb-5">{t.bpStrap}</p>
            <div className="flex gap-5 flex-wrap text-[13px] opacity-85">
              <TrackedLink event="phone_click" href={TEL_LINK} className="border-b border-ivory/40">
                {PHONE_DISPLAY}
              </TrackedLink>
              <TrackedLink event="directions_click" href={DIRECTIONS_URL} target="_blank" rel="noopener" className="border-b border-ivory/40">
                {t.bpDirections}
              </TrackedLink>
              <span>{t.bpOpen}</span>
            </div>
          </div>
        </section>
        <section id="book-form" aria-labelledby="book-title" className="px-page pt-[clamp(28px,4vw,56px)] pb-[120px] lg:pb-14 flex items-center scroll-mt-4">
          <div className="w-full max-w-[520px] mx-auto anim-rise" style={{ animationDuration: ".9s", animationDelay: ".15s" }}>
            <BookPage />
            <p className="mt-10 m-0 text-[11px] tracking-[.16em] uppercase text-olive flex gap-4 flex-wrap">
              <TrackedLink event="menu_view" href={`${home}#menu`} className="border-b border-current">
                {t.bpSeeMenu}
              </TrackedLink>
              <Link href={home} className="border-b border-current">
                {t.bpExplore}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <MobileBar bookHref="#book-form" />
    </>
  );
}
