import type { Metadata } from "next";

import { CategoriesIndexPageClient } from "@/components/categories/CategoriesIndexPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "AI 工具分类",
  description: "按 AI 绘画、AI 文案、AI 视频、AI 编程、AI 设计、AI 办公、AI 教育、AI 语音等场景浏览工具。",
  path: "/categories",
  keywords: ["AI 工具分类", "AI 绘画", "AI 文案", "AI 视频", "AI 编程", "AI 办公"]
});

export default function CategoriesPage() {
  return <CategoriesIndexPageClient />;
}
