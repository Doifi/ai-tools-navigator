import Link from "next/link";
import { CalendarDays, Eye, Globe2, MousePointerClick, UserRound } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { MockTool } from "@/lib/mock";
import { formatDate } from "@/lib/utils";

interface ToolInfoCardProps {
  tool: MockTool;
}

/**
 * 详情页右侧信息卡片，桌面端保持 sticky。
 */
export function ToolInfoCard({ tool }: ToolInfoCardProps) {
  return (
    <Card className="xl:sticky xl:top-24">
      <p className="eyebrow">Tool Facts</p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">关键信息</h2>

      <div className="mt-6 space-y-4">
        <div className="rounded-[1.5rem] bg-background/85 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
            <Globe2 className="h-4 w-4 text-brand" />
            官网链接
          </div>
          <Link
            href={tool.website}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block break-all text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            {tool.website}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
              <CalendarDays className="h-4 w-4 text-accent-coral" />
              上线时间
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">{formatDate(tool.launchedAt)}</p>
          </div>

          <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
              <UserRound className="h-4 w-4 text-accent-mint" />
              开发者
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">{tool.developer}</p>
          </div>

          <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
              <Eye className="h-4 w-4 text-brand" />
              浏览量
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {tool.viewCount.toLocaleString("zh-CN")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
              <MousePointerClick className="h-4 w-4 text-accent-gold" />
              点击量
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {tool.clickCount.toLocaleString("zh-CN")}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ToolInfoCard;

