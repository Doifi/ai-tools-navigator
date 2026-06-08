import type { Metadata } from "next";

import { CategoriesIndexPageClient } from "@/components/categories/CategoriesIndexPageClient";
import { CatalogDiscoveryLinks } from "@/components/seo/CatalogDiscoveryLinks";
import { getPublicCategories, queryPublicTools } from "@/lib/public-catalog";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AI 工具分类",
  description: "按 AI 绘画、AI 文案、AI 视频、AI 编程、AI 设计、AI 办公、AI 教育、AI 语音等场景浏览工具。",
  path: "/categories",
  keywords: ["AI 工具分类", "AI 绘画", "AI 文案", "AI 视频", "AI 编程", "AI 办公"]
});
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [categories, tools] = await Promise.all([
    getPublicCategories(),
    queryPublicTools({
      page: 1,
      limit: 32,
      sort: "popular"
    })
  ]);

  return (
    <>
      <CategoriesIndexPageClient initialCategories={{ categories }} />
      <CatalogDiscoveryLinks
        title="按场景发现 AI 工具"
        description="这里列出主要分类和热门工具详情页，让分类总览页成为更强的站内发现入口。"
        categories={categories}
        tools={tools.tools}
      />
    </>
  );
}
