import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gates /admin behind an admin session cookie.
 *
 * FAILS CLOSED: in production the admin is locked even if ADMIN_SESSION is
 * missing — a misconfigured env var must never expose orders and customer
 * data. (Local dev without the env vars stays open for convenience.)
 */
export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_SESSION;
  const { pathname } = req.nextUrl;
  const isProd = process.env.NODE_ENV === "production";

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Not configured in production → deny outright.
    if (!expected) {
      if (isProd) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("setup", "1");
        return NextResponse.redirect(url);
      }
      return NextResponse.next(); // local dev only
    }
    const token = req.cookies.get("kb_admin")?.value;
    if (token !== expected) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  // Keep the admin out of search engines entirely.
  if (pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
