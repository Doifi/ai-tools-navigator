import type { MetadataRoute } from "next";

import { getMockApiPosts } from "@/lib/mock/api-fallback";
import { getOfficialApiCategories, getOfficialApiTools } from "@/lib/official-tools-sync";
import { absoluteUrl } from "@/lib/seo";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";

export const dynamic = "force-dynamic";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/tools", priority: 0.9 },
  { path: "/categories", priority: 0.85 },
  { path: "/lobster", priority: 0.85 },
  { path: "/posts", priority: 0.8 },
  { path: "/submit", priority: 0.55 }
];

function toSitemapItem(
  path: string,
  priority: number,
  lastModified?: string | null,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly"
) {
  return {
    url: absoluteUrl(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority
  } satisfies MetadataRoute.Sitemap[number];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = staticRoutes.map((route) =>
    toSitemapItem(route.path, route.priority, null, route.path === "/" ? "daily" : "weekly")
  );

  if (!hasReadableSupabaseEnv()) {
    const categoryRoutes = getOfficialApiCategories().map((category) =>
      toSitemapItem(`/categories/${category.slug}`, 0.75, category.created_at)
    );
    const toolRoutes = getOfficialApiTools().map((tool) =>
      toSitemapItem(`/tools/${tool.slug}`, 0.72, tool.updated_at ?? tool.published_at)
    );
    const postRoutes = getMockApiPosts().map((post) =>
      toSitemapItem(`/posts/${post.slug}`, 0.7, post.published_at ?? post.created_at)
    );

    return [...routes, ...categoryRoutes, ...toolRoutes, ...postRoutes];
  }

  try {
    const supabase = createReadableSupabaseClient();
    const [{ data: categories }, { data: tools }, { data: posts }] = await Promise.all([
      supabase.from("categories").select("slug, created_at").order("sort_order", { ascending: true }),
      supabase
        .from("tools")
        .select("slug, updated_at, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1000),
      supabase
        .from("posts")
        .select("slug, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1000)
    ]);

    const categoryRoutes = (categories ?? []).map((category) =>
      toSitemapItem(`/categories/${category.slug}`, 0.75, category.created_at)
    );
    const toolRoutes = (tools ?? []).map((tool) =>
      toSitemapItem(`/tools/${tool.slug}`, 0.72, tool.updated_at ?? tool.published_at ?? tool.created_at)
    );
    const postRoutes = (posts ?? []).map((post) =>
      toSitemapItem(`/posts/${post.slug}`, 0.7, post.published_at ?? post.created_at)
    );

    return [...routes, ...categoryRoutes, ...toolRoutes, ...postRoutes];
  } catch (error) {
    console.error("Sitemap generation failed, falling back to official catalog:", error);

    return [
      ...routes,
      ...getOfficialApiCategories().map((category) =>
        toSitemapItem(`/categories/${category.slug}`, 0.75, category.created_at)
      ),
      ...getOfficialApiTools().map((tool) =>
        toSitemapItem(`/tools/${tool.slug}`, 0.72, tool.updated_at ?? tool.published_at)
      ),
      ...getMockApiPosts().map((post) =>
        toSitemapItem(`/posts/${post.slug}`, 0.7, post.published_at ?? post.created_at)
      )
    ];
  }
}
