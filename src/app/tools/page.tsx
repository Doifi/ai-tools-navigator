import type { Metadata } from "next";

import { ToolsCatalogPageClient } from "@/components/tools/ToolsCatalogPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "热门 AI 工具库",
  description: "浏览和搜索国内外热门 AI 工具，按热度、最新收录、国内外市场、价格和 API 支持快速筛选。",
  path: "/tools",
  keywords: ["AI 工具库", "AI 工具搜索", "热门 AI 工具", "国内 AI 工具", "国外 AI 工具"]
});

interface ToolsPageProps {
  searchParams?: {
    q?: string;
    sort?: string;
    market?: string;
  };
}

function normalizeSort(sort?: string) {
  if (sort === "latest" || sort === "clicks" || sort === "hot") {
    return sort;
  }

  return "hot";
}

function normalizeMarket(market?: string) {
  if (market === "china" || market === "global") {
    return market;
  }

  return "all";
}

export default function ToolsPage({ searchParams }: ToolsPageProps) {
  return (
    <ToolsCatalogPageClient
      initialSort={normalizeSort(searchParams?.sort)}
      initialQuery={searchParams?.q?.trim() ?? ""}
      initialMarket={normalizeMarket(searchParams?.market)}
    />
  );
}
