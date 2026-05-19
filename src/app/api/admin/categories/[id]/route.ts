import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminCategorySchema } from "@/lib/admin/category-form-schema";
import { ensureAdminRequest } from "@/lib/admin-route";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function revalidateCategoryPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/tools");
  revalidatePath("/posts");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/tools");
  revalidatePath("/admin/posts");

  if (slug) {
    revalidatePath(`/categories/${slug}`);
  }
}

/**
 * PATCH /api/admin/categories/[id]
 * Updates category metadata and ordering.
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
      .select("id, slug")
      .eq("id", params.id)
      .maybeSingle();

    if (existingCategoryError) {
      throw existingCategoryError;
    }

    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    const { data: conflictingCategory, error: conflictingCategoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", value.slug)
      .neq("id", params.id)
      .maybeSingle();

    if (conflictingCategoryError) {
      throw conflictingCategoryError;
    }

    if (conflictingCategory) {
      return NextResponse.json({ error: "Slug 已被其他分类占用" }, { status: 409 });
    }

    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name: value.name,
        slug: value.slug,
        description: value.description || null,
        icon: value.icon || null,
        sort_order: value.sortOrder
      })
      .eq("id", params.id);

    if (updateError) {
      throw updateError;
    }

    revalidateCategoryPaths(existingCategory.slug);
    revalidateCategoryPaths(value.slug);

    return NextResponse.json({
      success: true,
      message: "分类已更新"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "分类表单校验失败" },
        { status: 400 }
      );
    }

    console.error("Admin update category API error:", error);
    return NextResponse.json({ error: "更新分类失败，请稍后重试" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Deletes an unused category. In-use categories must be reassigned first.
 */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const supabase = createAdminSupabaseClient();

    const { data: existingCategory, error: existingCategoryError } = await supabase
      .from("categories")
      .select("id, slug")
      .eq("id", params.id)
      .maybeSingle();

    if (existingCategoryError) {
      throw existingCategoryError;
    }

    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    const [
      { count: toolsCount, error: toolsError },
      { count: postsCount, error: postsError },
      { count: submissionsCount, error: submissionsError }
    ] = await Promise.all([
        supabase.from("tools").select("id", { count: "exact", head: true }).eq("category_id", params.id),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("category_id", params.id),
        supabase
          .from("tool_submissions")
          .select("id", { count: "exact", head: true })
          .eq("category_id", params.id)
      ]);

    if (toolsError) {
      throw toolsError;
    }

    if (postsError) {
      throw postsError;
    }

    if (submissionsError) {
      throw submissionsError;
    }

    if ((toolsCount ?? 0) > 0 || (postsCount ?? 0) > 0 || (submissionsCount ?? 0) > 0) {
      return NextResponse.json(
        { error: "该分类下仍有工具、文章或提交记录，请先改到其他分类再删除" },
        { status: 409 }
      );
    }

    const { error: deleteError } = await supabase.from("categories").delete().eq("id", params.id);

    if (deleteError) {
      throw deleteError;
    }

    revalidateCategoryPaths(existingCategory.slug);

    return NextResponse.json({
      success: true,
      message: "分类已删除"
    });
  } catch (error) {
    console.error("Admin delete category API error:", error);
    return NextResponse.json({ error: "删除分类失败，请稍后重试" }, { status: 500 });
  }
}
