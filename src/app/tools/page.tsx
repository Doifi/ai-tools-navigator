import type { Metadata } from "next";

import { CatalogDiscoveryLinks } from "@/components/seo/CatalogDiscoveryLinks";
import { ToolsCatalogPageClient } from "@/components/tools/ToolsCatalogPageClient";
import type { CategorySortValue } from "@/components/categories/CategoryFilterBar";
import { getPublicCategories, PUBLIC_TOOLS_PAGE_SIZE, queryPublicTools } from "@/lib/public-catalog";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "热门 AI 工具库",
  description: "浏览和搜索国内外热门 AI 工具，按热度、最新收录、国内外市场、价格和 API 支持快速筛选。",
  path: "/tools",
  keywords: ["AI 工具库", "AI 工具搜索", "热门 AI 工具", "国内 AI 工具", "国外 AI 工具"]
});
export const dynamic = "force-dynamic";

interface ToolsPageProps {
  searchParams?: {
    q?: string;
    sort?: string;
    market?: string;
  };
}

function normalizeSort(sort?: string): CategorySortValue {
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

function toApiSort(sort: CategorySortValue) {
  switch (sort) {
    case "hot":
      return "popular";
    case "clicks":
      return "click";
    case "latest":
    default:
      return "latest";
  }
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const initialSort = normalizeSort(searchParams?.sort);
  const initialMarket = normalizeMarket(searchParams?.market);
  const initialQuery = searchParams?.q?.trim() ?? "";
  const [categories, tools, discoveryTools] = await Promise.all([
    getPublicCategories(),
    queryPublicTools({
      page: 1,
      limit: PUBLIC_TOOLS_PAGE_SIZE,
      market: initialMarket === "all" ? null : initialMarket,
      query: initialQuery,
      sort: toApiSort(initialSort)
    }),
    queryPublicTools({
      page: 1,
      limit: 50,
      market: initialMarket === "all" ? null : initialMarket,
      query: initialQuery,
      sort: toApiSort(initialSort)
    })
  ]);

  return (
    <>
      <ToolsCatalogPageClient
        initialSort={initialSort}
        initialQuery={initialQuery}
        initialMarket={initialMarket}
        initialCategories={{ categories }}
        initialTools={tools}
      />
      <CatalogDiscoveryLinks
        title="AI 工具快速入口"
        description="这些入口直接写入页面源码，方便搜索引擎从工具库页面发现分类页和具体工具详情页。"
        categories={categories}
        tools={discoveryTools.tools}
      />
    </>
  );
}
