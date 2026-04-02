"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import {
  adminToolPriceModels,
  adminToolStatuses,
  adminToolSponsorPlans,
  normalizeDelimitedInput,
  slugifyToolName
} from "@/lib/admin/tool-form-schema";

interface AdminCategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface AdminCreateToolFormProps {
  categories: AdminCategoryOption[];
}

interface FormState {
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl: string;
  description: string;
  detailedIntro: string;
  categoryId: string;
  priceModel: (typeof adminToolPriceModels)[number];
  apiAvailable: boolean;
  isSponsored: boolean;
  sponsorPlan: "" | (typeof adminToolSponsorPlans)[number];
  status: (typeof adminToolStatuses)[number];
  tagsInput: string;
  featuresInput: string;
}

const fieldClassName =
  "h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition focus:border-brand/45 focus:ring-4 focus:ring-brand/10";

const textareaClassName =
  "min-h-[120px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10";

/**
 * Admin form for directly creating tools in the live tools table.
 */
export function AdminCreateToolForm({ categories }: AdminCreateToolFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    websiteUrl: "",
    logoUrl: "",
    description: "",
    detailedIntro: "",
    categoryId: categories[0]?.id ?? "",
    priceModel: "freemium",
    apiAvailable: false,
    isSponsored: false,
    sponsorPlan: "",
    status: "published",
    tagsInput: "",
    featuresInput: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createdToolId, setCreatedToolId] = useState("");

  const previewTags = useMemo(() => normalizeDelimitedInput(form.tagsInput), [form.tagsInput]);
  const previewFeatures = useMemo(
    () => normalizeDelimitedInput(form.featuresInput),
    [form.featuresInput]
  );

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          websiteUrl: form.websiteUrl,
          logoUrl: form.logoUrl,
          description: form.description,
          detailedIntro: form.detailedIntro,
          categoryId: form.categoryId,
          priceModel: form.priceModel,
          apiAvailable: form.apiAvailable,
          isSponsored: form.isSponsored,
          sponsorPlan: form.sponsorPlan,
          status: form.status,
          tags: normalizeDelimitedInput(form.tagsInput),
          features: normalizeDelimitedInput(form.featuresInput)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "创建工具失败");
      }

      setCreatedToolId(result.tool.id);
      setSuccessMessage(result.message || "工具已创建");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "创建工具失败，请稍后重试"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6 sm:p-8">
        <div className="border-b border-line/70 pb-5">
          <p className="eyebrow">Tool Intake</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">
            直接新建工具
          </h1>
          <p className="mt-3 text-sm leading-7 text-foreground/65">
            这里创建的工具会直接写入正式 `tools` 表。状态设为 `published` 后，首页、工具页和分类页会自动读取到。
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">工具名称</span>
              <input
                className={fieldClassName}
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="例如：Perplexity"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Slug</span>
              <div className="flex gap-2">
                <input
                  className={fieldClassName}
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="perplexity"
                />
                <button
                  type="button"
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl border border-line/80 bg-white px-4 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:text-brand"
                  onClick={() => updateField("slug", slugifyToolName(form.name))}
                >
                  生成
                </button>
              </div>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">官网 URL</span>
              <input
                className={fieldClassName}
                value={form.websiteUrl}
                onChange={(event) => updateField("websiteUrl", event.target.value)}
                placeholder="https://..."
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Logo URL</span>
              <input
                className={fieldClassName}
                value={form.logoUrl}
                onChange={(event) => updateField("logoUrl", event.target.value)}
                placeholder="可选"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">简短描述</span>
            <textarea
              className={textareaClassName}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="用于首页卡片、工具列表和 SEO 摘要"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">详细介绍</span>
            <textarea
              className="min-h-[180px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
              value={form.detailedIntro}
              onChange={(event) => updateField("detailedIntro", event.target.value)}
              placeholder="用于工具详情页的介绍内容"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">分类</span>
              <select
                className={fieldClassName}
                value={form.categoryId}
                onChange={(event) => updateField("categoryId", event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">收费模式</span>
              <select
                className={fieldClassName}
                value={form.priceModel}
                onChange={(event) =>
                  updateField("priceModel", event.target.value as FormState["priceModel"])
                }
              >
                <option value="free">免费</option>
                <option value="freemium">免费试用</option>
                <option value="paid">付费</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">发布状态</span>
              <select
                className={fieldClassName}
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as FormState["status"])
                }
              >
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="archived">归档</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">标签</span>
              <textarea
                className={textareaClassName}
                value={form.tagsInput}
                onChange={(event) => updateField("tagsInput", event.target.value)}
                placeholder="用英文逗号或换行分隔，例如：搜索, 研究, 引用"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">功能点</span>
              <textarea
                className={textareaClassName}
                value={form.featuresInput}
                onChange={(event) => updateField("featuresInput", event.target.value)}
                placeholder="用英文逗号或换行分隔，例如：联网搜索, 答案引用"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-[1.25rem] border border-line/70 bg-background/80 p-4">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
                checked={form.apiAvailable}
                onChange={(event) => updateField("apiAvailable", event.target.checked)}
              />
              <div>
                <p className="text-sm font-semibold text-foreground">提供 API</p>
                <p className="text-xs text-foreground/58">会影响筛选项和详情页标签</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-[1.25rem] border border-line/70 bg-background/80 p-4">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
                checked={form.isSponsored}
                onChange={(event) => updateField("isSponsored", event.target.checked)}
              />
              <div>
                <p className="text-sm font-semibold text-foreground">设为赞助工具</p>
                <p className="text-xs text-foreground/58">首页精选工具会优先展示</p>
              </div>
            </label>
          </div>

          {form.isSponsored ? (
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">赞助计划</span>
              <select
                className={fieldClassName}
                value={form.sponsorPlan}
                onChange={(event) =>
                  updateField("sponsorPlan", event.target.value as FormState["sponsorPlan"])
                }
              >
                <option value="">请选择</option>
                <option value="starter">starter</option>
                <option value="featured">featured</option>
                <option value="homepage">homepage</option>
              </select>
            </label>
          ) : null}

          {error ? (
            <div className="rounded-[1.25rem] border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-[1.25rem] border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
              {successMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "保存中..." : "创建工具"}
            </button>

            <Link
              href="/admin/tools"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line/80 bg-white px-6 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:text-brand"
            >
              返回工具管理
            </Link>

            {createdToolId ? (
              <Link
                href={`/tools/${createdToolId}`}
                className="inline-flex h-12 items-center justify-center rounded-full border border-line/80 bg-white px-6 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:text-brand"
              >
                查看前台详情
              </Link>
            ) : null}
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">录入预览</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.25rem] border border-line/70 bg-background/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                工具名称
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {form.name || "未填写"}
              </p>
              <p className="mt-2 text-sm text-foreground/62">{form.description || "简介会显示在这里"}</p>
            </div>

            <div className="rounded-[1.25rem] border border-line/70 bg-background/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                标签
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {previewTags.length > 0 ? (
                  previewTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line/70 bg-white px-3 py-1 text-xs font-semibold text-foreground/68"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-foreground/52">暂无标签</span>
                )}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-line/70 bg-background/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                功能点
              </p>
              <ul className="mt-3 space-y-2 text-sm text-foreground/68">
                {previewFeatures.length > 0 ? (
                  previewFeatures.map((feature) => <li key={feature}>- {feature}</li>)
                ) : (
                  <li>暂无功能点</li>
                )}
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">上线规则</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground/68">
            <li>- `published` 会直接进入首页、工具页和分类页。</li>
            <li>- `draft` 只保存在后台，不会出现在前台。</li>
            <li>- `isSponsored` 为真时，首页精选工具会优先展示。</li>
            <li>- 标签和功能点请用逗号或换行分隔，系统会自动拆分。</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default AdminCreateToolForm;
