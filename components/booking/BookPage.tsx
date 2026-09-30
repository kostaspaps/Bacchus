"use client";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { captureUtm, track } from "@/lib/analytics";
import BookingForm from "./BookingForm";

/** /book — Google Ads landing form. Fires view_booking with UTM/gclid on mount. */
export default function BookPage() {
  const { t } = useLang();
  const [step, setStep] = useState<"form" | "summary">("form");
  const [first, setFirst] = useState("");
  const onStep = useCallback((s: "form" | "summary", name: string) => {
    setStep(s);
    setFirst(name);
  }, []);
  useEffect(() => {
    track("view_booking", captureUtm());
  }, []);
  return (
    <>
      <p className="label text-olive m-0 mb-2">{step === "form" ? t.bkLabel : t.bpReviewLabel}</p>
      <h2 id="book-title" className="font-serif font-light text-[clamp(34px,4vw,48px)] leading-none m-0 mb-7">
        {step === "form" ? t.bpFormTitle : t.bpReviewTitle(first)}
      </h2>
      <BookingForm source="/book" variant="page" onStepChange={onStep} showNotes={false} />
    </>
  );
}
