import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gates /admin behind an admin session cookie.
 * Enforced only when ADMIN_SESSION is configured (so preview/demo stays open,
 * and the moment you set the env vars for launch, the admin locks down).
 */
export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_SESSION;
  const { pathname } = req.nextUrl;

  if (expected && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("kb_admin")?.value;
    if (token !== expected) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
