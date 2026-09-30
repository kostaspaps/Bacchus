import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Reservation, ReservationStatus } from "./schema";

/** Neon Postgres over HTTP — ideal for serverless. Set by the Vercel Neon integration (DATABASE_URL). */
const URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

export const isDbConfigured = () => Boolean(URL);

function sql() {
  if (!URL) throw new Error("DATABASE_URL not set");
  return neon(URL);
}

type Row = Record<string, unknown>;

function toReservation(r: Row): Reservation {
  const date = r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date);
  const created = r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at);
  return {
    id: String(r.id),
    created_at: created,
    name: String(r.name),
    date,
    time: String(r.time),
    guests: Number(r.guests),
    hotel: (r.hotel as string) || "",
    phone: String(r.phone),
    email: (r.email as string) || "",
    special_request: (r.special_request as string) || "",
    language: (r.language as "en" | "el") || "en",
    source: (r.source as "/" | "/book") || "/",
    utm_source: (r.utm_source as string) || undefined,
    utm_medium: (r.utm_medium as string) || undefined,
    utm_campaign: (r.utm_campaign as string) || undefined,
    utm_content: (r.utm_content as string) || undefined,
    utm_term: (r.utm_term as string) || undefined,
    gclid: (r.gclid as string) || undefined,
    status: (r.status as ReservationStatus) || "pending",
    website: "",
  };
}

export async function countRecentByIp(ipHash: string, windowMs: number) {
  const since = new Date(Date.now() - windowMs).toISOString();
  const rows = await sql()`select count(*)::int as n from reservations where ip_hash = ${ipHash} and created_at >= ${since}`;
  return Number(rows[0]?.n ?? 0);
}

export async function insertReservation(r: Omit<Reservation, "id" | "created_at" | "status" | "website"> & { ip_hash: string }) {
  const rows = await sql()`
    insert into reservations (name, date, time, guests, hotel, phone, email, special_request, language, source,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, ip_hash)
    values (${r.name}, ${r.date}, ${r.time}, ${r.guests}, ${r.hotel || null}, ${r.phone}, ${r.email || null},
      ${r.special_request || null}, ${r.language}, ${r.source}, ${r.utm_source || null}, ${r.utm_medium || null},
      ${r.utm_campaign || null}, ${r.utm_content || null}, ${r.utm_term || null}, ${r.gclid || null}, ${r.ip_hash})
    returning id, created_at`;
  const row = rows[0] as Row;
  return { id: String(row.id), created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at) };
}

export async function listReservations(limit = 300) {
  const rows = await sql()`select * from reservations order by date desc, time desc, created_at desc limit ${limit}`;
  return (rows as Row[]).map(toReservation);
}

export async function getReservation(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await sql()`select * from reservations where id = ${id}::uuid`;
  return rows[0] ? toReservation(rows[0] as Row) : null;
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const rows = await sql()`update reservations set status = ${status}::reservation_status where id = ${id}::uuid returning *`;
  return rows[0] ? toReservation(rows[0] as Row) : null;
}
