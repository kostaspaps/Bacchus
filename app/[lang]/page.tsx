import type { Metadata } from "next";
import Catch from "@/components/sections/Catch";
import Evenings from "@/components/sections/Evenings";
import FindUs from "@/components/sections/FindUs";
import Footer from "@/components/sections/Footer";
import GallerySection from "@/components/sections/GallerySection";
import Guests from "@/components/sections/Guests";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Menu from "@/components/sections/Menu";
import MobileBar from "@/components/sections/MobileBar";
import Moment from "@/components/sections/Moment";
import Story from "@/components/sections/Story";
import Yana from "@/components/sections/Yana";
import { SITE_URL } from "@/lib/config";
import { isLang, localePath, type Lang } from "@/lib/i18n";

const META = {
  en: {
    title: "Bacchus Restaurant — Fresh fish & Corfiot cuisine on Messonghi Beach, Corfu",
    description:
      "Bacchus is a family-run Greek restaurant directly on Messonghi Beach, South Corfu. Fresh fish from local fishermen, Corfiot family recipes, tables by the Ionian Sea. Open May–October. Book a table via WhatsApp.",
    ogTitle: "Bacchus — A taste of Corfu, by the Ionian Sea",
    ogDescription: "Family-run restaurant on Messonghi Beach. Fresh fish, Corfiot recipes, Greek hospitality.",
  },
  el: {
    title: "Εστιατόριο Βάκχος — Φρέσκο ψάρι & κερκυραϊκή κουζίνα στην παραλία Μεσογγής, Κέρκυρα",
    description:
      "Ο Βάκχος είναι οικογενειακό εστιατόριο πάνω στην παραλία της Μεσογγής, στη νότια Κέρκυρα. Φρέσκο ψάρι από τους ντόπιους ψαράδες, κερκυραϊκές οικογενειακές συνταγές, τραπέζια δίπλα στο Ιόνιο. Ανοιχτά Μάιο–Οκτώβριο. Κράτηση μέσω WhatsApp.",
    ogTitle: "Βάκχος — Μια γεύση Κέρκυρας, δίπλα στο Ιόνιο",
    ogDescription: "Οικογενειακό εστιατόριο στην παραλία Μεσογγής. Φρέσκο ψάρι, κερκυραϊκές συνταγές, ελληνική φιλοξενία.",
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
      canonical: `${SITE_URL}${localePath(lang, "/")}`,
      languages: { en: `${SITE_URL}/`, el: `${SITE_URL}/el`, "x-default": `${SITE_URL}/` },
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}${localePath(lang, "/")}`,
      locale: lang === "el" ? "el_GR" : "en_GB",
      images: [{ url: "/og/home.jpg", width: 1200, height: 630, alt: "Bacchus taverna from the sea, Messonghi Beach" }],
    },
    twitter: { card: "summary_large_image", title: m.ogTitle, description: m.ogDescription, images: ["/og/home.jpg"] },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  return (
    <>
      <Header />
      <main id="top">
        <Hero lang={lang} />
        <Intro lang={lang} />
        <Story lang={lang} />
        <Yana lang={lang} />
        <Catch lang={lang} />
        <Menu lang={lang} />
        <Moment lang={lang} />
        <GallerySection lang={lang} />
        <Evenings lang={lang} />
        <Guests lang={lang} />
        <FindUs lang={lang} />
        <Footer />
      </main>
      <MobileBar />
    </>
  );
}
