"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import BookingDialog from "./BookingDialog";

const Ctx = createContext<{ open: () => void; close: () => void; isOpen: boolean }>({ open: () => {}, close: () => {}, isOpen: false });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => {
    track("start_booking");
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (window.location.hash === "#book") open();
  }, [open]);

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}
      <BookingDialog open={isOpen} onClose={close} />
    </Ctx.Provider>
  );
}

export const useBooking = () => useContext(Ctx);
