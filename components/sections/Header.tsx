"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import BookButton from "@/components/booking/BookButton";
import { localePath } from "@/lib/i18n";

const NAV = [
  ["#story", "navStory"],
  ["#sea", "navSea"],
  ["#menu", "navMenu"],
  ["#gallery", "navGallery"],
  ["#find", "navFind"],
] as const;

export default function Header() {
  const { lang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const langLink = (l: "en" | "el", label: string) => (
    <Link
      href={localePath(l, "/")}
      hrefLang={l === "el" ? "el" : "en"}
      lang={l === "el" ? "el" : "en"}
      aria-current={lang === l ? "true" : undefined}
      className={`p-2 -m-2 ${lang === l ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between py-4 px-page text-wine-dark transition-[background-color,color] duration-500 ${scrolled ? "bg-ivory/88 backdrop-blur-md" : "bg-transparent"}`}
      >
        <a href="#top" className="font-serif text-[26px] tracking-[.18em] font-medium flex items-center gap-3">
          <Image src="/images/heritage/bacchus_logo.png" alt="" aria-hidden="true" width={36} height={30} className="object-contain" />
          {t.brand}
        </a>
        <nav aria-label="Primary" className="hidden lg:flex gap-[clamp(18px,2.4vw,32px)] text-[12px] tracking-[.16em] uppercase font-medium">
          {NAV.map(([href, key]) => (
            <a key={href} href={href} className="opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap">
              {t[key]}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <div className="flex gap-[10px] text-[11px] tracking-[.14em] font-semibold" aria-label="Language">
            {langLink("en", "EN")}
            <span className="opacity-40">/</span>
            {langLink("el", "GR")}
          </div>
          <div className="hidden lg:block">
            <BookButton variant="ghostNav" label={t.book} />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t.menuLabelA11y}
            aria-expanded={menuOpen}
            className="lg:hidden bg-transparent border-0 text-current flex flex-col gap-[6px] p-2 -mr-2 min-w-11 min-h-11 justify-center items-center"
          >
            <span className={`block w-[26px] h-px bg-current transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block w-[26px] h-px bg-current transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[49] bg-wine-dark text-ivory flex flex-col justify-center px-10 gap-7 font-serif text-[40px] anim-rise" style={{ animationDuration: ".4s" }}>
          {NAV.map(([href, key]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} className="leading-none">
              {t[key]}
            </a>
          ))}
          <p className="font-sans text-[12px] tracking-[.16em] opacity-60 mt-5 m-0">MESSONGHI • CORFU</p>
        </div>
      )}
    </>
  );
}
