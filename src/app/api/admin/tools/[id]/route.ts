import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureAdminRequest } from "@/lib/admin-route";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function revalidateToolPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/tools");
  revalidatePath("/categories");
  revalidatePath("/admin/tools");

  if (slug) {
    revalidatePath(`/tools/${slug}`);
  }
}

const toolUpdateSchema = z.object({
  name: z.string().trim().min(2, "工具名称至少 2 个字符").max(200, "工具名称不能超过 200 个字符"),
  slug: z.string().trim().min(2, "Slug 至少 2 个字符").max(200, "Slug 不能超过 200 个字符"),
  description: z
    .string()
    .trim()
    .min(10, "简介至少 10 个字符")
    .max(1000, "简介不能超过 1000 个字符"),
  detailedIntro: z.string().trim().max(5000, "详细介绍不能超过 5000 个字符").optional(),
  logoUrl: z
    .union([z.string().trim().url("Logo URL 格式不正确"), z.literal("")])
    .optional()
    .transform((value) => value ?? ""),
  websiteUrl: z.string().trim().url("官网地址格式不正确"),
  categoryId: z.string().uuid("分类 ID 格式不正确").nullable(),
  priceModel: z.enum(["free", "freemium", "paid"]).nullable(),
  apiAvailable: z.boolean(),
  isSponsored: z.boolean(),
  sponsorPlan: z.enum(["starter", "featured", "homepage"]).nullable(),
  status: z.enum(["draft", "published", "archived"]),
  tags: z.array(z.string().trim().min(1)).max(20, "标签不能超过 20 个").optional(),
  features: z.array(z.string().trim().min(1)).max(20, "功能点不能超过 20 个").optional()
});

/**
 * PATCH /api/admin/tools/[id]
 * Updates tool details and sponsor state from the admin panel.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const body = await request.json();
    const validatedData = toolUpdateSchema.parse(body);
    const supabase = createAdminSupabaseClient();

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("id, slug, published_at")
      .eq("id", params.id)
      .maybeSingle();

    if (existingToolError) {
      return NextResponse.json({ error: existingToolError.message }, { status: 500 });
    }

    if (!existingTool) {
      return NextResponse.json({ error: "工具不存在" }, { status: 404 });
    }

    const { data: conflictingSlug, error: conflictingSlugError } = await supabase
      .from("tools")
      .select("id")
      .eq("slug", validatedData.slug)
      .neq("id", params.id)
      .maybeSingle();

    if (conflictingSlugError) {
      return NextResponse.json({ error: conflictingSlugError.message }, { status: 500 });
    }

    if (conflictingSlug) {
      return NextResponse.json({ error: "Slug 已被其他工具占用" }, { status: 409 });
    }

    const { error: updateError } = await supabase
      .from("tools")
      .update({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        detailed_intro: validatedData.detailedIntro || null,
        logo_url: validatedData.logoUrl || null,
        website_url: validatedData.websiteUrl,
        category_id: validatedData.categoryId,
        price_model: validatedData.priceModel,
        api_available: validatedData.apiAvailable,
        is_sponsored: validatedData.isSponsored,
        sponsor_plan: validatedData.isSponsored ? validatedData.sponsorPlan : null,
        status: validatedData.status,
        published_at:
          validatedData.status === "published"
            ? existingTool.published_at ?? new Date().toISOString()
            : null,
        tags: validatedData.tags ?? [],
        features: validatedData.features ?? [],
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    revalidateToolPaths(existingTool.slug);
    revalidateToolPaths(validatedData.slug);

    return NextResponse.json({
      success: true,
      message: "工具信息已更新"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "请求参数无效" },
        { status: 400 }
      );
    }

    console.error("Update tool error:", error);
    return NextResponse.json({ error: "更新工具失败" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/tools/[id]
 * Permanently removes a tool from the live catalog.
 */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const supabase = createAdminSupabaseClient();

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("id, slug, name")
      .eq("id", params.id)
      .maybeSingle();

    if (existingToolError) {
      return NextResponse.json({ error: existingToolError.message }, { status: 500 });
    }

    if (!existingTool) {
      return NextResponse.json({ error: "工具不存在" }, { status: 404 });
    }

    const { data: relatedPosts, error: relatedPostsError } = await supabase
      .from("posts")
      .select("id, related_tools")
      .contains("related_tools", [params.id]);

    if (relatedPostsError) {
      return NextResponse.json({ error: relatedPostsError.message }, { status: 500 });
    }

    for (const post of relatedPosts ?? []) {
      const nextRelatedTools = (post.related_tools ?? []).filter((toolId) => toolId !== params.id);
      const { error: updatePostError } = await supabase
        .from("posts")
        .update({ related_tools: nextRelatedTools })
        .eq("id", post.id);

      if (updatePostError) {
        return NextResponse.json({ error: updatePostError.message }, { status: 500 });
      }
    }

    const { error: deleteError } = await supabase.from("tools").delete().eq("id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    revalidateToolPaths(existingTool.slug);
    revalidatePath("/posts");
    revalidatePath("/admin/posts");

    return NextResponse.json({
      success: true,
      message: `工具「${existingTool.name}」已删除`
    });
  } catch (error) {
    console.error("Delete tool error:", error);
    return NextResponse.json({ error: "删除工具失败" }, { status: 500 });
  }
}
