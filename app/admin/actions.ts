"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notifyGuestStatus } from "@/lib/email";
import { RESERVATION_STATUSES, type ReservationStatus } from "@/lib/schema";
import { updateReservationStatus } from "@/lib/supabase";
import { currentAdmin, supabaseServer } from "@/lib/supabase-auth";

export async function setStatus(formData: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as ReservationStatus;
  if (!id || !RESERVATION_STATUSES.includes(status)) return;
  const updated = await updateReservationStatus(id, status);
  if (updated && (status === "confirmed" || status === "declined")) {
    try {
      await notifyGuestStatus(updated);
    } catch (e) {
      console.error("[admin] guest status email failed", e);
    }
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/reservations/${id}`);
}

export async function signOut() {
  const sb = await supabaseServer();
  await sb?.auth.signOut();
  redirect("/admin/login");
}
