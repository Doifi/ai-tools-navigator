import type { Metadata } from "next";

import { HomePageClient } from "@/components/home/HomePageClient";
import { createPageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: ["AI 导航首页", "AI 工具推荐", "OpenClaw 专区", "AI 工具合集"]
});

export default function HomePage() {
  return <HomePageClient />;
}
