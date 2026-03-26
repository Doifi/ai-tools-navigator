import { NextResponse } from "next/server";

import { queryMockApiPosts } from "@/lib/mock/api-fallback";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 50;

/**
 * GET /api/posts
 * Returns published posts with pagination and optional category/tool filters.
 * Falls back to mock data when Supabase is not configured.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(
    Number.parseInt(searchParams.get("page") ?? `${DEFAULT_PAGE}`, 10) || DEFAULT_PAGE,
    1
  );
  const limit = Math.min(
    Math.max(
      Number.parseInt(searchParams.get("limit") ?? `${DEFAULT_LIMIT}`, 10) || DEFAULT_LIMIT,
      1
    ),
    MAX_LIMIT
  );
  const category = searchParams.get("category");
  const toolId = searchParams.get("tool_id");

  const fallbackPayload = queryMockApiPosts({
    page,
    limit,
    categoryId: category,
    toolId
  });

  if (!hasPublicSupabaseEnv()) {
    return NextResponse.json(fallbackPayload);
  }

  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("posts")
      .select("*, categories(*)", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category_id", category);
    }

    if (toolId) {
      query = query.contains("related_tools", [toolId]);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      posts: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.max(1, Math.ceil((count ?? 0) / limit))
      }
    });
  } catch (error) {
    console.error("Posts API error:", error);
    return NextResponse.json(fallbackPayload);
  }
}
