import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isAuthConfigured = () => Boolean(URL && ANON);

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.OWNER_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Supabase client bound to the request cookies (for reading the owner's session in server components / actions). */
export async function supabaseServer() {
  if (!isAuthConfigured()) return null;
  const store = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (all) => {
        try {
          all.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component — cookies are refreshed by the middleware instead.
        }
      },
    },
  });
}

/** Returns the signed-in owner's email, or null when not signed in / not allow-listed. */
export async function currentAdmin(): Promise<string | null> {
  const sb = await supabaseServer();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) return null;
  return adminEmails().includes(email) ? email : null;
}
