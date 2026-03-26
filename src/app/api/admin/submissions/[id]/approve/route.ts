import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureAdminRequest } from "@/lib/admin-route";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { TablesInsert } from "@/types/supabase";

const approveSchema = z.object({
  adminNotes: z.string().trim().max(500, "备注不能超过 500 个字符").optional()
});

function slugify(input: string) {
  const ascii = input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return ascii || "tool";
}

async function createUniqueToolSlug(baseName: string) {
  const supabase = createAdminSupabaseClient();
  const baseSlug = slugify(baseName);

  for (let index = 0; index < 50; index += 1) {
    const candidate = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
    const { data, error } = await supabase
      .from("tools")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique slug for this tool.");
}

/**
 * POST /api/admin/submissions/[id]/approve
 * Approves a pending submission and creates a published tool entry.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { adminNotes } = approveSchema.parse(body);
    const supabase = createAdminSupabaseClient();

    const { data: submission, error: submissionError } = await supabase
      .from("tool_submissions")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (submissionError) {
      return NextResponse.json({ error: submissionError.message }, { status: 500 });
    }

    if (!submission) {
      return NextResponse.json({ error: "提交记录不存在" }, { status: 404 });
    }

    if (submission.status !== "pending") {
      return NextResponse.json({ error: "该提交已经处理过了" }, { status: 409 });
    }

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("id")
      .eq("website_url", submission.website_url)
      .maybeSingle();

    if (existingToolError) {
      return NextResponse.json({ error: existingToolError.message }, { status: 500 });
    }

    if (existingTool) {
      return NextResponse.json({ error: "已存在相同官网地址的工具" }, { status: 409 });
    }

    const slug = await createUniqueToolSlug(submission.tool_name);
    const now = new Date().toISOString();
    const newTool: TablesInsert<"tools"> = {
      name: submission.tool_name,
      slug,
      description: submission.description,
      detailed_intro: submission.description,
      logo_url: submission.logo_url,
      website_url: submission.website_url,
      category_id: submission.category_id,
      tags: [],
      price_model: submission.price_model ?? "freemium",
      api_available: submission.api_available ?? false,
      features: [],
      is_sponsored: false,
      status: "published",
      published_at: now
    };

    const { data: createdTool, error: createToolError } = await supabase
      .from("tools")
      .insert(newTool)
      .select("id, slug")
      .single();

    if (createToolError) {
      return NextResponse.json({ error: createToolError.message }, { status: 500 });
    }

    const { error: updateSubmissionError } = await supabase
      .from("tool_submissions")
      .update({
        status: "approved",
        admin_notes: adminNotes || null,
        reviewed_at: now
      })
      .eq("id", params.id);

    if (updateSubmissionError) {
      await supabase.from("tools").delete().eq("id", createdTool.id);
      return NextResponse.json({ error: updateSubmissionError.message }, { status: 500 });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/tools");

    return NextResponse.json({
      success: true,
      message: "提交已通过，工具已创建",
      toolId: createdTool.id,
      toolSlug: createdTool.slug
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "请求参数无效" },
        { status: 400 }
      );
    }

    console.error("Approve submission error:", error);
    return NextResponse.json({ error: "审核通过失败" }, { status: 500 });
  }
}
