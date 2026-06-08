"use client";

import Link from "next/link";
import { Layers3, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { mapApiCategoryToCard } from "@/lib/api-mappers";
import { useCategories } from "@/hooks/useCategories";
import type { CategoriesResponse } from "@/hooks/useCategories";

/**
 * Dedicated categories index page.
 */
interface CategoriesIndexPageClientProps {
  initialCategories?: CategoriesResponse;
}

export function CategoriesIndexPageClient({ initialCategories }: CategoriesIndexPageClientProps) {
  const { categories, isLoading, error, mutate } = useCategories({
    fallbackData: initialCategories
  });

  const categoryCards = categories.map(mapApiCategoryToCard);
  const totalTools = categories.reduce((sum, category) => sum + (category.toolCount ?? 0), 0);

  return (
    <Container className="space-y-10 py-10 sm:space-y-12 sm:py-14">
      <section className="surface-panel overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-gold/14 p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">Categories Hub</p>
        <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-semibold text-foreground sm:text-5xl">
              精选分类
            </h1>
            <p className="mt-5 text-base leading-8 text-foreground/70">
              这里是独立的分类总览页。按场景和任务类型浏览所有 AI 工具分类，不再和首页共用同一个入口。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-line/70 bg-white/88 p-5">
              <Layers3 className="h-5 w-5 text-brand" />
              <p className="mt-4 text-3xl font-semibold text-foreground">{categories.length}</p>
              <p className="mt-2 text-sm text-foreground/58">分类数量</p>
            </div>
            <div className="rounded-[1.5rem] border border-line/70 bg-white/88 p-5">
              <Sparkles className="h-5 w-5 text-accent-coral" />
              <p className="mt-4 text-3xl font-semibold text-foreground">{totalTools}</p>
              <p className="mt-2 text-sm text-foreground/58">收录工具</p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <Card className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-foreground">分类加载失败</h2>
          <p className="text-sm leading-7 text-foreground/68">{error.message}</p>
          <Button type="button" variant="outline" onClick={() => void mutate()}>
            重试
          </Button>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-[1.75rem] bg-background" />
          ))}
        </div>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">All Categories</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                按分类浏览
              </h2>
            </div>

            <Link
              href="/tools"
              className="text-sm font-semibold text-brand transition hover:text-brand-strong"
            >
              去看热门工具
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {categoryCards.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

export default CategoriesIndexPageClient;
