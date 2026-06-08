import { queryOfficialApiTools, getOfficialApiCategories } from "@/lib/official-tools-sync";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";
import type { ApiCategory, ApiTool } from "@/lib/api-mappers";
import type { Enums, Tables } from "@/types/supabase";

export const PUBLIC_TOOLS_PAGE_SIZE = 12;

export interface PublicToolsQuery {
  page?: number;
  limit?: number;
  categoryId?: string | null;
  tag?: string | null;
  market?: string | null;
  query?: string | null;
  sort?: string | null;
  priceModel?: Enums<"price_model"> | null;
  apiAvailable?: string | null;
}

export interface PublicToolsPayload {
  tools: ApiTool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type CategoryWithToolsCount = Tables<"categories"> & {
  tools: Array<{
    count: number | null;
  }> | null;
};

export function normalizeCatalogSearchQuery(rawValue?: string | null) {
  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue
    .replace(/[,%(){}\[\]"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalizedValue || null;
}

export async function getPublicCategories(): Promise<ApiCategory[]> {
  if (!hasReadableSupabaseEnv()) {
    return getOfficialApiCategories();
  }

  try {
    const supabase = createReadableSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*, tools:tools(count)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return ((data ?? []) as CategoryWithToolsCount[]).map((category) => ({
      ...category,
      toolCount: Array.isArray(category.tools) ? (category.tools[0]?.count ?? 0) : 0
    }));
  } catch (error) {
    console.error("Public categories query failed, falling back to official catalog:", error);
    return getOfficialApiCategories();
  }
}

export async function queryPublicTools({
  page = 1,
  limit = PUBLIC_TOOLS_PAGE_SIZE,
  categoryId = null,
  tag = null,
  market = null,
  query = null,
  sort = "latest",
  priceModel = null,
  apiAvailable = null
}: PublicToolsQuery): Promise<PublicToolsPayload> {
  const normalizedPage = Math.max(page, 1);
  const normalizedLimit = Math.min(Math.max(limit, 1), 50);
  const normalizedQuery = normalizeCatalogSearchQuery(query);
  const fallbackPayload = queryOfficialApiTools({
    page: normalizedPage,
    limit: normalizedLimit,
    categoryId,
    tag,
    market,
    query: normalizedQuery,
    sort,
    priceModel,
    apiAvailable
  });

  if (!hasReadableSupabaseEnv()) {
    return fallbackPayload;
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

    if (normalizedQuery) {
      toolsQuery = toolsQuery.or(
        `name.ilike.%${normalizedQuery}%,slug.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%,detailed_intro.ilike.%${normalizedQuery}%`
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

    const from = (normalizedPage - 1) * normalizedLimit;
    const to = from + normalizedLimit - 1;
    const { data, error, count } = await toolsQuery.range(from, to);

    if (error) {
      throw error;
    }

    return {
      tools: data ?? [],
      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        total: count ?? 0,
        totalPages: Math.max(1, Math.ceil((count ?? 0) / normalizedLimit))
      }
    };
  } catch (error) {
    console.error("Public tools query failed, falling back to official catalog:", error);
    return fallbackPayload;
  }
}
