import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminCategorySchema } from "@/lib/admin/category-form-schema";
import { ensureAdminRequest } from "@/lib/admin-route";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function revalidateCategoryPaths() {
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/tools");
  revalidatePath("/posts");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/tools");
  revalidatePath("/admin/posts");
}

/**
 * POST /api/admin/categories
 * Creates a new category for tools and posts.
 */
export async function POST(request: Request) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const payload = await request.json();
    const value = adminCategorySchema.parse(payload);
    const supabase = createAdminSupabaseClient();

    const { data: existingCategory, error: existingCategoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", value.slug)
      .maybeSingle();

    if (existingCategoryError) {
      throw existingCategoryError;
    }

    if (existingCategory) {
      return NextResponse.json({ error: "Slug 已存在，请更换一个分类 Slug" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: value.name,
        slug: value.slug,
        description: value.description || null,
        icon: value.icon || null,
        sort_order: value.sortOrder
      })
      .select("id, name, slug")
      .single();

    if (error) {
      throw error;
    }

    revalidateCategoryPaths();

    return NextResponse.json({
      success: true,
      message: "分类已创建",
      category: data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "分类表单校验失败" },
        { status: 400 }
      );
    }

    console.error("Admin create category API error:", error);
    return NextResponse.json({ error: "创建分类失败，请稍后重试" }, { status: 500 });
  }
}
