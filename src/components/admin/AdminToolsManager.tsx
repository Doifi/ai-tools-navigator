"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  MousePointerClick,
  Save,
  Search,
  Settings2,
  Sparkles
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import type { Enums, Tables } from "@/types/supabase";

type CategorySummary = Pick<Tables<"categories">, "id" | "name" | "slug">;

export type AdminToolRecord = Tables<"tools"> & {
  categories: CategorySummary | null;
};

interface AdminToolsManagerProps {
  tools: AdminToolRecord[];
  categories: CategorySummary[];
}

type ToolFormState = {
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl: string;
  description: string;
  detailedIntro: string;
  categoryId: string;
  priceModel: Enums<"price_model"> | "";
  apiAvailable: boolean;
  status: Enums<"content_status">;
  isSponsored: boolean;
  sponsorPlan: Enums<"sponsor_plan"> | "";
  tagsText: string;
  featuresText: string;
};

const defaultFormState: ToolFormState = {
  name: "",
  slug: "",
  websiteUrl: "",
  logoUrl: "",
  description: "",
  detailedIntro: "",
  categoryId: "",
  priceModel: "",
  apiAvailable: false,
  status: "draft",
  isSponsored: false,
  sponsorPlan: "",
  tagsText: "",
  featuresText: ""
};

function toDelimitedText(values: string[] | null, separator = ", ") {
  return values?.join(separator) ?? "";
}

function mapToolToForm(tool: AdminToolRecord | null): ToolFormState {
  if (!tool) {
    return defaultFormState;
  }

  return {
    name: tool.name,
    slug: tool.slug,
    websiteUrl: tool.website_url,
    logoUrl: tool.logo_url ?? "",
    description: tool.description ?? "",
    detailedIntro: tool.detailed_intro ?? "",
    categoryId: tool.category_id ?? "",
    priceModel: tool.price_model ?? "",
    apiAvailable: tool.api_available ?? false,
    status: tool.status,
    isSponsored: tool.is_sponsored ?? false,
    sponsorPlan: tool.sponsor_plan ?? "",
    tagsText: toDelimitedText(tool.tags),
    featuresText: tool.features?.join("\n") ?? ""
  };
}

function splitCommaValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLineValues(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function priceLabel(value: Enums<"price_model"> | null) {
  switch (value) {
    case "free":
      return "免费";
    case "freemium":
      return "免费试用";
    case "paid":
      return "付费";
    default:
      return "未设置";
  }
}

function statusLabel(value: Enums<"content_status">) {
  switch (value) {
    case "draft":
      return "草稿";
    case "published":
      return "已发布";
    case "archived":
      return "已归档";
    default:
      return value;
  }
}

/**
 * Admin interface for editing tools and sponsor settings.
 */
export function AdminToolsManager({ tools, categories }: AdminToolsManagerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(tools[0]?.id ?? null);
  const [formState, setFormState] = useState<ToolFormState>(mapToolToForm(tools[0] ?? null));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return tools;
    }

    return tools.filter((tool) => {
      return [tool.name, tool.slug, tool.website_url, tool.categories?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query, tools]);

  const selectedTool = useMemo(
    () =>
      filteredTools.find((tool) => tool.id === selectedId) ??
      tools.find((tool) => tool.id === selectedId) ??
      null,
    [filteredTools, selectedId, tools]
  );

  useEffect(() => {
    if (!selectedTool) {
      setSelectedId(filteredTools[0]?.id ?? null);
      return;
    }

    setFormState(mapToolToForm(selectedTool));
    setError(null);
    setFeedback(null);
  }, [filteredTools, selectedTool]);

  const updateField = <Key extends keyof ToolFormState>(key: Key, value: ToolFormState[Key]) => {
    setFormState((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedTool) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/tools/${selectedTool.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formState.name,
          slug: formState.slug,
          websiteUrl: formState.websiteUrl,
          logoUrl: formState.logoUrl || "",
          description: formState.description,
          detailedIntro: formState.detailedIntro || "",
          categoryId: formState.categoryId || null,
          priceModel: formState.priceModel || null,
          apiAvailable: formState.apiAvailable,
          status: formState.status,
          isSponsored: formState.isSponsored,
          sponsorPlan: formState.isSponsored ? formState.sponsorPlan || null : null,
          tags: splitCommaValues(formState.tagsText),
          features: splitLineValues(formState.featuresText)
        })
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "保存失败");
      }

      setFeedback(payload?.message ?? "已保存");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-0">
        <div className="border-b border-line/70 p-6">
          <p className="eyebrow">Tool Inventory</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">工具列表</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/64">
            共 {tools.length} 个工具，可直接修改基础信息和赞助状态。
          </p>

          <div className="mt-5 relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />
            <input
              className="h-12 w-full rounded-2xl border border-line/80 bg-white/90 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
              placeholder="搜索工具名称、Slug 或分类"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="divide-y divide-line/70">
            {filteredTools.map((tool) => {
              const isActive = tool.id === selectedId;

              return (
                <button
                  key={tool.id}
                  type="button"
                  className={`w-full px-6 py-5 text-left transition ${
                    isActive ? "bg-brand/6" : "hover:bg-background/80"
                  }`}
                  onClick={() => setSelectedId(tool.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-foreground">{tool.name}</h3>
                        {tool.is_sponsored ? <Badge tone="new">赞助</Badge> : null}
                      </div>
                      <p className="mt-2 text-sm text-foreground/60">
                        {tool.categories?.name ?? "未分类"} · {statusLabel(tool.status)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-foreground/48">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {tool.views ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MousePointerClick className="h-3.5 w-3.5" />
                          {tool.clicks ?? 0}
                        </span>
                      </div>
                    </div>

                    <Badge tone={tool.price_model === "paid" ? "paid" : "free"}>
                      {priceLabel(tool.price_model)}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-foreground/60">
            没有匹配的工具。
          </div>
        )}
      </Card>

      {selectedTool ? (
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Tool Editor</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                {selectedTool.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-foreground/64">
                创建于 {formatDate(selectedTool.created_at ?? new Date().toISOString())} · 最后更新{" "}
                {formatDate(
                  selectedTool.updated_at ?? selectedTool.created_at ?? new Date().toISOString()
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone={selectedTool.is_sponsored ? "new" : "plugin"}>
                {selectedTool.is_sponsored ? "赞助中" : "普通展示"}
              </Badge>
              <Badge tone={selectedTool.api_available ? "api" : "plugin"}>
                {selectedTool.api_available ? "API" : "无 API"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="tool-name"
              label="工具名称"
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            <Input
              id="tool-slug"
              label="Slug"
              value={formState.slug}
              onChange={(event) => updateField("slug", event.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="tool-website"
              label="官网地址"
              value={formState.websiteUrl}
              onChange={(event) => updateField("websiteUrl", event.target.value)}
            />
            <Input
              id="tool-logo"
              label="Logo URL"
              value={formState.logoUrl}
              onChange={(event) => updateField("logoUrl", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tool-description" className="block text-sm font-medium text-foreground/80">
              简短描述
            </label>
            <textarea
              id="tool-description"
              className="min-h-[120px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
              value={formState.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tool-intro" className="block text-sm font-medium text-foreground/80">
              详细介绍
            </label>
            <textarea
              id="tool-intro"
              className="min-h-[160px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
              value={formState.detailedIntro}
              onChange={(event) => updateField("detailedIntro", event.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="tool-category" className="block text-sm font-medium text-foreground/80">
                分类
              </label>
              <select
                id="tool-category"
                className="h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
                value={formState.categoryId}
                onChange={(event) => updateField("categoryId", event.target.value)}
              >
                <option value="">未分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tool-price-model" className="block text-sm font-medium text-foreground/80">
                收费模式
              </label>
              <select
                id="tool-price-model"
                className="h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
                value={formState.priceModel}
                onChange={(event) =>
                  updateField("priceModel", event.target.value as ToolFormState["priceModel"])
                }
              >
                <option value="">未设置</option>
                <option value="free">免费</option>
                <option value="freemium">免费试用</option>
                <option value="paid">付费</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tool-status" className="block text-sm font-medium text-foreground/80">
                发布状态
              </label>
              <select
                id="tool-status"
                className="h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
                value={formState.status}
                onChange={(event) =>
                  updateField("status", event.target.value as ToolFormState["status"])
                }
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-line/70 bg-background/85 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">是否提供 API</p>
                  <p className="mt-2 text-sm leading-7 text-foreground/60">
                    前端会用这个状态展示 API 标签。
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formState.apiAvailable}
                  onClick={() => updateField("apiAvailable", !formState.apiAvailable)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    formState.apiAvailable ? "bg-brand" : "bg-line"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 rounded-full bg-white shadow-soft transition ${
                      formState.apiAvailable ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-line/70 bg-background/85 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">赞助展示</p>
                  <p className="mt-2 text-sm leading-7 text-foreground/60">
                    开启后可配置赞助计划，用于首页和列表推荐。
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formState.isSponsored}
                  onClick={() => updateField("isSponsored", !formState.isSponsored)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    formState.isSponsored ? "bg-accent-coral" : "bg-line"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 rounded-full bg-white shadow-soft transition ${
                      formState.isSponsored ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {formState.isSponsored ? (
                <div className="mt-4 space-y-2">
                  <label
                    htmlFor="tool-sponsor-plan"
                    className="block text-sm font-medium text-foreground/80"
                  >
                    赞助计划
                  </label>
                  <select
                    id="tool-sponsor-plan"
                    className="h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
                    value={formState.sponsorPlan}
                    onChange={(event) =>
                      updateField("sponsorPlan", event.target.value as ToolFormState["sponsorPlan"])
                    }
                  >
                    <option value="">请选择</option>
                    <option value="starter">Starter</option>
                    <option value="featured">Featured</option>
                    <option value="homepage">Homepage</option>
                  </select>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="tool-tags" className="block text-sm font-medium text-foreground/80">
                标签
              </label>
              <textarea
                id="tool-tags"
                className="min-h-[110px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
                placeholder="多个标签用英文逗号分隔"
                value={formState.tagsText}
                onChange={(event) => updateField("tagsText", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tool-features" className="block text-sm font-medium text-foreground/80">
                功能特点
              </label>
              <textarea
                id="tool-features"
                className="min-h-[110px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
                placeholder="每行一个功能点"
                value={formState.featuresText}
                onChange={(event) => updateField("featuresText", event.target.value)}
              />
            </div>
          </div>

          {feedback ? (
            <div className="rounded-[1.25rem] border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
              {feedback}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[1.25rem] border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              loading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
              onClick={() => void handleSave()}
            >
              保存修改
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              leftIcon={<Settings2 className="h-4 w-4" />}
              onClick={() => setFormState(mapToolToForm(selectedTool))}
            >
              恢复当前数据
            </Button>
            {formState.isSponsored ? (
              <Button
                type="button"
                size="lg"
                variant="outline"
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={() => updateField("isSponsored", false)}
              >
                取消赞助
              </Button>
            ) : null}
          </div>
        </Card>
      ) : (
        <Card className="flex min-h-[360px] items-center justify-center text-center">
          <div>
            <p className="eyebrow">Tool Editor</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">暂无工具数据</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-foreground/64">
              当前数据库里没有可编辑的工具，或者搜索条件没有匹配结果。
            </p>
          </div>
        </Card>
      )}
    </section>
  );
}

export default AdminToolsManager;
