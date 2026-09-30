import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Reservation, ReservationStatus } from "./schema";

export const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let cached: SupabaseClient | null = null;

/** Service-role client for server code only. Returns null when Supabase is not configured. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SERVICE_KEY);

export async function countRecentByIp(ipHash: string, windowMs: number) {
  const db = supabaseAdmin();
  if (!db) return 0;
  const since = new Date(Date.now() - windowMs).toISOString();
  const { count, error } = await db
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) throw error;
  return count ?? 0;
}

export async function insertReservation(row: Omit<Reservation, "id" | "created_at" | "status" | "website"> & { ip_hash: string }) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("reservations").insert(row).select("id, created_at").single();
  if (error) throw error;
  return data as { id: string; created_at: string };
}

export async function listReservations(limit = 200) {
  const db = supabaseAdmin();
  if (!db) return [] as Reservation[];
  const { data, error } = await db
    .from("reservations")
    .select("*")
    .order("date", { ascending: false })
    .order("time", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Reservation[];
}

export async function getReservation(id: string) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("reservations").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Reservation | null) ?? null;
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("reservations").update({ status }).eq("id", id).select("*").single();
  if (error) throw error;
  return data as Reservation;
}
