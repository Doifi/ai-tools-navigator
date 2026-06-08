import { NextResponse } from "next/server";

import { normalizeCatalogSearchQuery, queryPublicTools } from "@/lib/public-catalog";
import type { Enums } from "@/types/supabase";

export const dynamic = "force-dynamic";

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
  const market = searchParams.get("market");
  const sort = searchParams.get("sort") ?? "latest";
  const keyword = normalizeCatalogSearchQuery(searchParams.get("q"));
  const priceModel = searchParams.get("price_model") as Enums<"price_model"> | null;
  const apiAvailable = searchParams.get("api_available");

  const payload = await queryPublicTools({
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

  return NextResponse.json(payload);
}
