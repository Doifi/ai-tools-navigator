import { NextResponse } from "next/server";
import { z } from "zod";

import { getMockApiCategoryById } from "@/lib/mock/api-fallback";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const submitSchema = z.object({
  toolName: z.string().trim().min(2, "工具名称至少 2 个字符").max(50, "工具名称不能超过 50 个字符"),
  websiteUrl: z.string().trim().url("请输入合法的官网地址"),
  logoUrl: z
    .union([z.string().trim().url("请输入合法的 Logo 地址"), z.literal("")])
    .optional()
    .transform((value) => value ?? ""),
  description: z.string().trim().min(10, "描述至少 10 个字符").max(200, "描述不能超过 200 个字符"),
  categoryId: z.string().uuid("分类 ID 格式不正确"),
  priceModel: z.enum(["free", "freemium", "paid"]),
  apiAvailable: z.boolean(),
  submitterEmail: z.string().trim().email("请输入合法的邮箱地址")
});

/**
 * POST /api/submit-tool
 * Stores a tool submission in Supabase or returns a mock success response when env is missing.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = submitSchema.parse(body);

    if (!hasPublicSupabaseEnv()) {
      const category = getMockApiCategoryById(validatedData.categoryId);

      if (!category) {
        return NextResponse.json({ error: "分类不存在" }, { status: 400 });
      }

      return NextResponse.json(
        {
          success: true,
          message: "提交成功，等待审核",
          submissionId: `mock-${Date.now()}`
        },
        { status: 201 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", validatedData.categoryId)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tool_submissions")
      .insert({
        tool_name: validatedData.toolName,
        website_url: validatedData.websiteUrl,
        logo_url: validatedData.logoUrl || null,
        description: validatedData.description,
        category_id: validatedData.categoryId,
        price_model: validatedData.priceModel,
        api_available: validatedData.apiAvailable,
        submitter_email: validatedData.submitterEmail,
        status: "pending"
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: "提交成功，等待审核",
        submissionId: data.id
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "数据验证失败",
          details: error.issues
        },
        { status: 400 }
      );
    }

    console.error("Submit tool error:", error);
    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  }
}
