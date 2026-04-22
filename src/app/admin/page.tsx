import {
  AdminSubmissionDashboard,
  type AdminSubmissionRecord
} from "@/components/admin/AdminSubmissionDashboard";
import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
import { hasAdminSupabaseEnv } from "@/lib/supabase/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Admin dashboard for reviewing tool submissions.
 */
export default async function AdminPage() {
  if (!hasAdminSupabaseEnv()) {
    return (
      <AdminEnvNotice description="当前部署没有注入后台所需的 Supabase 管理变量，所以工具投稿审核页暂时不可用。" />
    );
  }

  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("tool_submissions")
      .select("*, categories(id, name, slug)")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const submissions = (data ?? []) as AdminSubmissionRecord[];
    const pendingSubmissions = submissions.filter((submission) => submission.status === "pending");
    const recentReviewedSubmissions = submissions
      .filter((submission) => submission.status !== "pending")
      .slice(0, 6);

    return (
      <AdminSubmissionDashboard
        pendingSubmissions={pendingSubmissions}
        recentReviewedSubmissions={recentReviewedSubmissions}
      />
    );
  } catch (error) {
    console.error("Admin dashboard page error:", error);
    return (
      <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但审核提交页在连接 Supabase 时失败，所以暂时无法读取待审核和历史处理数据。" />
    );
  }
}
