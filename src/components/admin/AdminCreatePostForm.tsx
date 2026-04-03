"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenText, Link2, Loader2, Newspaper, Save, Sparkles } from "lucide-react";

import { slugifyPostTitle } from "@/lib/admin/post-form-schema";

interface AdminCategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface AdminToolOption {
  id: string;
  name: string;
  slug: string;
}

export interface AdminPostFormValues {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  categoryId: string;
  status: "published" | "draft" | "archived";
  content: string;
  relatedToolIds: string[];
}

interface AdminCreatePostFormProps {
  categories: AdminCategoryOption[];
  tools: AdminToolOption[];
  mode?: "create" | "edit";
  postId?: string;
  initialValues?: Partial<AdminPostFormValues>;
}

interface SubmitPostResponse {
  success: boolean;
  post: {
    id: string;
    slug: string;
    status: string;
  };
}

const defaultFormState: AdminPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  author: "",
  categoryId: "",
  status: "published",
  content: "",
  relatedToolIds: []
};

function buildFormState(initialValues?: Partial<AdminPostFormValues>): AdminPostFormValues {
  return {
    ...defaultFormState,
    ...initialValues,
    relatedToolIds: initialValues?.relatedToolIds ?? defaultFormState.relatedToolIds
  };
}

export function AdminCreatePostForm({
  categories,
  tools,
  mode = "create",
  postId,
  initialValues
}: AdminCreatePostFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit" && Boolean(postId);
  const [form, setForm] = useState<AdminPostFormValues>(buildFormState(initialValues));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [savedPost, setSavedPost] = useState<SubmitPostResponse["post"] | null>(null);

  useEffect(() => {
    setForm(buildFormState(initialValues));
    setErrors({});
    setServerError("");
    setSavedPost(null);
  }, [initialValues]);

  const selectedTools = useMemo(
    () => tools.filter((tool) => form.relatedToolIds.includes(tool.id)),
    [form.relatedToolIds, tools]
  );

  const formTitle = isEditMode ? "编辑文章" : "新建文章";
  const formDescription = isEditMode
    ? "这里修改已有文章内容，保存后会同步更新前台文章页和后台列表。"
    : "这里录入的文章会直接写入真实数据库。发布后会出现在文章列表、首页文章区和详情页里。";
  const submitLabel = isEditMode ? "保存修改" : "创建文章";
  const submittingLabel = isEditMode ? "正在保存" : "正在提交";
  const successLabel = isEditMode ? "文章更新成功" : "文章创建成功";

  const handleChange = (field: keyof AdminPostFormValues, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setServerError("");
  };

  const toggleRelatedTool = (toolId: string) => {
    setForm((current) => {
      const exists = current.relatedToolIds.includes(toolId);
      return {
        ...current,
        relatedToolIds: exists
          ? current.relatedToolIds.filter((id) => id !== toolId)
          : [...current.relatedToolIds, toolId]
      };
    });
  };

  const resetForm = () => {
    setForm(buildFormState(isEditMode ? initialValues : undefined));
    setErrors({});
    setServerError("");
    setSavedPost(null);
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setServerError("");
    setSavedPost(null);
    setErrors({});

    try {
      const response = await fetch(isEditMode ? `/api/admin/posts/${postId}` : "/api/admin/posts", {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = await response.json();

      if (!response.ok) {
        if (payload?.details?.fieldErrors) {
          const nextErrors: Record<string, string> = {};

          Object.entries(payload.details.fieldErrors).forEach(([field, messages]) => {
            const typedMessages = messages as string[] | undefined;
            if (typedMessages?.[0]) {
              nextErrors[field] = typedMessages[0];
            }
          });

          setErrors(nextErrors);
        }

        setServerError(payload?.error || (isEditMode ? "文章更新失败" : "文章创建失败"));
        return;
      }

      setSavedPost(payload.post);

      if (!isEditMode) {
        setForm(buildFormState());
      }

      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : isEditMode ? "文章更新失败" : "文章创建失败"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={submitForm} className="surface-panel space-y-6 p-6 sm:p-8">
        <div className="space-y-2">
          <p className="eyebrow">Editorial Workflow</p>
          <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{formTitle}</h1>
          <p className="text-sm leading-7 text-foreground/66">{formDescription}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-foreground">文章标题</label>
            <input
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="例如：2026 年 AI 工具工作流实战指南"
              className="h-12 w-full rounded-2xl border border-line/70 bg-white px-4 text-sm outline-none transition focus:border-brand"
            />
            {errors.title ? <p className="text-sm text-red-500">{errors.title}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-foreground">Slug</label>
              <button
                type="button"
                onClick={() => handleChange("slug", slugifyPostTitle(form.title))}
                className="text-xs font-semibold text-brand transition hover:text-brand-strong"
              >
                根据标题生成
              </button>
            </div>
            <input
              value={form.slug}
              onChange={(event) => handleChange("slug", event.target.value)}
              placeholder="ai-tools-workflow-guide"
              className="h-12 w-full rounded-2xl border border-line/70 bg-white px-4 text-sm outline-none transition focus:border-brand"
            />
            {errors.slug ? <p className="text-sm text-red-500">{errors.slug}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-foreground">摘要</label>
            <textarea
              value={form.excerpt}
              onChange={(event) => handleChange("excerpt", event.target.value)}
              rows={4}
              placeholder="用 1 到 2 句话概括文章重点。"
              className="w-full rounded-2xl border border-line/70 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
            {errors.excerpt ? <p className="text-sm text-red-500">{errors.excerpt}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">作者</label>
            <input
              value={form.author}
              onChange={(event) => handleChange("author", event.target.value)}
              placeholder="例如：Doifi Editorial"
              className="h-12 w-full rounded-2xl border border-line/70 bg-white px-4 text-sm outline-none transition focus:border-brand"
            />
            {errors.author ? <p className="text-sm text-red-500">{errors.author}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">发布状态</label>
            <select
              value={form.status}
              onChange={(event) => handleChange("status", event.target.value)}
              className="h-12 w-full rounded-2xl border border-line/70 bg-white px-4 text-sm outline-none transition focus:border-brand"
            >
              <option value="published">发布</option>
              <option value="draft">草稿</option>
              <option value="archived">归档</option>
            </select>
            {errors.status ? <p className="text-sm text-red-500">{errors.status}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">文章分类</label>
            <select
              value={form.categoryId}
              onChange={(event) => handleChange("categoryId", event.target.value)}
              className="h-12 w-full rounded-2xl border border-line/70 bg-white px-4 text-sm outline-none transition focus:border-brand"
            >
              <option value="">请选择分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? <p className="text-sm text-red-500">{errors.categoryId}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">封面图 URL</label>
            <input
              value={form.coverImage}
              onChange={(event) => handleChange("coverImage", event.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="h-12 w-full rounded-2xl border border-line/70 bg-white px-4 text-sm outline-none transition focus:border-brand"
            />
            {errors.coverImage ? <p className="text-sm text-red-500">{errors.coverImage}</p> : null}
          </div>

          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-foreground">关联工具</label>
              <span className="text-xs text-foreground/50">可选，多选</span>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-2xl border border-line/70 bg-white p-3">
              <div className="grid gap-2 md:grid-cols-2">
                {tools.map((tool) => {
                  const checked = form.relatedToolIds.includes(tool.id);

                  return (
                    <label
                      key={tool.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3 text-sm transition ${
                        checked
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-line/70 bg-background/70 text-foreground/72 hover:border-brand/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRelatedTool(tool.id)}
                        className="mt-1 h-4 w-4 rounded border-line"
                      />
                      <span className="min-w-0">
                        <span className="block font-semibold">{tool.name}</span>
                        <span className="block text-xs text-foreground/48">{tool.slug}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-foreground">正文内容</label>
            <textarea
              value={form.content}
              onChange={(event) => handleChange("content", event.target.value)}
              rows={18}
              placeholder={`支持简单 Markdown 风格内容。

# 一级标题
## 二级标题
- 列表项
> 引用
\`\`\`ts
const demo = true;
\`\`\`

提及工具时可写成 [[ChatGPT]] 这样的形式，详情页会高亮。`}
              className="w-full rounded-3xl border border-line/70 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-brand"
            />
            {errors.content ? <p className="text-sm text-red-500">{errors.content}</p> : null}
          </div>
        </div>

        {serverError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        ) : null}

        {savedPost ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm font-semibold text-emerald-700">{successLabel}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <Link href={`/posts/${savedPost.slug}`} className="text-brand hover:text-brand-strong">
                查看文章
              </Link>
              <Link href="/admin/posts" className="text-brand hover:text-brand-strong">
                返回文章管理
              </Link>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditMode ? (
              <Save className="h-4 w-4" />
            ) : (
              <Newspaper className="h-4 w-4" />
            )}
            {isSubmitting ? submittingLabel : submitLabel}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line/70 px-6 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
          >
            {isEditMode ? "恢复已保存内容" : "清空表单"}
          </button>

          <Link
            href="/admin/posts"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line/70 px-6 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
          >
            返回文章管理
          </Link>
        </div>
      </form>

      <div className="space-y-6">
        <div className="surface-panel p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">发布建议</h2>
              <p className="text-sm text-foreground/58">保证前台展示稳定的最小流程</p>
            </div>
          </div>

          <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground/68">
            <li>标题尽量明确表达收益，不要只写工具名称。</li>
            <li>摘要控制在两句话内，方便文章列表和首页调用。</li>
            <li>正文建议使用一级、二级标题分段，便于详情页阅读。</li>
            <li>如果文章提到站内工具，建议在正文里用 [[工具名]] 标记。</li>
            <li>专题类内容建议统一命名规则，例如“OpenClaw（龙虾）安装教程”“OpenClaw（龙虾）使用教程”。</li>
          </ul>
        </div>

        <div className="surface-panel p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-coral/10 text-accent-coral">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">预览摘要</h2>
              <p className="text-sm text-foreground/58">这是文章卡片和详情页头部的基础信息</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-line/70 bg-white p-5">
            <div className="inline-flex rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground/62">
              {categories.find((category) => category.id === form.categoryId)?.name || "未选择分类"}
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
              {form.title || "你的文章标题会显示在这里"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-foreground/66">
              {form.excerpt || "文章摘要会出现在列表页、首页最新文章区，以及社交分享卡片描述里。"}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-foreground/48">
              <span>{form.author || "待填写作者"}</span>
              <span>·</span>
              <span>{form.status === "published" ? "发布后立即可见" : "当前不会出现在前台"}</span>
            </div>

            {selectedTools.length > 0 ? (
              <div className="mt-5 border-t border-line/70 pt-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/42">
                  <Link2 className="h-3.5 w-3.5" />
                  关联工具
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTools.map((tool) => (
                    <span
                      key={tool.id}
                      className="rounded-full border border-line/70 bg-background px-3 py-1 text-xs font-medium text-foreground/70"
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreatePostForm;
