"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import album from "@/content/album.json";
import { useLang } from "@/components/LangProvider";

/** Heritage album: crossfades every 4.2s, pauses on hover, click advances. */
export default function Album() {
  const { lang } = useLang();
  const [idx, setIdx] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % album.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <figure
      data-reveal="up"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onClick={() => setIdx((i) => (i + 1) % album.length)}
      className="m-0 p-3 border border-wine/30 cursor-pointer bg-white/25"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e1d2]">
        {album.map((a, i) => (
          <Image
            key={a.src}
            src={a.src}
            alt={a.caption[lang]}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover scale-[1.04] transition-opacity duration-[1400ms] ease-in-out"
            style={{ objectPosition: a.pos, opacity: i === idx ? 1 : 0, filter: "sepia(.12) contrast(1.03)" }}
            aria-hidden={i !== idx}
          />
        ))}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(74,16,40,.18)]" aria-hidden="true" />
      </div>
      <figcaption className="caption text-olive flex justify-between items-center gap-3 pt-3 px-1">
        <span aria-live="polite">{album[idx].caption[lang]}</span>
        <span className="flex gap-[6px]" aria-hidden="true">
          {album.map((a, i) => (
            <span key={a.src} className="block w-[6px] h-[6px] rounded-full bg-wine transition-opacity duration-400" style={{ opacity: i === idx ? 1 : 0.25 }} />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
