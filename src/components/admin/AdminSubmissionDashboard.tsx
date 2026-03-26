"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  SearchX,
  ShieldX
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Tables } from "@/types/supabase";

type CategorySummary = Pick<Tables<"categories">, "id" | "name" | "slug">;

export type AdminSubmissionRecord = Tables<"tool_submissions"> & {
  categories: CategorySummary | null;
};

interface AdminSubmissionDashboardProps {
  pendingSubmissions: AdminSubmissionRecord[];
  recentReviewedSubmissions: AdminSubmissionRecord[];
}

function priceLabel(value: Tables<"tool_submissions">["price_model"]) {
  switch (value) {
    case "free":
      return "免费";
    case "freemium":
      return "免费试用";
    case "paid":
      return "付费";
    default:
      return "未设置";
  }
}

/**
 * Review queue for pending tool submissions.
 */
export function AdminSubmissionDashboard({
  pendingSubmissions,
  recentReviewedSubmissions
}: AdminSubmissionDashboardProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(pendingSubmissions[0]?.id ?? null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<"approve" | "reject" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSubmission = useMemo(
    () => pendingSubmissions.find((submission) => submission.id === selectedId) ?? null,
    [pendingSubmissions, selectedId]
  );

  useEffect(() => {
    if (!selectedSubmission) {
      setSelectedId(pendingSubmissions[0]?.id ?? null);
      setAdminNotes("");
      return;
    }

    setAdminNotes(selectedSubmission.admin_notes ?? "");
  }, [pendingSubmissions, selectedSubmission]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedSubmission) {
      return;
    }

    setIsSubmitting(action);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/submissions/${selectedSubmission.id}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminNotes: adminNotes.trim() || undefined
        })
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "操作失败");
      }

      setFeedback(payload?.message ?? "处理完成");
      router.refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "操作失败");
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card className="p-0">
        <div className="border-b border-line/70 p-6">
          <p className="eyebrow">Pending Queue</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
            待审核提交
          </h2>
          <p className="mt-3 text-sm leading-7 text-foreground/64">
            当前待处理 {pendingSubmissions.length} 条，审核通过后会自动创建正式工具记录。
          </p>
        </div>

        {pendingSubmissions.length > 0 ? (
          <div className="divide-y divide-line/70">
            {pendingSubmissions.map((submission) => {
              const isActive = submission.id === selectedId;

              return (
                <button
                  key={submission.id}
                  type="button"
                  className={`w-full px-6 py-5 text-left transition ${
                    isActive ? "bg-brand/6" : "hover:bg-background/80"
                  }`}
                  onClick={() => setSelectedId(submission.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-foreground">{submission.tool_name}</h3>
                      <p className="mt-2 text-sm text-foreground/60">
                        {submission.categories?.name ?? "未分类"} ·{" "}
                        {formatDate(submission.created_at ?? new Date().toISOString())}
                      </p>
                    </div>
                    <Badge tone="new">待审核</Badge>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background text-brand">
              <SearchX className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">暂无待审核提交</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-foreground/64">
              当前没有新的工具提交需要处理，可以稍后再查看。
            </p>
          </div>
        )}
      </Card>

      <div className="space-y-6">
        {selectedSubmission ? (
          <Card className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="eyebrow">Submission Detail</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                  {selectedSubmission.tool_name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-foreground/66">
                  {selectedSubmission.description || "提交者没有提供简介。"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge tone={selectedSubmission.price_model === "paid" ? "paid" : "free"}>
                  {priceLabel(selectedSubmission.price_model)}
                </Badge>
                {selectedSubmission.api_available ? <Badge tone="api">API</Badge> : null}
                {selectedSubmission.categories ? (
                  <Badge tone="plugin">{selectedSubmission.categories.name}</Badge>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line/70 bg-background/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  官网地址
                </p>
                <a
                  href={selectedSubmission.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-brand"
                >
                  {selectedSubmission.website_url}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="rounded-[1.5rem] border border-line/70 bg-background/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  提交邮箱
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-brand" />
                  {selectedSubmission.submitter_email ?? "未填写"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="submission-admin-notes"
                className="block text-sm font-medium text-foreground/80"
              >
                审核备注
              </label>
              <textarea
                id="submission-admin-notes"
                className="min-h-[140px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
                placeholder="可选：记录审核结论、后续跟进或拒绝原因"
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
              />
            </div>

            {feedback ? (
              <div className="rounded-[1.25rem] border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
                {feedback}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[1.25rem] border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="sm:flex-1"
                loading={isSubmitting === "approve"}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                onClick={() => void handleAction("approve")}
              >
                通过并创建工具
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="sm:flex-1"
                loading={isSubmitting === "reject"}
                leftIcon={<ShieldX className="h-4 w-4" />}
                onClick={() => void handleAction("reject")}
              >
                拒绝提交
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="flex min-h-[380px] items-center justify-center text-center">
            <div>
              <p className="eyebrow">Review Queue</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                当前没有待处理项
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-foreground/64">
                如果有新的提交记录，这里会显示详细信息和审核操作。
              </p>
            </div>
          </Card>
        )}

        <Card className="p-0">
          <div className="border-b border-line/70 p-6">
            <p className="eyebrow">Recent Actions</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">最近处理</h3>
          </div>

          {recentReviewedSubmissions.length > 0 ? (
            <div className="divide-y divide-line/70">
              {recentReviewedSubmissions.map((submission) => (
                <div key={submission.id} className="px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{submission.tool_name}</p>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm text-foreground/58">
                        <Clock3 className="h-4 w-4 text-brand" />
                        {submission.reviewed_at
                          ? formatDate(submission.reviewed_at)
                          : formatDate(submission.created_at ?? new Date().toISOString())}
                      </p>
                    </div>
                    <Badge tone={submission.status === "approved" ? "free" : "paid"}>
                      {submission.status === "approved" ? "已通过" : "已拒绝"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-sm text-foreground/60">暂无历史处理记录。</div>
          )}
        </Card>
      </div>
    </section>
  );
}

export default AdminSubmissionDashboard;
