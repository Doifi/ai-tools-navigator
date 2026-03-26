"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, Flame, Layers3, MousePointerClick } from "lucide-react";

import { CategoryFilterBar } from "@/components/categories/CategoryFilterBar";
import type {
  CategoryFilterValue,
  CategorySortValue,
  CategoryViewMode
} from "@/components/categories/CategoryFilterBar";
import { CategoryPagination } from "@/components/categories/CategoryPagination";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolCard } from "@/components/ui/ToolCard";
import { mapApiCategoryToCard, mapApiToolToCard } from "@/lib/api-mappers";
import { getIcon } from "@/lib/mock/icon-map";
import { cn, formatDate } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { useTools } from "@/hooks/useTools";
import type { Enums } from "@/types/supabase";

const PAGE_SIZE = 12;

function toApiSort(sort: CategorySortValue) {
  switch (sort) {
    case "hot":
      return "popular" as const;
    case "clicks":
      return "click" as const;
    case "latest":
    default:
      return "latest" as const;
  }
}

function toPriceFilter(filter: CategoryFilterValue): Enums<"price_model"> | null {
  switch (filter) {
    case "free":
      return "free";
    case "paid":
      return "paid";
    case "trial":
      return "freemium";
    default:
      return null;
  }
}

function ToolListRow({ tool }: { tool: ReturnType<typeof mapApiToolToCard> }) {
  const Icon = getIcon(tool.icon);

  return (
    <div className="surface-panel flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start">
      <div className="flex flex-1 gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-brand/15 via-white to-accent-coral/15 text-brand">
          {tool.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tool.logoUrl} alt={`${tool.name} logo`} className="h-full w-full object-cover" />
          ) : (
            <Icon className="h-7 w-7" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-semibold text-foreground">{tool.name}</h3>
                {tool.featured ? <Badge tone="new">推荐</Badge> : null}
              </div>
              <p className="mt-2 text-sm font-medium text-foreground/64">{tool.tagline}</p>
            </div>

            <Badge tone={tool.pricing === "Paid" ? "paid" : "free"}>
              {tool.pricing === "Freemium" ? "免费试用" : tool.pricing === "Free" ? "免费" : "付费"}
            </Badge>
          </div>

          <p className="mt-4 text-sm leading-7 text-foreground/72">{tool.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tool.badges.map((badge) => (
              <Badge key={`${badge.label}-${badge.tone}`} tone={badge.tone}>
                {badge.label}
              </Badge>
            ))}
          </div>

          <div className="mt-5 grid gap-3 text-sm text-foreground/62 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand" />
              {tool.stats?.find((stat) => stat.label === "浏览")?.value ?? "0"} 浏览
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-accent-coral" />
              {tool.stats?.find((stat) => stat.label === "点击")?.value ?? "0"} 点击
            </div>
            <div>更新于 {formatDate(tool.updatedAt)}</div>
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 lg:w-auto lg:min-w-[180px]">
        <Link
          href={`/tools/${tool.id}`}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/90"
        >
          查看详情
        </Link>
        <Link
          href={tool.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line/80 bg-white px-5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
        >
          官网直达
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

interface ToolsCatalogPageClientProps {
  initialSort?: CategorySortValue;
}

/**
 * Dedicated tools catalog page.
 */
export function ToolsCatalogPageClient({
  initialSort = "hot"
}: ToolsCatalogPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilterValue>("all");
  const [activeSort, setActiveSort] = useState<CategorySortValue>(initialSort);
  const [viewMode, setViewMode] = useState<CategoryViewMode>("grid");
  const [page, setPage] = useState(1);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>("all");

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    mutate: reloadCategories
  } = useCategories();

  const activeCategory = categories.find((item) => item.slug === activeCategorySlug);

  const {
    tools,
    pagination,
    isLoading: toolsLoading,
    error: toolsError,
    mutate: reloadTools
  } = useTools({
    page,
    limit: PAGE_SIZE,
    category: activeCategory?.id ?? null,
    sort: toApiSort(activeSort),
    priceModel: toPriceFilter(activeFilter),
    apiAvailable: activeFilter === "api" ? true : null
  });

  useEffect(() => {
    setPage(1);
  }, [activeFilter, activeSort, activeCategorySlug]);

  const toolCards = useMemo(() => tools.map(mapApiToolToCard), [tools]);
  const categoryCards = useMemo(() => categories.map(mapApiCategoryToCard), [categories]);

  return (
    <Container className="space-y-10 py-10 sm:space-y-12 sm:py-14">
      <section className="surface-panel overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-coral/14 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Tools Hub</p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              热门工具
            </h1>
            <p className="mt-5 text-base leading-8 text-foreground/70">
              这里是独立的工具列表页。支持分类筛选、价格筛选、排序和网格/列表切换，不再和首页内容混在一起。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-line/70 bg-white/88 p-5">
              <Flame className="h-5 w-5 text-accent-coral" />
              <p className="mt-4 text-3xl font-semibold text-foreground">{pagination.total}</p>
              <p className="mt-2 text-sm text-foreground/58">当前结果</p>
            </div>
            <div className="rounded-[1.5rem] border border-line/70 bg-white/88 p-5">
              <Layers3 className="h-5 w-5 text-brand" />
              <p className="mt-4 text-3xl font-semibold text-foreground">{categories.length}</p>
              <p className="mt-2 text-sm text-foreground/58">可选分类</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Quick Categories</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              按分类筛选
            </h2>
          </div>

          <Link
            href="/categories"
            className="text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            查看全部分类
          </Link>
        </div>

        {categoriesError ? (
          <Card className="space-y-4">
            <h3 className="font-display text-2xl font-semibold text-foreground">分类加载失败</h3>
            <p className="text-sm leading-7 text-foreground/68">{categoriesError.message}</p>
            <Button type="button" variant="outline" onClick={() => void reloadCategories()}>
              重试
            </Button>
          </Card>
        ) : categoriesLoading ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-11 w-28 animate-pulse rounded-full bg-background" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveCategorySlug("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                activeCategorySlug === "all"
                  ? "border-transparent bg-foreground text-white shadow-soft"
                  : "border-line/70 bg-white text-foreground/68 hover:border-brand/25 hover:text-brand"
              )}
            >
              全部分类
            </button>

            {categoryCards.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategorySlug(category.slug)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  activeCategorySlug === category.slug
                    ? "border-transparent bg-foreground text-white shadow-soft"
                    : "border-line/70 bg-white text-foreground/68 hover:border-brand/25 hover:text-brand"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <CategoryFilterBar
          activeFilter={activeFilter}
          activeSort={activeSort}
          viewMode={viewMode}
          resultCount={pagination.total}
          onFilterChange={setActiveFilter}
          onSortChange={setActiveSort}
          onViewModeChange={setViewMode}
        />

        {toolsError ? (
          <Card className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">工具加载失败</h2>
            <p className="text-sm leading-7 text-foreground/68">{toolsError.message}</p>
            <Button type="button" variant="outline" onClick={() => void reloadTools()}>
              重试
            </Button>
          </Card>
        ) : toolsLoading ? (
          <div
            className={cn(
              viewMode === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "space-y-5"
            )}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "animate-pulse rounded-[1.75rem] bg-background",
                  viewMode === "grid" ? "h-[360px]" : "h-[240px]"
                )}
              />
            ))}
          </div>
        ) : toolCards.length === 0 ? (
          <Card className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              没有找到符合条件的工具
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-foreground/64">
              当前筛选条件下没有结果，可以切换分类或重置筛选后再看。
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={() => {
                setActiveFilter("all");
                setActiveSort(initialSort);
                setActiveCategorySlug("all");
                setPage(1);
              }}
            >
              重置筛选
            </Button>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {toolCards.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {toolCards.map((tool) => (
              <ToolListRow key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <CategoryPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPrev={() => setPage((value) => Math.max(1, value - 1))}
          onNext={() => setPage((value) => Math.min(pagination.totalPages, value + 1))}
        />
      </section>
    </Container>
  );
}

export default ToolsCatalogPageClient;
