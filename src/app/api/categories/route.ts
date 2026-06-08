import { NextResponse } from "next/server";

import { getPublicCategories } from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

/**
 * GET /api/categories
 * Returns categories with tool counts. Falls back to mock data when Supabase is not configured.
 */
export async function GET() {
  const categories = await getPublicCategories();
  return NextResponse.json({ categories });
}
