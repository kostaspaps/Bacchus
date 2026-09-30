import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionValue } from "./admin-session";

/** True when the request carries a valid owner session cookie. */
export async function isAdmin() {
  const store = await cookies();
  return verifySessionValue(store.get(ADMIN_COOKIE)?.value);
}
