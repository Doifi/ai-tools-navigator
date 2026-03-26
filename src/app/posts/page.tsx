import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { PostsSidebar } from "@/components/posts/PostsSidebar";
import { PostCard } from "@/components/ui/PostCard";
import { latestMockPosts, mapMockPostToCard, mockPostCategories } from "@/lib/mock";

const PAGE_SIZE = 9;

interface PostsPageProps {
  searchParams?: {
    page?: string;
    category?: string;
  };
}

function buildPostsHref(page: number, category?: string) {
  const query = new URLSearchParams();
  query.set("page", String(page));

  if (category) {
    query.set("category", category);
  }

  return `/posts?${query.toString()}`;
}

export default function PostsPage({ searchParams }: PostsPageProps) {
  const currentCategorySlug = searchParams?.category;
  const rawPage = Number(searchParams?.page ?? "1");
  const filteredPosts = currentCategorySlug
    ? latestMockPosts.filter((post) => post.categorySlug === currentCategorySlug)
    : latestMockPosts;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Number.isFinite(rawPage) ? Math.min(Math.max(rawPage, 1), totalPages) : 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPagePosts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);
  const currentCategory = mockPostCategories.find((category) => category.slug === currentCategorySlug);

  return (
    <Container className="space-y-10 py-10 sm:space-y-12 sm:py-14">
      <section className="surface-panel overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-gold/14 p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">Posts</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-foreground sm:text-5xl">
          AI工具教程与资讯
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70">
          学习如何使用AI工具提升效率
        </p>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-foreground/56">
                {currentCategory
                  ? `当前分类：${currentCategory.name}`
                  : `共 ${latestMockPosts.length} 篇文章，按最新收录排序`}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
                {currentCategory ? `${currentCategory.name} 相关文章` : "最新文章"}
              </h2>
            </div>

            {currentCategory ? (
              <Link
                href="/posts"
                className="text-sm font-semibold text-brand transition hover:text-brand-strong"
              >
                清除筛选
              </Link>
            ) : null}
          </div>

          {currentPagePosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {currentPagePosts.map((post) => (
                <PostCard key={post.slug} post={mapMockPostToCard(post)} />
              ))}
            </div>
          ) : (
            <div className="surface-panel p-8 text-center">
              <h3 className="font-display text-2xl font-semibold text-foreground">暂无相关文章</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/62">
                当前分类下还没有文章，可以先查看其他分类或返回全部文章列表。
              </p>
              <Link
                href="/posts"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/90"
              >
                查看全部文章
              </Link>
            </div>
          )}

          <div className="surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/62">
              第 {currentPage} 页 / 共 {totalPages} 页
            </p>

            <div className="flex gap-3">
              {currentPage > 1 ? (
                <Link
                  href={buildPostsHref(currentPage - 1, currentCategorySlug)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-line/80 bg-white px-5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
                >
                  上一页
                </Link>
              ) : (
                <span className="inline-flex h-11 items-center justify-center rounded-full border border-line/70 bg-background px-5 text-sm font-semibold text-foreground/35">
                  上一页
                </span>
              )}

              {currentPage < totalPages ? (
                <Link
                  href={buildPostsHref(currentPage + 1, currentCategorySlug)}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/90"
                >
                  下一页
                </Link>
              ) : (
                <span className="inline-flex h-11 items-center justify-center rounded-full bg-background px-5 text-sm font-semibold text-foreground/35">
                  下一页
                </span>
              )}
            </div>
          </div>
        </div>

        <PostsSidebar />
      </section>
    </Container>
  );
}
