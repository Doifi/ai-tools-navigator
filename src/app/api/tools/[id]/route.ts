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
  const identifier = params.id.trim();
  const fallbackTool = getMockApiToolById(identifier);

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
      .eq("status", "published")
      .or(`id.eq.${identifier},slug.eq.${identifier}`)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Tool not found" }, { status: 404 });
      }

      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    const { error: viewError } = await supabase.rpc("increment_tool_views", { tool_id: data.id });

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
