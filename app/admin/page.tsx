import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { isAdminConfigured } from "@/lib/admin-session";
import { isDbConfigured, listReservations } from "@/lib/db";
import { signOut } from "./actions";
import { StatusBadge } from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminConfigured() || !isDbConfigured()) {
    return <Setup />;
  }
  if (!(await isAdmin())) redirect("/admin/login");
  const rows = await listReservations();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(new Date());
  const upcoming = rows.filter((r) => r.date >= today);
  const past = rows.filter((r) => r.date < today);

  const Table = ({ items, title }: { items: typeof rows; title: string }) => (
    <section className="mb-12">
      <h2 className="label text-olive mb-4">{title} · {items.length}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-ink">Nothing here.</p>
      ) : (
        <div className="overflow-x-auto border border-wine/30">
          <table className="w-full text-sm border-collapse">
            <thead className="text-left caption text-olive">
              <tr>
                {["Date", "Time", "Guests", "Name", "Phone", "Hotel", "Status", "Source"].map((h) => (
                  <th key={h} className="px-3 py-2 border-b border-wine/20 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-white/40">
                  <td className="px-3 py-2 border-b border-wine/10 whitespace-nowrap"><Link href={`/admin/reservations/${r.id}`} className="underline decoration-wine/40">{r.date}</Link></td>
                  <td className="px-3 py-2 border-b border-wine/10">{r.time}</td>
                  <td className="px-3 py-2 border-b border-wine/10">{r.guests}</td>
                  <td className="px-3 py-2 border-b border-wine/10">{r.name} <span className="text-olive text-xs">{r.language.toUpperCase()}</span></td>
                  <td className="px-3 py-2 border-b border-wine/10 whitespace-nowrap">{r.phone}</td>
                  <td className="px-3 py-2 border-b border-wine/10">{r.hotel || "—"}</td>
                  <td className="px-3 py-2 border-b border-wine/10"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-2 border-b border-wine/10 text-xs text-olive">{r.source}{r.utm_source ? ` · ${r.utm_source}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  return (
    <>
      <header className="flex justify-between items-end flex-wrap gap-4 mb-10 border-b border-wine/30 pb-4">
        <div>
          <p className="label text-olive m-0 mb-1">Bacchus · admin</p>
          <h1 className="font-serif text-3xl m-0">Table requests</h1>
        </div>
        <form action={signOut} className="text-xs text-olive">
          <button className="underline bg-transparent border-0 p-0 text-xs text-wine">Sign out</button>
        </form>
      </header>
      <Table items={upcoming} title="Upcoming" />
      <Table items={past} title="Past" />
    </>
  );
}

function Setup() {
  return (
    <div className="max-w-[560px]">
      <p className="label text-olive m-0 mb-2">Bacchus · admin</p>
      <h1 className="font-serif text-3xl m-0 mb-4">Admin is not configured yet</h1>
      <p className="text-sm leading-relaxed text-ink">
        Set <code>DATABASE_URL</code> (Neon Postgres via the Vercel integration) and <code>ADMIN_PASSWORD</code> in the project environment variables, then run <code>db/schema.sql</code> once. See README.md.
      </p>
    </div>
  );
}
