import { NextResponse } from "next/server";

import { queryOfficialApiTools } from "@/lib/official-tools-sync";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";
import type { Enums } from "@/types/supabase";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function normalizeSearchQuery(rawValue: string | null) {
  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue
    .replace(/[,%(){}\[\]"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalizedValue || null;
}

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
  const market = searchParams.get("market");
  const sort = searchParams.get("sort") ?? "latest";
  const keyword = normalizeSearchQuery(searchParams.get("q"));
  const priceModel = searchParams.get("price_model") as Enums<"price_model"> | null;
  const apiAvailable = searchParams.get("api_available");

  const fallbackPayload = queryOfficialApiTools({
    page,
    limit,
    categoryId,
    tag,
    market,
    sort,
    query: keyword,
    priceModel,
    apiAvailable
  });

  if (!hasReadableSupabaseEnv()) {
    return NextResponse.json(fallbackPayload);
  }

  try {
    const supabase = createReadableSupabaseClient();
    let toolsQuery = supabase
      .from("tools")
      .select("*, categories(*)", { count: "exact" })
      .eq("status", "published");

    if (categoryId) {
      toolsQuery = toolsQuery.eq("category_id", categoryId);
    }

    if (priceModel) {
      toolsQuery = toolsQuery.eq("price_model", priceModel);
    }

    if (apiAvailable === "true") {
      toolsQuery = toolsQuery.eq("api_available", true);
    }

    if (apiAvailable === "false") {
      toolsQuery = toolsQuery.eq("api_available", false);
    }

    if (tag) {
      toolsQuery = toolsQuery.contains("tags", [tag]);
    }

    if (market === "china") {
      toolsQuery = toolsQuery.contains("tags", ["国内"]);
    }

    if (market === "global") {
      toolsQuery = toolsQuery.contains("tags", ["海外"]);
    }

    if (keyword) {
      toolsQuery = toolsQuery.or(
        `name.ilike.%${keyword}%,slug.ilike.%${keyword}%,description.ilike.%${keyword}%,detailed_intro.ilike.%${keyword}%`
      );
    }

    switch (sort) {
      case "popular":
        toolsQuery = toolsQuery
          .order("views", { ascending: false })
          .order("published_at", { ascending: false });
        break;
      case "click":
        toolsQuery = toolsQuery
          .order("clicks", { ascending: false })
          .order("published_at", { ascending: false });
        break;
      case "latest":
      default:
        toolsQuery = toolsQuery.order("published_at", { ascending: false });
        break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await toolsQuery.range(from, to);

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
