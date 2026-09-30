"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { ADMIN_COOKIE, checkPassword, createSessionValue, sessionCookieOptions } from "@/lib/admin-session";
import { updateReservationStatus } from "@/lib/db";
import { notifyGuestStatus } from "@/lib/email";
import { RESERVATION_STATUSES, type ReservationStatus } from "@/lib/schema";

export async function signIn(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!(await checkPassword(password))) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionValue(), sessionCookieOptions);
  redirect("/admin");
}

export async function signOut() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  redirect("/admin/login");
}

export async function setStatus(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
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
