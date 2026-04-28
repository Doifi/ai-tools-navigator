import {
  AdminSubmissionDashboard,
  type AdminSubmissionRecord
} from "@/components/admin/AdminSubmissionDashboard";
import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { hasAdminSupabaseEnv } from "@/lib/supabase/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ArrowRight, FileText, Hammer, Inbox } from "lucide-react";

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
      <section className="space-y-6">
        <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但审核提交页在连接 Supabase 时失败，所以暂时无法读取待审核和历史处理数据。" />

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                <Inbox className="h-5 w-5" />
              </div>
              <Badge tone="paid">待恢复</Badge>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">投稿审核</h2>
              <p className="mt-3 text-sm leading-7 text-foreground/62">
                这一块依赖实时数据库，当前只能等 Supabase 恢复后继续处理。
              </p>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Hammer className="h-5 w-5" />
              </div>
              <Badge tone="free">可查看</Badge>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">工具管理</h2>
              <p className="mt-3 text-sm leading-7 text-foreground/62">
                已接入官方目录快照，只读可查，可继续核对官网、分类、标签和基础介绍。
              </p>
            </div>
            <Link
              href="/admin/tools"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line/70 px-5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
            >
              进入工具管理
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <Badge tone="free">可查看</Badge>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">文章管理</h2>
              <p className="mt-3 text-sm leading-7 text-foreground/62">
                已切到站内文章快照，只读可查，可继续搜索文章并打开前台检查内容。
              </p>
            </div>
            <Link
              href="/admin/posts"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line/70 px-5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
            >
              进入文章管理
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>
    );
  }
}
