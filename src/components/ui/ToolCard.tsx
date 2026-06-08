import Link from "next/link";
import { ArrowUpRight, Bookmark, Eye, MousePointerClick, Star } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getIcon } from "@/lib/mock/icon-map";
import { getToolPath } from "@/lib/tool-routes";
import type { Tool } from "@/lib/mock/data";
import { formatDate } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
}

/**
 * Reusable tool card for homepage, category pages, and related tool sections.
 * Supports both mock-driven cards and API-driven cards.
 */
export function ToolCard({ tool }: ToolCardProps) {
  const Icon = getIcon(tool.icon);
  const stats =
    tool.stats ??
    [
      ...(typeof tool.rating === "number"
        ? [{ label: "评分", value: `${tool.rating.toFixed(1)}` }]
        : []),
      ...(typeof tool.saves === "number"
        ? [{ label: "收藏", value: tool.saves.toLocaleString("zh-CN") }]
        : []),
      { label: "更新", value: formatDate(tool.updatedAt) }
    ];

  return (
    <Card className="group flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand/15 via-white to-accent-coral/15 text-brand">
            {tool.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tool.logoUrl} alt={`${tool.name} logo`} className="h-full w-full object-cover" />
            ) : (
              <Icon className="h-6 w-6" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl font-semibold text-foreground">{tool.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-foreground/60">{tool.tagline}</p>
          </div>
        </div>

        <div className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/55">
          {tool.pricing}
        </div>
      </div>

      <p className="line-clamp-3 text-sm leading-7 text-foreground/72">{tool.description}</p>

      <div className="flex flex-wrap gap-2">
        {tool.badges.map((badge) => (
          <Badge key={`${badge.label}-${badge.tone}`} tone={badge.tone}>
            {badge.label}
          </Badge>
        ))}
      </div>

      <div
        className={`grid gap-3 rounded-3xl bg-background/90 p-4 text-sm text-foreground/65 ${
          stats.length >= 3 ? "sm:grid-cols-3" : stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"
        }`}
      >
        {stats.map((stat, index) => (
          <div key={`${stat.label}-${index}`} className="flex items-center gap-2">
            {stat.label === "评分" ? <Star className="h-4 w-4 text-accent-gold" /> : null}
            {stat.label === "收藏" ? <Bookmark className="h-4 w-4 text-brand" /> : null}
            {stat.label === "浏览" ? <Eye className="h-4 w-4 text-brand" /> : null}
            {stat.label === "点击" ? <MousePointerClick className="h-4 w-4 text-accent-coral" /> : null}
            <span>
              {stat.value} {stat.label === "更新" ? "" : stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <Link
          href={getToolPath(tool)}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-white transition hover:bg-foreground/90"
        >
          查看详情
        </Link>
        <Link
          href={tool.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line/80 bg-white text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
        >
          官网直达
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </Card>
  );
}

export default ToolCard;
