import type { Metadata } from "next";

import { SubmitPageClient } from "@/components/submit/SubmitPageClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "提交 AI 工具",
  description: "提交你推荐的 AI 工具，填写官网、分类、价格、API 支持和联系方式，进入后台审核流程。",
  path: "/submit",
  keywords: ["提交 AI 工具", "推荐 AI 工具", "AI 工具收录", "AI 导航提交"]
});

export default function SubmitPage() {
  return <SubmitPageClient />;
}
