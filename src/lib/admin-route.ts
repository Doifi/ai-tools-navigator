import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

/**
 * Validates the admin session cookie for protected admin route handlers.
 */
export async function ensureAdminRequest() {
  try {
    const sessionValue = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthorized = await verifyAdminSession(sessionValue);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null;
  } catch (error) {
    console.error("Admin authentication error:", error);
    return NextResponse.json(
      { error: "Admin authentication is misconfigured." },
      { status: 500 }
    );
  }
}

export default ensureAdminRequest;
