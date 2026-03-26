import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureAdminRequest } from "@/lib/admin-route";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const rejectSchema = z.object({
  adminNotes: z.string().trim().max(500, "备注不能超过 500 个字符").optional()
});

/**
 * POST /api/admin/submissions/[id]/reject
 * Rejects a pending tool submission.
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
    const { adminNotes } = rejectSchema.parse(body);
    const supabase = createAdminSupabaseClient();

    const { data: submission, error: submissionError } = await supabase
      .from("tool_submissions")
      .select("id, status")
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

    const { error: updateError } = await supabase
      .from("tool_submissions")
      .update({
        status: "rejected",
        admin_notes: adminNotes || null,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "提交已拒绝"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "请求参数无效" },
        { status: 400 }
      );
    }

    console.error("Reject submission error:", error);
    return NextResponse.json({ error: "拒绝提交失败" }, { status: 500 });
  }
}
