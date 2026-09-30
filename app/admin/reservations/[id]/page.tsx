import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { confirmText, declineText, formatDate } from "@/lib/email";
import { RESERVATION_STATUSES } from "@/lib/schema";
import { getReservation } from "@/lib/supabase";
import { currentAdmin } from "@/lib/supabase-auth";
import { waReplyLink } from "@/lib/whatsapp";
import { setStatus } from "../../actions";
import { StatusBadge } from "../../ui";

export const dynamic = "force-dynamic";

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  const { id } = await params;
  const r = await getReservation(id);
  if (!r) notFound();

  const rows: [string, string][] = [
    ["Name", r.name],
    ["Date", `${r.date} · ${formatDate(r.date, "en")}`],
    ["Time", r.time],
    ["Guests", String(r.guests)],
    ["Hotel", r.hotel || "—"],
    ["Phone", r.phone],
    ["Email", r.email || "—"],
    ["Special request", r.special_request || "—"],
    ["Language", r.language === "el" ? "Greek" : "English"],
    ["Source", `${r.source}${r.utm_source ? ` · ${r.utm_source} / ${r.utm_medium || ""} / ${r.utm_campaign || ""}` : ""}${r.gclid ? " · gclid" : ""}`],
    ["Received", new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Europe/Athens" })],
  ];
  const tel = `tel:${r.phone.replace(/[^\d+]/g, "")}`;
  const btn = "btn bg-wine text-ivory px-5 py-3 text-[11px]";
  const btnOutline = "btn border border-wine-dark text-wine-dark px-5 py-3 text-[11px] hover:bg-wine-dark hover:text-ivory";

  return (
    <>
      <p className="text-xs mb-6"><Link href="/admin" className="underline decoration-wine/40">← All requests</Link></p>
      <header className="flex justify-between items-start flex-wrap gap-4 mb-8">
        <div>
          <p className="label text-olive m-0 mb-1">Table request</p>
          <h1 className="font-serif text-3xl m-0">{r.name} · {r.date} {r.time} · {r.guests} pax</h1>
        </div>
        <StatusBadge status={r.status} />
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm border-t border-wine/20 pt-4">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="caption text-olive pt-1 whitespace-nowrap">{k}</dt>
              <dd className="m-0 break-words">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-8 content-start">
          <section>
            <h2 className="label text-olive mb-3">Reply to guest</h2>
            <div className="flex flex-wrap gap-2">
              <a href={waReplyLink(r.phone, confirmText(r, "en"))} target="_blank" rel="noopener" className={btn}>WhatsApp · confirm (EN)</a>
              <a href={waReplyLink(r.phone, confirmText(r, "el"))} target="_blank" rel="noopener" className={btn}>WhatsApp · επιβεβαίωση (GR)</a>
              <a href={waReplyLink(r.phone, declineText(r, "en"))} target="_blank" rel="noopener" className={btnOutline}>WhatsApp · decline (EN)</a>
              <a href={waReplyLink(r.phone, declineText(r, "el"))} target="_blank" rel="noopener" className={btnOutline}>WhatsApp · απόρριψη (GR)</a>
              <a href={tel} className={btnOutline}>Call</a>
              {r.email && <a href={`mailto:${r.email}`} className={btnOutline}>Email</a>}
            </div>
            <p className="text-xs text-olive mt-3">Templates are prefilled; edit before sending. Fill in alternative slots in the decline message.</p>
          </section>

          <section>
            <h2 className="label text-olive mb-3">Status</h2>
            <form action={setStatus} className="flex flex-wrap gap-2">
              <input type="hidden" name="id" value={r.id} />
              {RESERVATION_STATUSES.map((s) => (
                <button key={s} name="status" value={s} disabled={s === r.status} className={`${s === r.status ? btn : btnOutline} disabled:opacity-50`}>
                  {s}
                </button>
              ))}
            </form>
            <p className="text-xs text-olive mt-3">Confirmed / declined sends an email to the guest when an email address was given.</p>
          </section>
        </div>
      </div>
    </>
  );
}
