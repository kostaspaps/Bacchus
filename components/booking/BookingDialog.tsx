"use client";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useLang } from "@/components/LangProvider";
import BookingForm from "./BookingForm";

/** Homepage booking: centred dialog on desktop, bottom sheet on mobile. */
export default function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [step, setStep] = useState<"form" | "summary">("form");
  const [first, setFirst] = useState("");
  const onStep = useCallback((s: "form" | "summary", name: string) => {
    setStep(s);
    setFirst(name);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.bkTitle}
          className="fixed inset-0 z-[90] flex items-end lg:items-center justify-center bg-wine-dark/70 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
          <motion.div
            className="relative w-full lg:max-w-[640px] max-h-[100svh] overflow-auto bg-ivory text-wine-dark p-[clamp(24px,4vw,48px)] pb-[max(24px,env(safe-area-inset-bottom))] rounded-t-[20px] lg:rounded-none border border-gold/50"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="lg:hidden mx-auto mb-4 h-1 w-10 rounded-full bg-wine-dark/20" aria-hidden="true" />
            <div className="flex justify-between items-start mb-6 gap-4">
              <div>
                <p className="label text-olive m-0 mb-2">{step === "form" ? t.bkLabel : t.bkLabelReview}</p>
                <h2 className="font-serif font-light text-[clamp(34px,4vw,48px)] leading-none m-0">{step === "form" ? t.bkTitle : t.bkTitleReview(first)}</h2>
              </div>
              <button type="button" onClick={onClose} aria-label={t.close} className="bg-transparent border-0 text-[12px] tracking-[.18em] uppercase py-2 min-h-11">
                {t.close} ✕
              </button>
            </div>
            <BookingForm source="/" variant="sheet" onStepChange={onStep} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
