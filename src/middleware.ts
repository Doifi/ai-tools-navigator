import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

function isPublicAdminPath(pathname: string) {
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return true;
  }

  return (
    process.env.VERCEL_ENV === "preview" && pathname === "/api/admin/tools/sync-official"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  try {
    const sessionValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthorized = await verifyAdminSession(sessionValue);

    if (isAuthorized) {
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Admin middleware error:", error);
    return new NextResponse("Admin authentication is misconfigured.", {
      status: 500
    });
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
