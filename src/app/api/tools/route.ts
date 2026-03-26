import { NextResponse } from "next/server";

import { queryMockApiTools } from "@/lib/mock/api-fallback";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/supabase";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

/**
 * GET /api/tools
 * Returns published tools with filtering, sorting, and pagination.
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

  const categoryId = searchParams.get("category");
  const tag = searchParams.get("tag");
  const sort = searchParams.get("sort") ?? "latest";
  const priceModel = searchParams.get("price_model") as Enums<"price_model"> | null;
  const apiAvailable = searchParams.get("api_available");

  const fallbackPayload = queryMockApiTools({
    page,
    limit,
    categoryId,
    tag,
    sort,
    priceModel,
    apiAvailable
  });

  if (!hasPublicSupabaseEnv()) {
    return NextResponse.json(fallbackPayload);
  }

  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("tools")
      .select("*, categories(*)", { count: "exact" })
      .eq("status", "published");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (priceModel) {
      query = query.eq("price_model", priceModel);
    }

    if (apiAvailable === "true") {
      query = query.eq("api_available", true);
    }

    if (apiAvailable === "false") {
      query = query.eq("api_available", false);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    switch (sort) {
      case "popular":
        query = query.order("views", { ascending: false }).order("published_at", { ascending: false });
        break;
      case "click":
        query = query.order("clicks", { ascending: false }).order("published_at", { ascending: false });
        break;
      case "latest":
      default:
        query = query.order("published_at", { ascending: false });
        break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      tools: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.max(1, Math.ceil((count ?? 0) / limit))
      }
    });
  } catch (error) {
    console.error("Tools API error:", error);
    return NextResponse.json(fallbackPayload);
  }
}
