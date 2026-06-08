import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CategoryPageClient } from "@/components/categories/CategoryPageClient";
import { CatalogDiscoveryLinks } from "@/components/seo/CatalogDiscoveryLinks";
import { getOfficialApiCategories } from "@/lib/official-tools-sync";
import { getPublicCategories, PUBLIC_TOOLS_PAGE_SIZE, queryPublicTools } from "@/lib/public-catalog";
import { resolveCategorySlugAlias } from "@/lib/routing/legacy";
import { createPageMetadata } from "@/lib/seo";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";

export const dynamic = "force-dynamic";

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedSlug = resolveCategorySlugAlias(params.slug);

  if (resolvedSlug !== params.slug) {
    redirect(`/categories/${resolvedSlug}`);
  }

  const categories = await getPublicCategories();
  const category = categories.find((item) => item.slug === resolvedSlug);
  const [tools, discoveryTools] = category
    ? await Promise.all([
        queryPublicTools({
          page: 1,
          limit: PUBLIC_TOOLS_PAGE_SIZE,
          categoryId: category.id,
          sort: "latest"
        }),
        queryPublicTools({
          page: 1,
          limit: 50,
          categoryId: category.id,
          sort: "popular"
        })
      ])
    : [undefined, undefined];

  return (
    <>
      <CategoryPageClient
        slug={resolvedSlug}
        initialCategories={{ categories }}
        initialTools={tools}
      />
      <CatalogDiscoveryLinks
        title={`${category?.name ?? "AI 工具分类"}工具入口`}
        description="这些同类工具链接直接出现在分类页源码中，帮助搜索引擎理解分类和详情页之间的关系。"
        categories={categories}
        tools={discoveryTools?.tools ?? []}
      />
    </>
  );
}
