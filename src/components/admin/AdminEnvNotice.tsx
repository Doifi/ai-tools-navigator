import { AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/Card";

interface AdminEnvNoticeProps {
  title?: string;
  description?: string;
  detailTitle?: string;
  detailItems?: string[];
}

export function AdminEnvNotice({
  title = "后台暂未配置完成",
  description = "当前部署缺少后台所需的 Supabase 管理环境变量，后台页面无法读取或写入数据。前台访问不受影响。",
  detailTitle = "需要补齐的变量：",
  detailItems = ["`NEXT_PUBLIC_SUPABASE_URL`", "`SUPABASE_SERVICE_ROLE_KEY`"]
}: AdminEnvNoticeProps) {
  return (
    <Card className="space-y-5">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <div>
        <h2 className="font-display text-3xl font-semibold text-foreground">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/68">{description}</p>
      </div>

      {detailItems.length > 0 ? (
        <div className="rounded-[1.5rem] border border-line/70 bg-background/80 p-5 text-sm leading-7 text-foreground/68">
          <p>{detailTitle}</p>
          <div className="mt-3 space-y-1">
            {detailItems.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

export default AdminEnvNotice;
