import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { adminCreateToolSchema } from "@/lib/admin/tool-form-schema";

/**
 * POST /api/admin/tools
 * Creates a published or draft tool directly from the admin panel.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = adminCreateToolSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "表单校验失败",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const value = parsed.data;
    const supabase = createAdminSupabaseClient();

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("id")
      .eq("slug", value.slug)
      .maybeSingle();

    if (existingToolError) {
      throw existingToolError;
    }

    if (existingTool) {
      return NextResponse.json({ error: "Slug 已存在，请更换一个新的 Slug" }, { status: 409 });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("tools")
      .insert({
        name: value.name,
        slug: value.slug,
        description: value.description,
        detailed_intro: value.detailedIntro || value.description,
        logo_url: value.logoUrl || null,
        website_url: value.websiteUrl,
        category_id: value.categoryId,
        tags: value.tags,
        price_model: value.priceModel,
        api_available: value.apiAvailable,
        features: value.features,
        is_sponsored: value.isSponsored,
        sponsor_plan: value.isSponsored ? value.sponsorPlan || "featured" : null,
        sponsor_expiry: null,
        views: 0,
        clicks: 0,
        status: value.status,
        published_at: value.status === "published" ? now : null
      })
      .select("id, slug, status")
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/");
    revalidatePath("/tools");
    revalidatePath("/categories");
    revalidatePath("/admin/tools");

    return NextResponse.json({
      success: true,
      message: value.status === "published" ? "工具已创建并发布" : "工具已创建为草稿",
      tool: data
    });
  } catch (error) {
    console.error("Admin create tool API error:", error);
    return NextResponse.json({ error: "创建工具失败，请稍后重试" }, { status: 500 });
  }
}
