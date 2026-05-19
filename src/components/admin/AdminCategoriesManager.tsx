"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, FolderTree, Plus, Save, Sparkles, Trash2, Wrench } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { slugifyCategoryName } from "@/lib/admin/category-form-schema";
import type { Tables } from "@/types/supabase";

export type AdminCategoryRecord = Pick<
  Tables<"categories">,
  "id" | "name" | "slug" | "description" | "icon" | "sort_order" | "created_at"
> & {
  toolCount: number;
  postCount: number;
};

interface AdminCategoriesManagerProps {
  categories: AdminCategoryRecord[];
}

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: string;
};

const emptyFormState: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  sortOrder: "100"
};

const fieldClassName =
  "h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10";

const textareaClassName =
  "min-h-[110px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10";

function mapCategoryToForm(category: AdminCategoryRecord | null): CategoryFormState {
  if (!category) {
    return emptyFormState;
  }

  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    icon: category.icon ?? "",
    sortOrder: String(category.sort_order ?? 100)
  };
}

/**
 * Admin category editor for the shared tools/posts taxonomy.
 */
export function AdminCategoriesManager({ categories }: AdminCategoriesManagerProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(categories[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [createForm, setCreateForm] = useState<CategoryFormState>(emptyFormState);
  const [editForm, setEditForm] = useState<CategoryFormState>(
    mapCategoryToForm(categories[0] ?? null)
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      [category.name, category.slug, category.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [categories, query]);

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedId) ??
      filteredCategories[0] ??
      categories[0] ??
      null,
    [categories, filteredCategories, selectedId]
  );

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedId(null);
      setEditForm(emptyFormState);
      return;
    }

    setSelectedId(selectedCategory.id);
    setEditForm(mapCategoryToForm(selectedCategory));
    setError("");
    setFeedback("");
  }, [selectedCategory]);

  const updateCreateField = <Key extends keyof CategoryFormState>(
    key: Key,
    value: CategoryFormState[Key]
  ) => {
    setCreateForm((current) => ({ ...current, [key]: value }));
  };

  const updateEditField = <Key extends keyof CategoryFormState>(
    key: Key,
    value: CategoryFormState[Key]
  ) => {
    setEditForm((current) => ({ ...current, [key]: value }));
  };

  const submitCategory = async (
    url: string,
    method: "POST" | "PATCH",
    form: CategoryFormState
  ) => {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        icon: form.icon,
        sortOrder: Number(form.sortOrder)
      })
    });

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;

    if (!response.ok) {
      throw new Error(payload?.error ?? "操作失败");
    }

    return payload?.message ?? "操作成功";
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    setError("");
    setFeedback("");

    try {
      const message = await submitCategory("/api/admin/categories", "POST", createForm);
      setFeedback(message);
      setCreateForm(emptyFormState);
      router.refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "创建分类失败");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCategory) {
      return;
    }

    setIsSaving(true);
    setError("");
    setFeedback("");

    try {
      const message = await submitCategory(
        `/api/admin/categories/${selectedCategory.id}`,
        "PATCH",
        editForm
      );
      setFeedback(message);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "更新分类失败");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) {
      return;
    }

    const confirmed = window.confirm(
      `确认删除分类「${selectedCategory.name}」？分类下仍有工具或文章时会被系统拦截。`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "DELETE"
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "删除分类失败");
      }

      setFeedback(payload?.message ?? "分类已删除");
      setSelectedId(null);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "删除分类失败");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="surface-panel p-6 sm:p-8">
        <p className="eyebrow">Taxonomy</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
          分类管理
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/66">
          分类同时服务工具、文章和提交审核。建议先把分类结构整理好，再批量导入工具。
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card className="p-0">
            <div className="border-b border-line/70 p-6">
              <p className="eyebrow">Category List</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">
                已有分类
              </h2>
              <input
                className={`${fieldClassName} mt-5`}
                placeholder="搜索分类名称、Slug 或描述"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {filteredCategories.length > 0 ? (
              <div className="divide-y divide-line/70">
                {filteredCategories.map((category) => {
                  const isActive = category.id === selectedCategory?.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      className={`w-full px-6 py-5 text-left transition ${
                        isActive ? "bg-brand/6" : "hover:bg-background/80"
                      }`}
                      onClick={() => setSelectedId(category.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{category.name}</p>
                          <p className="mt-1 text-sm text-foreground/58">{category.slug}</p>
                        </div>
                        <span className="rounded-full border border-line/70 bg-white px-3 py-1 text-xs font-semibold text-foreground/56">
                          #{category.sort_order ?? 100}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-foreground/52">
                        <span className="inline-flex items-center gap-1">
                          <Wrench className="h-3.5 w-3.5" />
                          {category.toolCount} 工具
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {category.postCount} 文章
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-sm text-foreground/58">
                没有匹配的分类。
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">运营建议</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/66">
              <p>国内外 AI 工具补齐前，先确定分类命名，避免后续反复迁移。</p>
              <p>排序值越小越靠前，首页和分类页会优先展示靠前分类。</p>
              <p>删除分类前需要把该分类下的工具和文章转移到其他分类。</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-white">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow">New Category</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  新增分类
                </h2>
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleCreate}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">分类名称</span>
                  <input
                    className={fieldClassName}
                    value={createForm.name}
                    onChange={(event) => updateCreateField("name", event.target.value)}
                    placeholder="例如：AI搜索"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Slug</span>
                  <div className="flex gap-2">
                    <input
                      className={fieldClassName}
                      value={createForm.slug}
                      onChange={(event) => updateCreateField("slug", event.target.value)}
                      placeholder="ai-search"
                    />
                    <button
                      type="button"
                      className="h-12 shrink-0 rounded-2xl border border-line/80 bg-white px-4 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:text-brand"
                      onClick={() => updateCreateField("slug", slugifyCategoryName(createForm.name))}
                    >
                      生成
                    </button>
                  </div>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">图标名称</span>
                  <input
                    className={fieldClassName}
                    value={createForm.icon}
                    onChange={(event) => updateCreateField("icon", event.target.value)}
                    placeholder="可选，例如：Sparkles"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">排序</span>
                  <input
                    className={fieldClassName}
                    type="number"
                    min={0}
                    value={createForm.sortOrder}
                    onChange={(event) => updateCreateField("sortOrder", event.target.value)}
                  />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-foreground">分类描述</span>
                <textarea
                  className={textareaClassName}
                  value={createForm.description}
                  onChange={(event) => updateCreateField("description", event.target.value)}
                  placeholder="用于分类页和后台说明"
                />
              </label>

              <Button type="submit" loading={isCreating} leftIcon={<Plus className="h-4 w-4" />}>
                创建分类
              </Button>
            </form>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow">Edit Category</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  编辑分类
                </h2>
              </div>
            </div>

            {selectedCategory ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-foreground">分类名称</span>
                    <input
                      className={fieldClassName}
                      value={editForm.name}
                      onChange={(event) => updateEditField("name", event.target.value)}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-foreground">Slug</span>
                    <div className="flex gap-2">
                      <input
                        className={fieldClassName}
                        value={editForm.slug}
                        onChange={(event) => updateEditField("slug", event.target.value)}
                      />
                      <button
                        type="button"
                        className="h-12 shrink-0 rounded-2xl border border-line/80 bg-white px-4 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:text-brand"
                        onClick={() => updateEditField("slug", slugifyCategoryName(editForm.name))}
                      >
                        生成
                      </button>
                    </div>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-foreground">图标名称</span>
                    <input
                      className={fieldClassName}
                      value={editForm.icon}
                      onChange={(event) => updateEditField("icon", event.target.value)}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-foreground">排序</span>
                    <input
                      className={fieldClassName}
                      type="number"
                      min={0}
                      value={editForm.sortOrder}
                      onChange={(event) => updateEditField("sortOrder", event.target.value)}
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-foreground">分类描述</span>
                  <textarea
                    className={textareaClassName}
                    value={editForm.description}
                    onChange={(event) => updateEditField("description", event.target.value)}
                  />
                </label>

                <div className="rounded-[1.25rem] border border-line/70 bg-background/80 p-4 text-sm leading-7 text-foreground/62">
                  当前分类包含 {selectedCategory.toolCount} 个工具、{selectedCategory.postCount} 篇文章。
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

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    loading={isSaving}
                    leftIcon={<Save className="h-4 w-4" />}
                    onClick={() => void handleSave()}
                  >
                    保存分类
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                    onClick={() => setEditForm(mapCategoryToForm(selectedCategory))}
                  >
                    恢复当前数据
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    loading={isDeleting}
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => void handleDelete()}
                  >
                    删除分类
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[1.25rem] border border-line/70 bg-background/80 p-6 text-sm text-foreground/58">
                请选择一个分类后再编辑。
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

export default AdminCategoriesManager;
