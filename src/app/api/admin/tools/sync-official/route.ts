import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { ensureAdminRequest } from "@/lib/admin-route";
import { syncOfficialToolsCatalog } from "@/lib/official-tools-sync";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/tools/sync-official
 * Syncs the curated official tools catalog into Supabase from the server runtime.
 */
async function runSync() {
  try {
    const result = await syncOfficialToolsCatalog(createAdminSupabaseClient());

    revalidatePath("/");
    revalidatePath("/tools");
    revalidatePath("/categories");
    revalidatePath("/admin/tools");

    return NextResponse.json({
      success: true,
      message: `已同步 ${result.total} 个官方工具`,
      sync: result
    });
  } catch (error) {
    console.error("Sync official tools error:", error);
    return NextResponse.json({ error: "同步官方工具失败，请稍后重试" }, { status: 500 });
  }
}

export async function POST() {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  return runSync();
}

/**
 * GET /api/admin/tools/sync-official
 * Preview-only convenience entry so protected Vercel previews can trigger sync through vercel curl.
 */
export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  return runSync();
}
