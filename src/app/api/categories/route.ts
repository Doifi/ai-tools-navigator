import { NextResponse } from "next/server";

import { getOfficialApiCategories } from "@/lib/official-tools-sync";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";
import type { Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

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
  if (!hasReadableSupabaseEnv()) {
    return NextResponse.json({ categories: getOfficialApiCategories() });
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

    const categories = ((data ?? []) as CategoryWithToolsCount[]).map((category) => ({
      ...category,
      toolCount: Array.isArray(category.tools) ? (category.tools[0]?.count ?? 0) : 0
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ categories: getOfficialApiCategories() });
  }
}
