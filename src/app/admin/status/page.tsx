import { Activity, CheckCircle2, Database, FileText, ShieldAlert, Wrench, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getAdminSystemStatus, type AdminSystemCheck } from "@/lib/admin/system-status";

export const dynamic = "force-dynamic";

function formatCheckedAt(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}

function statusMeta(status: AdminSystemCheck["status"]) {
  switch (status) {
    case "ok":
      return {
        label: "正常",
        tone: "free" as const,
        icon: CheckCircle2,
        className: "text-success"
      };
    case "warning":
      return {
        label: "注意",
        tone: "paid" as const,
        icon: ShieldAlert,
        className: "text-warning"
      };
    case "error":
    default:
      return {
        label: "异常",
        tone: "paid" as const,
        icon: XCircle,
        className: "text-warning"
      };
  }
}

export default async function AdminStatusPage() {
  const status = await getAdminSystemStatus();
  const hasError = status.checks.some((check) => check.status === "error");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">System Status</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            后台系统状态
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/66">
            当前 Supabase 主机：{status.supabaseHost}。检测时间：{formatCheckedAt(status.checkedAt)}。
          </p>
        </div>
        <Badge tone={hasError ? "paid" : "free"}>{hasError ? "实时数据异常" : "实时数据正常"}</Badge>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/56">工具快照</p>
            <p className="mt-2 font-display text-4xl font-semibold text-foreground">
              {status.fallback.tools}
            </p>
            <p className="mt-2 text-sm text-foreground/58">后台只读模式下可继续查看。</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/56">分类快照</p>
            <p className="mt-2 font-display text-4xl font-semibold text-foreground">
              {status.fallback.categories}
            </p>
            <p className="mt-2 text-sm text-foreground/58">用于工具目录和分类筛选。</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/56">文章快照</p>
            <p className="mt-2 font-display text-4xl font-semibold text-foreground">
              {status.fallback.posts}
            </p>
            <p className="mt-2 text-sm text-foreground/58">后台只读模式下可继续检索。</p>
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="border-b border-line/70 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-brand">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">检测项目</h2>
              <p className="mt-1 text-sm text-foreground/58">只展示连接状态，不暴露密钥内容。</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-line/70">
          {status.checks.map((check) => {
            const meta = statusMeta(check.status);
            const Icon = meta.icon;

            return (
              <div key={check.id} className="grid gap-4 p-5 md:grid-cols-[220px_1fr_auto] md:items-center">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${meta.className}`} />
                  <span className="font-semibold text-foreground">{check.label}</span>
                </div>
                <p className="text-sm leading-7 text-foreground/62">{check.description}</p>
                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/64">
                    {check.value}
                  </span>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
