import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "ad_admin_session";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE);
  if (session?.value !== "ok") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
