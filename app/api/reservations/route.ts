import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { notifyGuestReceived, notifyOwner } from "@/lib/email";
import { clientIp, hashIp, isRateLimited, recordHit } from "@/lib/rate-limit";
import { reservationSchema, sanitise, type Reservation } from "@/lib/schema";
import { insertReservation, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/reservations
 * Body: booking fields (see lib/schema.ts). Returns { id, saved }.
 * The WhatsApp hand-off happens client-side; this endpoint records the request
 * and notifies the owner (email) and the guest (email, if given).
 */
export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 400 });
  }
  const input = parsed.data;

  // Honeypot: pretend success so bots stop retrying.
  if (input.website) {
    return NextResponse.json({ id: randomUUID(), saved: false });
  }

  const ipHash = hashIp(clientIp(req.headers));
  if (await isRateLimited(ipHash)) {
    return NextResponse.json({ error: "Too many requests — please try again later or message us on WhatsApp." }, { status: 429 });
  }
  recordHit(ipHash);

  const clean = {
    name: sanitise(input.name),
    date: input.date,
    time: input.time,
    guests: input.guests,
    hotel: sanitise(input.hotel || ""),
    phone: sanitise(input.phone),
    email: sanitise(input.email || "").toLowerCase(),
    special_request: sanitise(input.special_request || ""),
    language: input.language,
    source: input.source,
    utm_source: input.utm_source,
    utm_medium: input.utm_medium,
    utm_campaign: input.utm_campaign,
    utm_content: input.utm_content,
    utm_term: input.utm_term,
    gclid: input.gclid,
  };

  let id: string = randomUUID();
  let created_at = new Date().toISOString();
  let saved = false;

  if (isSupabaseConfigured()) {
    try {
      const row = await insertReservation({ ...clean, ip_hash: ipHash });
      if (row) {
        id = row.id;
        created_at = row.created_at;
        saved = true;
      }
    } catch (e) {
      console.error("[reservations] insert failed", e);
    }
  } else {
    console.warn("[reservations] Supabase not configured — request not persisted", { id, ...clean });
  }

  const reservation: Reservation = { ...clean, id, created_at, status: "pending", website: "" };

  // Notifications must never block or fail the guest's flow.
  const results = await Promise.allSettled([notifyOwner(reservation), notifyGuestReceived(reservation)]);
  results.forEach((r) => r.status === "rejected" && console.error("[reservations] notify failed", r.reason));

  return NextResponse.json({ id, saved });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
