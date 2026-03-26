import { NextResponse } from "next/server";

import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/track/click
 * Records a tool click when Supabase is available. Falls back to a no-op success in mock mode.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { toolId?: string };
    const toolId = body.toolId?.trim();

    if (!toolId) {
      return NextResponse.json({ error: "Missing toolId" }, { status: 400 });
    }

    if (!hasPublicSupabaseEnv()) {
      return NextResponse.json({ success: true, mocked: true });
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.rpc("increment_clicks", { tool_id: toolId });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track click error:", error);
    return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
  }
}
