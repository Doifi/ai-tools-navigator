"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { LobsterZoneSection } from "@/components/home/LobsterZoneSection";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { PostCard } from "@/components/ui/PostCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { ToolCard } from "@/components/ui/ToolCard";
import { VerticalScrollPanel } from "@/components/ui/VerticalScrollPanel";
import { mapApiCategoryToCard, mapApiPostToCard, mapApiToolToCard } from "@/lib/api-mappers";
import { useCategories } from "@/hooks/useCategories";
import { usePosts } from "@/hooks/usePosts";
import { useTools } from "@/hooks/useTools";

const hotSearchKeywords = [
  { label: "OpenClaw专区", href: "/lobster" },
  { label: "AI绘画", href: "/categories/ai-drawing" },
  { label: "AI文案", href: "/categories/ai-writing" },
  { label: "AI视频", href: "/categories/ai-video" },
  { label: "AI编程", href: "/categories/ai-coding" }
];

function SectionError({
  title,
  message,
  onRetry
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-[1.75rem] border border-warning/30 bg-warning/5 p-5">
      <p className="text-sm font-semibold text-warning">{title}</p>
      <p className="mt-2 text-sm leading-7 text-foreground/68">{message}</p>
      <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
        重试
      </Button>
    </div>
  );
}

export function HomePageClient() {
  const router = useRouter();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    mutate: reloadCategories
  } = useCategories();
  const {
    tools,
    isLoading: toolsLoading,
    error: toolsError,
    mutate: reloadTools
  } = useTools({ page: 1, limit: 36, sort: "latest" });
  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
    mutate: reloadPosts
  } = usePosts({ page: 1, limit: 4 });

  const categoryCards = useMemo(() => categories.map(mapApiCategoryToCard), [categories]);
  const featuredToolCards = useMemo(
    () =>
      [...tools]
        .sort(
          (a, b) =>
            Number(Boolean(b.is_sponsored)) - Number(Boolean(a.is_sponsored)) ||
            (b.clicks ?? 0) - (a.clicks ?? 0)
        )
        .slice(0, 12)
        .map(mapApiToolToCard),
    [tools]
  );
  const latestToolCards = useMemo(
    () =>
      [...tools]
        .sort(
          (a, b) =>
            new Date(b.published_at ?? b.created_at ?? 0).getTime() -
            new Date(a.published_at ?? a.created_at ?? 0).getTime()
        )
        .slice(0, 12)
        .map(mapApiToolToCard),
    [tools]
  );
  const latestPostCards = useMemo(() => posts.map(mapApiPostToCard), [posts]);

  return (
    <Container className="space-y-16 py-10 sm:space-y-20 sm:py-14 lg:space-y-24 lg:py-16">
      <section className="surface-panel relative overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-coral/14 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="hero-orb left-[-50px] top-10 h-28 w-28 bg-brand/20" />
        <div className="hero-orb right-[-10px] top-4 h-32 w-32 bg-accent-coral/18" />

        <div className="relative mx-auto max-w-4xl text-center opacity-0 animate-fade-up">
          <p className="eyebrow justify-center">AI Navigator</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            发现下一代 AI 工具
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-foreground/68 sm:text-lg">
            收录最优质的人工智能工具，助你提升工作效率
          </p>

          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar
              placeholder="搜索 AI 工具、产品名称或使用场景"
              onSubmit={(value) => {
                const keyword = value.trim();
                router.push(keyword ? `/tools?q=${encodeURIComponent(keyword)}` : "/tools");
              }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {hotSearchKeywords.map((keyword) => (
              <Link
                key={keyword.label}
                href={keyword.href}
                className="rounded-full border border-line/70 bg-white/85 px-4 py-2 text-sm font-medium text-foreground/70 transition hover:-translate-y-0.5 hover:border-brand/30 hover:text-brand"
              >
                {keyword.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LobsterZoneSection />

      <section
        id="categories"
        className="space-y-6 opacity-0 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Categories</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              精选分类
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            查看全部
          </Link>
        </div>

        {categoriesError ? (
          <SectionError
            title="分类加载失败"
            message={categoriesError.message}
            onRetry={() => void reloadCategories()}
          />
        ) : categoriesLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-[1.75rem] bg-background" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {categoryCards.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}
      </section>

      <section
        id="featured"
        className="space-y-6 opacity-0 animate-fade-up"
        style={{ animationDelay: "140ms" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Featured Tools</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              热门工具
            </h2>
          </div>
          <Link
            href="/tools"
            className="text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            查看全部
          </Link>
        </div>

        {toolsError ? (
          <SectionError
            title="工具加载失败"
            message={toolsError.message}
            onRetry={() => void reloadTools()}
          />
        ) : toolsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[360px] animate-pulse rounded-[1.75rem] bg-background" />
            ))}
          </div>
        ) : (
          <VerticalScrollPanel
            hint="向下滚动即可继续浏览更多热门工具"
            items={featuredToolCards.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          />
        )}
      </section>

      <section className="space-y-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Latest Tools</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              最新收录
            </h2>
          </div>
          <Link
            href="/tools?sort=latest"
            className="text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            查看全部
          </Link>
        </div>

        {toolsError ? (
          <SectionError
            title="工具加载失败"
            message={toolsError.message}
            onRetry={() => void reloadTools()}
          />
        ) : toolsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[360px] animate-pulse rounded-[1.75rem] bg-background" />
            ))}
          </div>
        ) : (
          <VerticalScrollPanel
            hint="继续向下滚动，可快速查看后续新收录工具"
            items={latestToolCards.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          />
        )}
      </section>

      <section className="space-y-6 opacity-0 animate-fade-up" style={{ animationDelay: "260ms" }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Latest Posts</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              最新文章
            </h2>
          </div>
          <Link
            href="/posts"
            className="text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            查看全部
          </Link>
        </div>

        {postsError ? (
          <SectionError
            title="文章加载失败"
            message={postsError.message}
            onRetry={() => void reloadPosts()}
          />
        ) : postsLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[320px] animate-pulse rounded-[1.75rem] bg-background" />
            ))}
          </div>
        ) : (
          <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
            {latestPostCards.map((post) => (
              <div key={post.slug} className="min-w-[280px] snap-start md:min-w-0">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-foreground to-brand p-6 text-white shadow-glow opacity-0 animate-fade-up sm:p-8"
        style={{ animationDelay: "320ms" }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Submit CTA
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              提交你的 AI 工具
            </h2>
            <p className="mt-4 text-base leading-8 text-white/78">
              如果你发现了值得收藏的新工具，欢迎提交给我们。当前已经支持完整前端展示，并可按环境切换
              mock 或 Supabase 数据。
            </p>
          </div>

          <Link
            href="/submit"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-foreground transition hover:bg-white/92"
          >
            立即提交
          </Link>
        </div>
      </section>
    </Container>
  );
}

export default HomePageClient;
