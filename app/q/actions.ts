"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyQuickKey } from "@/lib/admin-session";
import { resolveReservationId, updateReservationStatus } from "@/lib/db";
import { notifyGuestStatus } from "@/lib/email";
import type { ReservationStatus } from "@/lib/schema";

/** Owner one-tap confirm/decline from the email or WhatsApp alert (signed link, no login). */
export async function quickSetStatus(formData: FormData) {
  const id = (await resolveReservationId(String(formData.get("id") || ""))) || "";
  const k = String(formData.get("k") || "");
  const status = String(formData.get("status") || "") as ReservationStatus;
  if (!id || !(await verifyQuickKey(id, k))) redirect("/admin/login");
  if (status !== "confirmed" && status !== "declined") return;

  const { reservation: updated, changed } = await updateReservationStatus(id, status);
  let emailed = false;
  if (updated && changed) {
    try {
      emailed = await notifyGuestStatus(updated);
    } catch (e) {
      console.error("[quick] guest status email failed", e);
    }
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/reservations/${id}`);
  redirect(`/q/${id.slice(0, 8)}/${k}?done=${status}&emailed=${emailed ? 1 : 0}&changed=${changed ? 1 : 0}`);
}
