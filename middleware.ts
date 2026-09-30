import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function adminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.OWNER_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * 1. Locale routing: English at "/", Greek at "/el" — both served from app/[lang].
 * 2. /admin guard: refreshes the Supabase session cookie and redirects to /admin/login when not an allow-listed owner.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || !SB_URL || !SB_ANON) return NextResponse.next();
    let res = NextResponse.next({ request: req });
    const sb = createServerClient(SB_URL, SB_ANON, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (all) => {
          all.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          all.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    });
    const { data } = await sb.auth.getUser();
    const email = data.user?.email?.toLowerCase();
    if (!email || !adminEmails().includes(email)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return res;
  }

  if (pathname === "/el" || pathname.startsWith("/el/")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|auth|_next|images|og|icon|apple-icon|favicon|llms\\.txt|sitemap\\.xml|robots\\.txt|manifest|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
