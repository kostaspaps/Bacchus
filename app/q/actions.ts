"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyQuickKey } from "@/lib/admin-session";
import { updateReservationStatus } from "@/lib/db";
import { notifyGuestStatus } from "@/lib/email";
import type { ReservationStatus } from "@/lib/schema";

/** Owner one-tap confirm/decline from the email or WhatsApp alert (signed link, no login). */
export async function quickSetStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const k = String(formData.get("k") || "");
  const status = String(formData.get("status") || "") as ReservationStatus;
  if (!(await verifyQuickKey(id, k))) redirect("/admin/login");
  if (status !== "confirmed" && status !== "declined") return;

  const updated = await updateReservationStatus(id, status);
  let emailed = false;
  if (updated) {
    try {
      emailed = await notifyGuestStatus(updated);
    } catch (e) {
      console.error("[quick] guest status email failed", e);
    }
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/reservations/${id}`);
  redirect(`/q/${id}/${k}?done=${status}&emailed=${emailed ? 1 : 0}`);
}
