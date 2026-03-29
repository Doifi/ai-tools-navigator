import { NextResponse } from "next/server";

import { getMockApiCategories } from "@/lib/mock/api-fallback";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

type CategoryWithToolsCount = Tables<"categories"> & {
  tools: Array<{
    count: number | null;
  }> | null;
};

/**
 * GET /api/categories
 * Returns categories with tool counts. Falls back to mock data when Supabase is not configured.
 */
export async function GET() {
  if (!hasPublicSupabaseEnv()) {
    return NextResponse.json({ categories: getMockApiCategories() });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*, tools:tools(count)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    const categories = ((data ?? []) as CategoryWithToolsCount[]).map((category) => ({
      ...category,
      toolCount: Array.isArray(category.tools) ? (category.tools[0]?.count ?? 0) : 0
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ categories: getMockApiCategories() });
  }
}
