import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, Mail, Newspaper, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { createPageMetadata } from "@/lib/seo";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hasAdminSupabaseEnv, hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata({
  title: "AI 工具教程与资讯",
  description: "围绕真实工作流整理 AI 工具教程、OpenClaw 使用指南、产品对比、选型建议和实操经验。",
  path: "/posts",
  keywords: ["AI 工具教程", "AI 资讯", "OpenClaw 教程", "AI 工具对比", "AI 工作流"]
});

interface PostsPageProps {
  searchParams?: {
    page?: string;
    category?: string;
  };
}

const PAGE_SIZE = 9;

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const currentPage = Math.max(1, Number(searchParams?.page || "1"));
  const selectedCategory = searchParams?.category || "";
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  if (!hasPublicSupabaseEnv() && !hasAdminSupabaseEnv()) {
    throw new Error("Missing Supabase environment variables for posts pages.");
  }

  const supabase = hasPublicSupabaseEnv()
    ? createServerSupabaseClient()
    : createAdminSupabaseClient();

  let postsQuery = supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image, author, views, published_at, category_id, categories(name, slug)",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (selectedCategory) {
    postsQuery = postsQuery.eq("category_id", selectedCategory);
  }

  const [{ data: posts, count }, { data: categories }, { data: categoryRows }, { data: recommendedTools }] =
    await Promise.all([
      postsQuery.range(from, to),
      supabase.from("categories").select("id, name, slug").order("sort_order", { ascending: true }),
      supabase.from("posts").select("category_id").eq("status", "published"),
      supabase
        .from("tools")
        .select("id, name, slug, description, views")
        .eq("status", "published")
        .order("views", { ascending: false })
        .limit(5)
    ]);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const categoryCountMap = (categoryRows ?? []).reduce<Record<string, number>>((accumulator, row) => {
    if (!row.category_id) {
      return accumulator;
    }

    accumulator[row.category_id] = (accumulator[row.category_id] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <Container className="space-y-10 py-10 sm:space-y-12 sm:py-14">
      <section className="surface-panel bg-gradient-to-br from-brand/12 via-white to-accent-coral/10 p-7 sm:p-9">
        <p className="eyebrow">Knowledge Hub</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
          AI工具教程与资讯
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-foreground/68">
          学习如何使用AI工具提升效率，围绕真实工作流整理教程、对比、选型建议和实操经验。
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/posts"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                !selectedCategory
                  ? "border-foreground bg-foreground text-white"
                  : "border-line/70 bg-white text-foreground/72 hover:border-brand/40 hover:text-brand"
              }`}
            >
              全部文章
            </Link>
            {(categories ?? []).map((category) => (
              <Link
                key={category.id}
                href={`/posts?category=${category.id}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category.id
                    ? "border-foreground bg-foreground text-white"
                    : "border-line/70 bg-white text-foreground/72 hover:border-brand/40 hover:text-brand"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {(posts ?? []).map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="group block">
                <article className="surface-panel h-full overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-glow">
                  {post.cover_image ? (
                    <div
                      className="h-44 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.cover_image})` }}
                    />
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-brand/16 via-accent-coral/12 to-white" />
                  )}

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3 text-xs text-foreground/46">
                      <span>{post.categories?.name ?? "未分类"}</span>
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("zh-CN") : ""}</span>
                    </div>
                    <h2 className="font-display text-2xl font-semibold leading-snug text-foreground">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-7 text-foreground/66">{post.excerpt}</p>
                    <div className="flex items-center justify-between border-t border-line/70 pt-4 text-sm text-foreground/52">
                      <span>{post.author}</span>
                      <span className="inline-flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {post.views ?? 0}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {posts?.length ? null : (
            <div className="surface-panel p-8 text-center">
              <h2 className="font-display text-2xl font-semibold text-foreground">当前没有文章</h2>
              <p className="mt-3 text-sm text-foreground/62">先去后台新增文章，发布后这里会自动更新。</p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-foreground/56">
              第 {currentPage} / {totalPages} 页
            </p>

            <div className="flex gap-3">
              <Link
                href={
                  currentPage > 1
                    ? `/posts?page=${currentPage - 1}${selectedCategory ? `&category=${selectedCategory}` : ""}`
                    : "#"
                }
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition ${
                  currentPage > 1
                    ? "border-line/70 bg-white text-foreground hover:border-brand/40 hover:text-brand"
                    : "pointer-events-none border-line/50 bg-background text-foreground/30"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                上一页
              </Link>

              <Link
                href={
                  currentPage < totalPages
                    ? `/posts?page=${currentPage + 1}${selectedCategory ? `&category=${selectedCategory}` : ""}`
                    : "#"
                }
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition ${
                  currentPage < totalPages
                    ? "border-line/70 bg-white text-foreground hover:border-brand/40 hover:text-brand"
                    : "pointer-events-none border-line/50 bg-background text-foreground/30"
                }`}
              >
                下一页
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="surface-panel p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              <h2 className="font-display text-2xl font-semibold text-foreground">热门分类</h2>
            </div>
            <div className="mt-5 space-y-3">
              {(categories ?? []).map((category) => (
                <Link
                  key={category.id}
                  href={`/posts?category=${category.id}`}
                  className="flex items-center justify-between rounded-2xl border border-line/70 bg-white px-4 py-3 text-sm transition hover:border-brand/40 hover:text-brand"
                >
                  <span>{category.name}</span>
                  <span className="text-foreground/46">{categoryCountMap[category.id] ?? 0}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-brand" />
              <h2 className="font-display text-2xl font-semibold text-foreground">热门工具推荐</h2>
            </div>
            <div className="mt-5 space-y-3">
              {(recommendedTools ?? []).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="block rounded-2xl border border-line/70 bg-white px-4 py-4 transition hover:border-brand/40"
                >
                  <p className="font-semibold text-foreground">{tool.name}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/62">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" />
              <h2 className="font-display text-2xl font-semibold text-foreground">订阅更新</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-foreground/66">
              先预留订阅位，后续可以接入真正的邮件服务。
            </p>
            <div className="mt-5 space-y-3">
              <input
                type="email"
                placeholder="输入你的邮箱"
                className="h-12 w-full rounded-2xl border border-line/70 bg-white px-4 text-sm outline-none transition focus:border-brand"
              />
              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/92"
              >
                订阅
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
