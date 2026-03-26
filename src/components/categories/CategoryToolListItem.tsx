import Link from "next/link";
import { ArrowUpRight, Eye, MousePointerClick, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getIcon } from "@/lib/mock/icon-map";
import type { MockTool } from "@/lib/mock";
import { formatDate } from "@/lib/utils";

interface CategoryToolListItemProps {
  tool: MockTool;
}

/**
 * 列表视图下的工具行组件，展示更多统计与描述信息。
 */
export function CategoryToolListItem({ tool }: CategoryToolListItemProps) {
  const Icon = getIcon(tool.logo);

  return (
    <Card className="flex h-full flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start">
      <div className="flex flex-1 gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-brand/15 via-white to-accent-coral/15 text-brand">
          <Icon className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-semibold text-foreground">{tool.name}</h3>
                {tool.isSponsored ? <Badge tone="new">推荐</Badge> : null}
                {tool.apiAvailable ? <Badge tone="api">API</Badge> : null}
              </div>
              <p className="mt-2 text-sm font-medium text-foreground/64">{tool.tagline}</p>
            </div>

            <Badge tone={tool.priceModel === "Paid" ? "paid" : "free"}>
              {tool.priceModel === "Freemium" ? "免费试用" : tool.priceModel}
            </Badge>
          </div>

          <p className="mt-4 text-sm leading-7 text-foreground/72">{tool.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <Badge key={tag} tone="plugin">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-5 grid gap-3 text-sm text-foreground/62 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent-gold" />
              {tool.rating.toFixed(1)} 评分
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand" />
              {tool.viewCount.toLocaleString("zh-CN")} 浏览
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-accent-coral" />
              {tool.clickCount.toLocaleString("zh-CN")} 点击
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-mint" />
              收录于 {formatDate(tool.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 lg:w-auto lg:min-w-[180px]">
        <Link
          href={`/tools/${tool.id}`}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/90"
        >
          查看详情
        </Link>
        <Link
          href={tool.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line/80 bg-white px-5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
        >
          官网直达
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

export default CategoryToolListItem;
