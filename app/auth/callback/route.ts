import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-auth";

/** Magic-link landing: exchanges the auth code for a session cookie, then redirects to /admin. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") || "/admin";
  const safeNext = next.startsWith("/admin") ? next : "/admin";
  if (code) {
    const sb = await supabaseServer();
    if (sb) {
      const { error } = await sb.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(safeNext, req.url));
    }
  }
  return NextResponse.redirect(new URL("/admin/login?error=link", req.url));
}
