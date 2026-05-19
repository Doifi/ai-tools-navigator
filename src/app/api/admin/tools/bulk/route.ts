import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { normalizeDelimitedInput, slugifyToolName } from "@/lib/admin/tool-form-schema";
import { ensureAdminRequest } from "@/lib/admin-route";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { TablesInsert } from "@/types/supabase";

const stringListSchema = z
  .union([z.array(z.string()), z.string(), z.undefined(), z.null()])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value.map((item) => item.trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return normalizeDelimitedInput(value);
    }

    return [];
  });

const importToolSchema = z.object({
  name: z.string().trim().min(2, "工具名称至少 2 个字符").max(200, "工具名称过长"),
  slug: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .max(200, "Slug 过长")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和中划线")
    ])
    .optional()
    .default(""),
  websiteUrl: z.string().trim().url("官网 URL 不合法"),
  logoUrl: z.union([z.literal(""), z.string().trim().url("Logo URL 不合法")]).optional().default(""),
  description: z.string().trim().min(10, "简介至少 10 个字符").max(300, "简介过长"),
  detailedIntro: z.string().trim().max(5000, "详细介绍过长").optional().default(""),
  categoryId: z.union([z.literal(""), z.string().uuid("分类 ID 不合法")]).optional().default(""),
  categorySlug: z.string().trim().optional().default(""),
  priceModel: z.enum(["free", "freemium", "paid"]).optional().default("freemium"),
  apiAvailable: z.boolean().optional().default(false),
  isSponsored: z.boolean().optional().default(false),
  sponsorPlan: z.enum(["starter", "featured", "homepage"]).optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional().default("published"),
  tags: stringListSchema,
  features: stringListSchema
});

const bulkImportSchema = z.union([
  z.array(z.unknown()),
  z.object({
    tools: z.array(z.unknown())
  })
]);

type ImportResult = {
  index: number;
  name: string;
  slug: string;
  status: "inserted" | "skipped" | "error";
  message: string;
};

function revalidateToolPaths() {
  revalidatePath("/");
  revalidatePath("/tools");
  revalidatePath("/categories");
  revalidatePath("/admin/tools");
}

/**
 * POST /api/admin/tools/bulk
 * Imports a JSON list of tools. Existing slugs are skipped, not overwritten.
 */
export async function POST(request: Request) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const payload = await request.json();
    const parsedPayload = bulkImportSchema.parse(payload);
    const rawTools = Array.isArray(parsedPayload) ? parsedPayload : parsedPayload.tools;

    if (rawTools.length === 0) {
      return NextResponse.json({ error: "导入列表不能为空" }, { status: 400 });
    }

    if (rawTools.length > 100) {
      return NextResponse.json({ error: "单次最多导入 100 个工具" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const [
      { data: categories, error: categoriesError },
      { data: existingTools, error: existingToolsError }
    ] = await Promise.all([
      supabase.from("categories").select("id, slug"),
      supabase.from("tools").select("slug")
    ]);

    if (categoriesError) {
      throw categoriesError;
    }

    if (existingToolsError) {
      throw existingToolsError;
    }

    const categoryIds = new Set((categories ?? []).map((category) => category.id));
    const categoryBySlug = new Map((categories ?? []).map((category) => [category.slug, category.id]));
    const existingSlugs = new Set((existingTools ?? []).map((tool) => tool.slug));
    const incomingSlugs = new Set<string>();
    const results: ImportResult[] = [];
    const rows: TablesInsert<"tools">[] = [];
    const rowIndexes: number[] = [];
    const now = new Date().toISOString();

    rawTools.forEach((rawTool, index) => {
      const parsedTool = importToolSchema.safeParse(rawTool);

      if (!parsedTool.success) {
        results.push({
          index,
          name: "未识别",
          slug: "",
          status: "error",
          message: parsedTool.error.issues[0]?.message ?? "字段校验失败"
        });
        return;
      }

      const tool = parsedTool.data;
      const slug = tool.slug || slugifyToolName(tool.name);

      if (!slug) {
        results.push({
          index,
          name: tool.name,
          slug: "",
          status: "error",
          message: "无法自动生成 Slug，请手动填写英文 slug"
        });
        return;
      }

      if (existingSlugs.has(slug)) {
        results.push({
          index,
          name: tool.name,
          slug,
          status: "skipped",
          message: "Slug 已存在，已跳过"
        });
        return;
      }

      if (incomingSlugs.has(slug)) {
        results.push({
          index,
          name: tool.name,
          slug,
          status: "skipped",
          message: "导入列表里有重复 Slug，已跳过"
        });
        return;
      }

      const categoryId =
        tool.categoryId || (tool.categorySlug ? categoryBySlug.get(tool.categorySlug) ?? "" : "");

      if (tool.categoryId && !categoryIds.has(tool.categoryId)) {
        results.push({
          index,
          name: tool.name,
          slug,
          status: "error",
          message: "categoryId 不存在"
        });
        return;
      }

      if (tool.categorySlug && !categoryId) {
        results.push({
          index,
          name: tool.name,
          slug,
          status: "error",
          message: `找不到分类 Slug：${tool.categorySlug}`
        });
        return;
      }

      incomingSlugs.add(slug);
      rows.push({
        name: tool.name,
        slug,
        website_url: tool.websiteUrl,
        logo_url: tool.logoUrl || null,
        description: tool.description,
        detailed_intro: tool.detailedIntro || tool.description,
        category_id: categoryId || null,
        price_model: tool.priceModel,
        api_available: tool.apiAvailable,
        is_sponsored: tool.isSponsored,
        sponsor_plan: tool.isSponsored ? tool.sponsorPlan ?? "featured" : null,
        sponsor_expiry: null,
        status: tool.status,
        tags: tool.tags,
        features: tool.features,
        views: 0,
        clicks: 0,
        published_at: tool.status === "published" ? now : null,
        created_at: now,
        updated_at: now
      });
      rowIndexes.push(index);
    });

    if (rows.length > 0) {
      const { error: insertError } = await supabase.from("tools").insert(rows);

      if (insertError) {
        throw insertError;
      }

      rows.forEach((row, rowIndex) => {
        results.push({
          index: rowIndexes[rowIndex] ?? rowIndex,
          name: row.name,
          slug: row.slug,
          status: "inserted",
          message: "已导入"
        });
      });

      revalidateToolPaths();
    }

    const sortedResults = results.sort((a, b) => a.index - b.index);

    return NextResponse.json({
      success: true,
      summary: {
        total: rawTools.length,
        inserted: sortedResults.filter((result) => result.status === "inserted").length,
        skipped: sortedResults.filter((result) => result.status === "skipped").length,
        errors: sortedResults.filter((result) => result.status === "error").length
      },
      results: sortedResults
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "导入数据格式不正确" },
        { status: 400 }
      );
    }

    console.error("Admin bulk import tools API error:", error);
    return NextResponse.json({ error: "批量导入失败，请稍后重试" }, { status: 500 });
  }
}
