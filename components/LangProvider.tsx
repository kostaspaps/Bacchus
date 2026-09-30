"use client";
import { createContext, useContext, type ReactNode } from "react";
import { DICT, type Dict, type Lang } from "@/lib/i18n";

const Ctx = createContext<{ lang: Lang; t: Dict }>({ lang: "en", t: DICT.en });

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <Ctx.Provider value={{ lang, t: DICT[lang] }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}
