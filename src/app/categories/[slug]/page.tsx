import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CategoryPageClient } from "@/components/categories/CategoryPageClient";
import { getOfficialApiCategories } from "@/lib/official-tools-sync";
import { resolveCategorySlugAlias } from "@/lib/routing/legacy";
import { createPageMetadata } from "@/lib/seo";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedSlug = resolveCategorySlugAlias(params.slug);

  if (hasReadableSupabaseEnv()) {
    try {
      const supabase = createReadableSupabaseClient();
      const { data: category } = await supabase
        .from("categories")
        .select("name, slug, description")
        .eq("slug", resolvedSlug)
        .maybeSingle();

      if (category) {
        return createPageMetadata({
          title: `${category.name}工具分类`,
          description:
            category.description ??
            `浏览 ${category.name} 分类下的 AI 工具，查看官网入口、功能特点和相关教程。`,
          path: `/categories/${category.slug}`,
          keywords: [category.name, `${category.name} AI 工具`, "AI 工具分类"]
        });
      }
    } catch (error) {
      console.error("Category metadata generation failed:", error);
    }
  }

  const fallbackCategory = getOfficialApiCategories().find((category) => category.slug === resolvedSlug);

  return createPageMetadata({
    title: fallbackCategory ? `${fallbackCategory.name}工具分类` : "AI 工具分类",
    description:
      fallbackCategory?.description ??
      "按使用场景浏览 AI 工具分类，快速找到适合当前工作流的 AI 产品。",
    path: `/categories/${resolvedSlug}`,
    keywords: [fallbackCategory?.name ?? "AI 工具分类", "AI 工具", "AI 导航"]
  });
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedSlug = resolveCategorySlugAlias(params.slug);

  if (resolvedSlug !== params.slug) {
    redirect(`/categories/${resolvedSlug}`);
  }

  return <CategoryPageClient slug={resolvedSlug} />;
}
