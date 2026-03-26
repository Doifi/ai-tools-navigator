"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Globe2,
  HelpCircle,
  MousePointerClick,
  Sparkles,
  UserRound
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { ToolActionPanel } from "@/components/tools/ToolActionPanel";
import { ToolCommentsPlaceholder } from "@/components/tools/ToolCommentsPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PostCard } from "@/components/ui/PostCard";
import { ToolCard } from "@/components/ui/ToolCard";
import {
  type ApiPost,
  type ApiTool,
  mapApiPostToCard,
  mapApiToolToCard,
  mapApiToolToDetailModel
} from "@/lib/api-mappers";
import { fetcher } from "@/lib/fetcher";
import { getIcon } from "@/lib/mock/icon-map";
import { cn, formatDate } from "@/lib/utils";
import { usePosts } from "@/hooks/usePosts";
import { useTools } from "@/hooks/useTools";

type DetailTab = "overview" | "features" | "scenarios" | "faq";

interface ToolDetailResponse {
  tool: ApiTool;
}

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "详细介绍" },
  { id: "features", label: "功能特点" },
  { id: "scenarios", label: "适用场景" },
  { id: "faq", label: "FAQ" }
];

function ToolDetailTabs({
  tool
}: {
  tool: ReturnType<typeof mapApiToolToDetailModel>;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const detailContent = tool.detailContent;

  return (
    <section className="space-y-6">
      <div className="surface-panel overflow-hidden p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full px-4 py-3 text-sm font-semibold transition sm:px-5",
                activeTab === tab.id
                  ? "bg-foreground text-white shadow-soft"
                  : "text-foreground/62 hover:bg-background hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <div key={activeTab} className="opacity-0 animate-fade-up">
          {activeTab === "overview" ? (
            <div className="space-y-4">
              {detailContent.overview.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-foreground/72">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {activeTab === "features" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {detailContent.features.map((feature) => {
                const Icon = getIcon(feature.icon);

                return (
                  <div key={feature.title} className="rounded-[1.5rem] border border-line/70 bg-background/85 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-soft">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground/68">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          ) : null}

          {activeTab === "scenarios" ? (
            <div className="space-y-4">
              {detailContent.scenarios.map((scenario, index) => (
                <div
                  key={scenario}
                  className="flex gap-4 rounded-[1.5rem] border border-line/70 bg-background/80 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-soft">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                      场景 0{index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-foreground/72">{scenario}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "faq" ? (
            <div className="space-y-4">
              {detailContent.faqs.map((faq) => (
                <div key={faq.question} className="rounded-[1.5rem] border border-line/70 bg-background/85 p-5">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 text-brand" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground/68">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}

export function ToolPageClient({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useSWR<ToolDetailResponse>(`/api/tools/${id}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false
  });

  const tool = data?.tool;
  const detail = useMemo(() => (tool ? mapApiToolToDetailModel(tool) : null), [tool]);
  const Icon = getIcon(detail?.categoryIcon ?? "Sparkles");

  const {
    tools: relatedTools,
    isLoading: relatedToolsLoading
  } = useTools({
    category: tool?.category_id ?? null,
    limit: 7,
    sort: "latest",
    enabled: Boolean(tool?.category_id)
  });
  const {
    posts: relatedPosts,
    isLoading: relatedPostsLoading
  } = usePosts({
    toolId: id,
    limit: 4,
    enabled: Boolean(tool?.id)
  });

  const relatedToolCards = useMemo(
    () => relatedTools.filter((item) => item.id !== id).slice(0, 6).map(mapApiToolToCard),
    [id, relatedTools]
  );
  const relatedPostCards = useMemo(() => relatedPosts.map(mapApiPostToCard), [relatedPosts]);

  if (isLoading) {
    return (
      <Container className="space-y-8 py-10 sm:py-14">
        <div className="h-12 w-40 animate-pulse rounded-full bg-background" />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="h-[320px] animate-pulse rounded-[2rem] bg-background" />
          <div className="h-[320px] animate-pulse rounded-[2rem] bg-background" />
        </div>
      </Container>
    );
  }

  if (error || !detail) {
    return (
      <Container className="py-10 sm:py-14">
        <Card className="space-y-4">
          <h1 className="font-display text-3xl font-semibold text-foreground">工具加载失败</h1>
          <p className="text-sm leading-7 text-foreground/68">
            {error?.message || "没有找到对应的工具，或者接口暂时不可用。"}
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => void mutate()}>
              重试
            </Button>
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-brand">
              返回首页
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="space-y-12 py-10 sm:space-y-14 sm:py-14">
      <Link
        href={detail.categorySlug ? `/categories/${detail.categorySlug}` : "/"}
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/65 transition hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        返回上一页
      </Link>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className={`surface-panel overflow-hidden bg-gradient-to-br ${detail.theme.surface} p-6 sm:p-8`}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand/15 via-white to-accent-coral/15 text-brand shadow-soft">
              {detail.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={detail.logoUrl} alt={`${detail.name} logo`} className="h-full w-full object-cover" />
              ) : (
                <Icon className="h-10 w-10" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="eyebrow">Tool Profile</p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">{detail.name}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-foreground/72">{detail.categoryName}</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-foreground/68">{detail.description}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge tone={detail.priceTone}>{detail.priceLabel}</Badge>
            {detail.apiAvailable ? <Badge tone="api">API</Badge> : null}
            <Badge tone="plugin">{detail.categoryName}</Badge>
            {detail.isSponsored ? <Badge tone="new">推荐</Badge> : null}
          </div>

          <ToolActionPanel toolId={detail.id} toolName={detail.name} website={detail.website} />
        </div>

        <Card className="xl:sticky xl:top-24">
          <p className="eyebrow">Tool Facts</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">关键信息</h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-[1.5rem] bg-background/85 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
                <Globe2 className="h-4 w-4 text-brand" />
                官网链接
              </div>
              <Link
                href={detail.website}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block break-all text-sm font-semibold text-brand transition hover:text-brand-strong"
              >
                {detail.website}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
                  <CalendarDays className="h-4 w-4 text-accent-coral" />
                  上线时间
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  {formatDate(detail.publishedAt ?? detail.updatedAt ?? new Date().toISOString())}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
                  <UserRound className="h-4 w-4 text-accent-mint" />
                  开发者
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">暂未提供</p>
              </div>

              <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
                  <Eye className="h-4 w-4 text-brand" />
                  浏览量
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">{detail.views.toLocaleString("zh-CN")}</p>
              </div>

              <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
                  <MousePointerClick className="h-4 w-4 text-accent-gold" />
                  点击量
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">{detail.clicks.toLocaleString("zh-CN")}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <ToolDetailTabs tool={detail} />

      <section className="space-y-6">
        <div>
          <p className="eyebrow">Related Tools</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">相关工具</h2>
        </div>

        {relatedToolsLoading ? (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[340px] min-w-[320px] animate-pulse rounded-[1.75rem] bg-background" />
            ))}
          </div>
        ) : relatedToolCards.length > 0 ? (
          <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-3">
            {relatedToolCards.map((relatedTool) => (
              <div key={relatedTool.id} className="min-w-[320px] max-w-[360px] snap-start">
                <ToolCard tool={relatedTool} />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm leading-7 text-foreground/68">当前没有更多同分类工具。</p>
          </Card>
        )}
      </section>

      {relatedPostsLoading ? (
        <section className="space-y-6">
          <div>
            <p className="eyebrow">Related Posts</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">相关文章</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[320px] animate-pulse rounded-[1.75rem] bg-background" />
            ))}
          </div>
        </section>
      ) : relatedPostCards.length > 0 ? (
        <section className="space-y-6">
          <div>
            <p className="eyebrow">Related Posts</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">相关文章</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {relatedPostCards.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <ToolCommentsPlaceholder />
    </Container>
  );
}

export default ToolPageClient;
