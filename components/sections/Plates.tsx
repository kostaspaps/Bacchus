"use client";
import Image from "next/image";
import { useState } from "react";
import plates from "@/content/plates.json";
import { useLang } from "@/components/LangProvider";
import { track } from "@/lib/analytics";

/** 03 · Corfu on a plate — six categories, tap/click reveals the description. */
export default function Plates() {
  const { lang } = useLang();
  const [open, setOpen] = useState(-1);
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
      {plates.map((p, i) => {
        const on = open === i;
        return (
          <article
            key={p.title.en}
            data-reveal="up"
            className="relative p-[10px] border border-wine/30 bg-ivory transition-colors duration-400 hover:border-wine"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(on ? -1 : i);
                if (!on) track("menu_view", { plate: p.title.en });
              }}
              aria-expanded={on}
              className="relative block w-full aspect-[4/5] overflow-hidden bg-wine-dark text-left border-0 p-0"
            >
              <Image
                src={p.img}
                alt={p.title[lang]}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-[transform,opacity] duration-[1600ms]"
                style={{ objectPosition: p.pos, opacity: on ? 0.75 : 1, transform: on ? "scale(1.05)" : "scale(1)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-wine-dark/88" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <p className="text-[10px] tracking-[.2em] uppercase opacity-70 m-0 mb-2">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-serif font-normal text-[28px] m-0 mb-2 leading-none">{p.title[lang]}</h3>
                <p className="text-[13px] leading-[1.6] m-0 overflow-hidden transition-all duration-500" style={{ maxHeight: on ? 140 : 0, opacity: on ? 1 : 0 }}>
                  {p.desc[lang]}
                </p>
              </div>
            </button>
          </article>
        );
      })}
    </div>
  );
}
