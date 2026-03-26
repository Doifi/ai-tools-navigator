import { NextResponse } from "next/server";

import { getMockApiToolById } from "@/lib/mock/api-fallback";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface ToolDetailRouteProps {
  params: {
    id: string;
  };
}

/**
 * GET /api/tools/[id]
 * Returns a single published tool. Falls back to mock data when Supabase is not configured.
 */
export async function GET(_request: Request, { params }: ToolDetailRouteProps) {
  const fallbackTool = getMockApiToolById(params.id);

  if (!hasPublicSupabaseEnv()) {
    if (!fallbackTool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({ tool: fallbackTool });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("tools")
      .select("*, categories(*)")
      .eq("id", params.id)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Tool not found" }, { status: 404 });
      }

      throw error;
    }

    const { error: viewError } = await supabase.rpc("increment_tool_views", { tool_id: params.id });

    if (viewError) {
      console.error("increment_tool_views failed:", viewError.message);
    }

    return NextResponse.json({ tool: data });
  } catch (error) {
    console.error("Tool detail API error:", error);

    if (!fallbackTool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json({ tool: fallbackTool });
  }
}
