import Link from "next/link";
import { ArrowRight, Compass, Sparkles, TrendingUp } from "lucide-react";

import { SearchBar } from "@/components/ui/SearchBar";
import type { Category, Tool } from "@/lib/mock/data";

interface HomeHeroProps {
  toolCount: number;
  categoryCount: number;
  featuredTools: Tool[];
  categories: Category[];
}

/**
 * 首页首屏，聚合搜索、核心卖点和精选工具预览。
 */
export function HomeHero({
  toolCount,
  categoryCount,
  featuredTools,
  categories
}: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-14">
      <div className="hero-orb left-[-80px] top-16 h-36 w-36 bg-brand/20" />
      <div className="hero-orb right-[-20px] top-6 h-40 w-40 bg-accent-coral/20" />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="stagger-enter">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-2 text-sm font-medium text-brand">
            <Sparkles className="h-4 w-4" />
            先用 mock 数据完成前端展示与结构搭建
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            为团队和个人筛出
            <span className="block text-brand">真正值得收藏的 AI 工具。</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70 sm:text-lg">
            这个导航站优先解决两个问题：第一，快速发现工具；第二，帮助用户理解每类工具适合什么场景。现在版本专注前端体验，后续可以无缝接入 API 与后台数据。
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-line/70 bg-white/80 p-4 shadow-soft">
              <p className="text-3xl font-semibold text-foreground">{toolCount}+</p>
              <p className="mt-2 text-sm text-foreground/58">已整理热门工具</p>
            </div>
            <div className="rounded-[1.5rem] border border-line/70 bg-white/80 p-4 shadow-soft">
              <p className="text-3xl font-semibold text-foreground">{categoryCount}</p>
              <p className="mt-2 text-sm text-foreground/58">精选分类入口</p>
            </div>
            <div className="rounded-[1.5rem] border border-line/70 bg-white/80 p-4 shadow-soft">
              <p className="text-3xl font-semibold text-foreground">Mock</p>
              <p className="mt-2 text-sm text-foreground/58">当前数据源模式</p>
            </div>
          </div>
        </div>

        <div className="stagger-enter rounded-[2rem] border border-line/70 bg-white/85 p-5 shadow-glow lg:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-brand/12 via-white to-accent-gold/12 p-5">
              <Compass className="h-6 w-6 text-brand" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-foreground">
                精准导航
              </h2>
              <p className="mt-2 text-sm leading-7 text-foreground/66">
                用分类、标签和文章帮助用户缩短选择路径，而不是单纯堆链接。
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-gradient-to-br from-accent-coral/14 via-white to-brand/10 p-5">
              <TrendingUp className="h-6 w-6 text-accent-coral" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-foreground">
                按场景决策
              </h2>
              <p className="mt-2 text-sm leading-7 text-foreground/66">
                不只是告诉用户“有什么”，也告诉用户“什么时候值得用”。
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-line/70 bg-background/85 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/45">
                  Featured Snapshot
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  本周值得关注
                </h2>
              </div>
              <Link
                href="/#featured"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand"
              >
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {featuredTools.slice(0, 3).map((tool, index) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between rounded-2xl border border-line/70 bg-white/80 px-4 py-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                      0{index + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{tool.name}</p>
                    <p className="mt-1 text-sm text-foreground/58">{tool.tagline}</p>
                  </div>
                  <Link
                    href={`/tools/${tool.id}`}
                    className="rounded-full border border-line/70 px-3 py-2 text-xs font-semibold text-foreground/65 transition hover:border-brand/30 hover:text-brand"
                  >
                    查看
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground/70 transition hover:text-brand"
                >
                  #{category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;

