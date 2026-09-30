import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifyQuickKey } from "@/lib/admin-session";
import { getReservation } from "@/lib/db";
import { formatDate, ownerReplies } from "@/lib/email";
import { waReplyLink } from "@/lib/whatsapp";
import { quickSetStatus } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Table request · Bacchus", robots: { index: false, follow: false } };

/**
 * Owner one-tap page, opened from the email / WhatsApp alert on Yana's phone.
 * Signed with the reservation id, so no login is needed. Confirm / decline
 * updates the request and emails the guest; then offers the prefilled WhatsApp reply.
 */
export default async function QuickPage({ params, searchParams }: { params: Promise<{ id: string; k?: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id, k: pathKey } = await params;
  const sp = await searchParams;
  const k = pathKey || sp.k || "";
  if (!(await verifyQuickKey(id, k))) notFound();
  const r = await getReservation(id);
  if (!r) notFound();

  const done = sp.done === "confirmed" || sp.done === "declined" ? sp.done : null;
  const emailed = sp.emailed === "1";
  const unchanged = sp.changed === "0";
  const settled = r.status === "confirmed" || r.status === "declined";
  const other = r.status === "confirmed" ? "declined" : "confirmed";
  const tel = `tel:${r.phone.replace(/[^\d+]/g, "")}`;
  const replies = ownerReplies(r, r.language);
  const rows: [string, string][] = [
    ["Name", r.name],
    ["Date", formatDate(r.date, "en")],
    ["Time", r.time],
    ["Guests", String(r.guests)],
    ["Hotel", r.hotel || "—"],
    ["Phone", r.phone],
    ["Email", r.email || "—"],
    ["Request", r.special_request || "—"],
    ["Language", r.language === "el" ? "Greek" : "English"],
  ];
  const btn = "btn text-ivory p-[18px] min-h-14 text-[12px] w-full";
  const outline = "btn border border-wine-dark text-wine-dark p-[16px] min-h-14 text-[12px] w-full";

  return (
    <main className="min-h-screen bg-ivory text-ink px-5 py-8 max-w-[520px] mx-auto">
      <p className="label text-olive m-0 mb-2">Bacchus · table request</p>
      <h1 className="font-serif font-light text-[32px] leading-none m-0 mb-6">
        {r.name} · {r.guests} pax
        <br />
        <span className="text-wine">
          {formatDate(r.date, "en")} · {r.time}
        </span>
      </h1>

      {done || settled ? (
        <div className="border border-olive/40 bg-olive/5 p-4 mb-6" role="status">
          <p className="m-0 font-semibold">{r.status === "confirmed" ? "✅ Confirmed." : r.status === "declined" ? "❌ Declined." : "Updated."}</p>
          <p className="m-0 mt-1 text-[14px]">
            {done && !unchanged
              ? r.email
                ? emailed
                  ? `The guest was emailed at ${r.email}.`
                  : `Email to ${r.email} could not be sent — please reply on WhatsApp.`
                : "The guest gave no email — send the WhatsApp below."
              : r.email
                ? `Already ${r.status} — the guest was emailed at ${r.email} the first time. No new email sent.`
                : `Already ${r.status}. The guest gave no email.`}
          </p>
        </div>
      ) : (
        <p className="m-0 mb-6 text-[14px] text-olive">
          Status: <strong className="text-ink uppercase tracking-[.14em] text-[12px]">{r.status}</strong>. Tap once — the guest is emailed automatically.
        </p>
      )}

      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[15px] border-t border-wine-dark/15 pt-4 mb-8">
        {rows.map(([kk, v]) => (
          <div key={kk} className="contents">
            <dt className="text-[10px] tracking-[.2em] uppercase text-olive pt-1">{kk}</dt>
            <dd className="m-0">{v}</dd>
          </div>
        ))}
      </dl>

      {!settled && (
        <div className="grid gap-3 mb-8">
          <form action={quickSetStatus}>
            <input type="hidden" name="id" value={r.id} />
            <input type="hidden" name="k" value={k} />
            <input type="hidden" name="status" value="confirmed" />
            <button type="submit" className={`${btn} bg-olive hover:opacity-90`}>
              ✅ Confirm table
            </button>
          </form>
          <form action={quickSetStatus}>
            <input type="hidden" name="id" value={r.id} />
            <input type="hidden" name="k" value={k} />
            <input type="hidden" name="status" value="declined" />
            <button type="submit" className={outline}>
              ❌ Decline
            </button>
          </form>
        </div>
      )}
      {settled && (
        <form action={quickSetStatus} className="mb-8">
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="k" value={k} />
          <input type="hidden" name="status" value={other} />
          <button type="submit" className="bg-transparent border-0 border-b border-wine-dark p-0 text-[12px] tracking-[.18em] uppercase text-wine-dark">
            Changed your mind? Mark as {other} instead (emails the guest once)
          </button>
        </form>
      )}

      <div className="grid gap-3">
        <p className="label text-olive m-0 mt-2">💬 Reply on WhatsApp · ready-made ({r.language === "el" ? "Greek" : "English"}, tap to open, edit before sending)</p>
        {replies.map((x) => (
          <a
            key={x.key}
            href={waReplyLink(r.phone, x.text)}
            className={x.key === "confirm" || x.key === "okToday" ? `${btn} bg-wine hover:bg-wine-dark` : outline}
          >
            {x.label}
          </a>
        ))}
        <a href={tel} className={outline}>
          📞 Call {r.phone}
        </a>
        <a href={`/admin/reservations/${r.id}`} className="text-[12px] tracking-[.18em] uppercase underline decoration-wine/40 justify-self-center mt-2">
          Open in admin
        </a>
      </div>
    </main>
  );
}
