"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import gallery from "@/content/gallery.json";
import { useLang } from "@/components/LangProvider";

type Filter = "all" | "place" | "food";

/** 05 · Masonry gallery with filters and a keyboard-navigable lightbox. */
export default function Gallery() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [lb, setLb] = useState(-1);
  const list = gallery.filter((g) => filter === "all" || g.cat === filter);
  const current = lb >= 0 ? list[lb] : null;
  const step = useCallback((d: number) => setLb((i) => (i + d + list.length) % list.length), [list.length]);

  useEffect(() => {
    if (lb < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLb(-1);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lb, step]);

  const tag = (k: string) => (k === "food" ? t.tagFood : k === "family" ? t.tagFamily : t.tagPlace);
  const filterBtn = (f: Filter, label: string) => (
    <button
      key={f}
      type="button"
      role="tab"
      aria-selected={filter === f}
      onClick={() => {
        setFilter(f);
        setLb(-1);
      }}
      className={`border border-wine-dark px-5 py-3 min-h-11 text-[11px] tracking-[.18em] uppercase font-semibold transition-colors ${filter === f ? "bg-wine-dark text-ivory" : "bg-transparent text-wine-dark"}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div role="tablist" data-reveal="up" className="flex gap-2 flex-wrap">
        {filterBtn("all", t.fAll)}
        {filterBtn("place", t.fPlace)}
        {filterBtn("food", t.fFood)}
      </div>
      <div className="[columns:3_300px] [column-gap:20px] mt-12">
        {list.map((g, i) => (
          <figure
            key={g.src + i}
            data-reveal="up"
            className={`group m-0 mb-5 [break-inside:avoid] p-[10px] border border-wine/30 hover:border-wine transition-colors duration-400 ${g.arch ? "arch" : ""}`}
          >
            <button type="button" onClick={() => setLb(i)} className={`block w-full border-0 p-0 bg-transparent cursor-zoom-in overflow-hidden ${g.arch ? "arch" : ""}`} aria-label={`${g.alt[lang]} — ${t.photo}`}>
              <div className="relative w-full" style={{ aspectRatio: g.ratio.replace("/", " / ") }}>
                <Image src={g.src} alt={g.alt[lang]} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover img-hover" style={{ objectPosition: g.pos }} />
              </div>
            </button>
            <figcaption className="caption text-olive flex justify-between gap-3 pt-[10px] px-1">
              <span>{g.alt[lang]}</span>
              <span>{tag(g.tag)}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt[lang]}
            className="fixed inset-0 z-[80] bg-wine-dark/95 flex items-center justify-center p-[clamp(16px,4vw,64px)]"
            onClick={() => setLb(-1)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full drop-shadow-[0_40px_80px_rgba(0,0,0,.6)]">
              <Image src={current.src} alt={current.alt[lang]} fill sizes="100vw" className="object-contain" priority />
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label={t.previous} className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 bg-transparent border-0 text-ivory text-[40px] font-serif p-4 min-w-11 min-h-11">
              ←
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label={t.next} className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 bg-transparent border-0 text-ivory text-[40px] font-serif p-4 min-w-11 min-h-11">
              →
            </button>
            <p className="absolute bottom-5 inset-x-0 text-center text-ivory text-[11px] tracking-[.18em] uppercase opacity-70 m-0 px-16">
              {current.alt[lang]} · {lb + 1} / {list.length}
            </p>
            <button type="button" onClick={() => setLb(-1)} aria-label={t.close} className="absolute top-5 right-6 bg-transparent border-0 text-ivory text-[12px] tracking-[.18em] uppercase min-h-11">
              {t.close} ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
