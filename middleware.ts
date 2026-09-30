import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionValue } from "@/lib/admin-session";

/**
 * 1. Locale routing: English at "/", Greek at "/el" — both served from app/[lang].
 * 2. /admin guard: requires a valid owner session cookie (see lib/admin-session.ts).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const ok = await verifySessionValue(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/el" || pathname.startsWith("/el/")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|og|icon|apple-icon|favicon|llms\\.txt|sitemap\\.xml|robots\\.txt|manifest|.*\\.[a-zA-Z0-9]+$).*)"],
};
