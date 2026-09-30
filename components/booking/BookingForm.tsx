"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLang } from "@/components/LangProvider";
import { getUtm, track } from "@/lib/analytics";
import { BOOKING_SLOTS, MAX_GUESTS } from "@/lib/config";
import { localeTag } from "@/lib/i18n";
import { waLink, type BookingFields } from "@/lib/whatsapp";

export type Fields = BookingFields & { email: string; hp: string };
type Step = "form" | "summary";
type Saved = "pending" | "sending" | "recorded" | "offline";

const empty: Fields = { name: "", date: "", time: "", guests: 2, hotel: "", phone: "", notes: "", email: "", hp: "" };

function todayLocal() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/**
 * Shared booking flow (homepage sheet + /book landing).
 * Step 1 collects the request, step 2 shows a summary and hands off to WhatsApp.
 * The request is POSTed to /api/reservations in the background; WhatsApp is the primary channel.
 */
export default function BookingForm({
  source,
  variant = "sheet",
  onStepChange,
  showNotes = true,
}: {
  source: "/" | "/book";
  variant?: "sheet" | "page";
  onStepChange?: (step: Step, firstName: string) => void;
  showNotes?: boolean;
}) {
  const { lang, t } = useLang();
  const [f, setF] = useState<Fields>(empty);
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Saved>("pending");
  const started = useRef(false);
  const today = todayLocal();

  useEffect(() => {
    onStepChange?.(step, f.name.trim().split(" ")[0]);
  }, [step, f.name, onStepChange]);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    if (!started.current && source === "/book") {
      started.current = true;
      track("start_booking");
    }
    setF((s) => ({ ...s, [k]: v }));
    setError("");
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (f.hp) return;
    if (!f.time) return setError(t.bkErrTime);
    if (!f.name.trim() || !f.date || !f.phone.trim()) return setError(t.bkErrRequired);
    if (f.date < today) return setError(t.bkErrDate);

    const utm = getUtm();
    track("submit_booking", { guests: f.guests, source, ...utm });
    setStep("summary");
    setSaved("sending");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          date: f.date,
          time: f.time,
          guests: f.guests,
          hotel: f.hotel,
          phone: f.phone,
          email: f.email,
          special_request: f.notes,
          language: lang,
          source,
          website: f.hp,
          ...utm,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { id: string; saved: boolean };
      setSaved(data.saved ? "recorded" : "offline");
    } catch {
      setSaved("offline");
    }
  }

  const savedLabel = saved === "sending" ? t.bkSending : saved === "recorded" ? t.bkRecorded : saved === "offline" ? t.bkOffline : "";
  const dateLabel = f.date ? new Date(`${f.date}T12:00`).toLocaleDateString(localeTag(lang), { weekday: "short", day: "numeric", month: "long" }) : "";
  const guestsLabel = `${f.guests} ${f.guests === 1 ? t.guest : t.guests}`;
  const labelCls = "grid gap-2 text-[11px] tracking-[.18em] uppercase text-olive";
  const big = variant === "page";

  if (step === "summary") {
    return (
      <div className="grid gap-6">
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[15px] border-t border-wine-dark/15 pt-5">
          {(
            [
              [t.bkName, f.name],
              [t.bkGuests, guestsLabel],
              [t.bkDate, dateLabel],
              [t.bkTime, f.time],
              [t.bkHotel.split(" /")[0], f.hotel || "—"],
              [t.phone, f.phone],
            ] as [string, string][]
          ).map(([k, v]) => (
            <Row key={k} k={k} v={v} />
          ))}
        </dl>
        <a
          href={waLink(f, lang)}
          target="_blank"
          rel="noopener"
          onClick={() => track("whatsapp_booking_click", { source })}
          className="btn bg-wine text-ivory hover:bg-wine-dark p-[18px] min-h-14"
        >
          {source === "/book" ? t.bpSend : t.bkWhatsApp}
        </a>
        <div className="flex justify-between gap-4 flex-wrap">
          <button type="button" onClick={() => setStep("form")} className="bg-transparent border-0 border-b border-wine-dark p-0 text-[12px] tracking-[.18em] uppercase">
            {t.bkEdit}
          </button>
          <span className="text-[11px] tracking-[.14em] uppercase text-olive" aria-live="polite">
            {t.bkSaved} · {savedLabel}
          </span>
        </div>
        <p className="m-0 text-[12px] leading-relaxed text-olive">{t.bkSummaryNote}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.hp} onChange={(e) => set("hp", e.target.value)} className="absolute -left-[9999px] opacity-0" aria-hidden="true" />

      <label className={labelCls}>
        {t.bkName} *
        <input required autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder={t.bkNamePh} className="field font-serif text-[18px] tracking-normal normal-case" />
      </label>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-5">
        <label className={labelCls}>
          {t.bkDate} *
          <input type="date" required min={today} value={f.date} onChange={(e) => set("date", e.target.value)} className="field" />
        </label>
        <div className={labelCls}>
          {t.bkGuests} *
          <div className="flex items-center gap-5 border-b border-wine-dark py-[6px]">
            <button type="button" onClick={() => set("guests", Math.max(1, f.guests - 1))} aria-label={t.bkFewer} className={`${big ? "w-11 h-11" : "w-9 h-9"} border border-wine-dark bg-transparent text-[18px] text-wine-dark`}>
              −
            </button>
            <span className="font-serif text-[26px] text-wine-dark min-w-6 text-center" aria-live="polite">
              {f.guests}
            </span>
            <button type="button" onClick={() => set("guests", Math.min(MAX_GUESTS, f.guests + 1))} aria-label={t.bkMore} className={`${big ? "w-11 h-11" : "w-9 h-9"} border border-wine-dark bg-transparent text-[18px] text-wine-dark`}>
              +
            </button>
          </div>
        </div>
      </div>

      <div className={`${labelCls} gap-[10px]`} role="group" aria-label={t.bkTime}>
        {t.bkTime} *
        <div className="flex flex-wrap gap-2">
          {BOOKING_SLOTS.map((time) => {
            const on = f.time === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => set("time", time)}
                aria-pressed={on}
                className={`px-[14px] ${big ? "py-3 min-h-11" : "py-[10px] min-h-10"} border border-wine-dark text-[13px] tracking-[.04em] transition-colors ${on ? "bg-wine text-ivory border-wine" : "bg-transparent text-wine-dark"}`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      <label className={labelCls}>
        {t.bkHotel}
        <input value={f.hotel} onChange={(e) => set("hotel", e.target.value)} placeholder={t.bkHotelPh} autoComplete="organization" className="field tracking-normal normal-case" />
      </label>

      <label className={labelCls}>
        {t.bkPhone} *
        <input type="tel" required inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t.bkPhonePh} className="field tracking-normal normal-case" />
      </label>

      <label className={labelCls}>
        {t.bkEmail}
        <input type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder={t.bkEmailPh} className="field tracking-normal normal-case" />
      </label>

      {showNotes && (
        <label className={labelCls}>
          {t.bkNotes}
          <textarea rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t.bkNotesPh} className="field tracking-normal normal-case resize-y" />
        </label>
      )}

      {error && (
        <p className="m-0 text-[13px] text-terracotta" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={`btn bg-wine text-ivory hover:bg-wine-dark ${big ? "p-5 min-h-14" : "p-[18px]"}`}>
        {source === "/book" ? t.bpSubmit : t.bkReview}
      </button>
      <p className="m-0 text-[12px] leading-relaxed text-olive">
        <RequestNote text={source === "/book" ? t.bpNote : t.bkRequestNote} word={t.bkRequestWord} />
      </p>
    </form>
  );
}

function RequestNote({ text, word }: { text: string; word: string }) {
  const i = text.toLowerCase().indexOf(word.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <strong>{text.slice(i, i + word.length)}</strong>
      {text.slice(i + word.length)}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="caption text-olive pt-1">{k}</dt>
      <dd className="m-0 font-serif text-[24px] break-words">{v}</dd>
    </>
  );
}
