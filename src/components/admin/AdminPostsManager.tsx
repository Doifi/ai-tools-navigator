"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Eye, FileEdit, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Tables } from "@/types/supabase";

type CategorySummary = Pick<Tables<"categories">, "name" | "slug">;

export type AdminPostRecord = Pick<
  Tables<"posts">,
  "id" | "title" | "slug" | "author" | "status" | "views" | "published_at" | "created_at" | "excerpt"
> & {
  categories: CategorySummary | null;
};

interface AdminPostsManagerProps {
  posts: AdminPostRecord[];
}

type PostStatusFilter = "all" | "published" | "draft" | "archived";

function statusLabel(status: AdminPostRecord["status"]) {
  switch (status) {
    case "published":
      return "已发布";
    case "draft":
      return "草稿";
    case "archived":
      return "已归档";
    default:
      return status;
  }
}

function statusTone(status: AdminPostRecord["status"]) {
  switch (status) {
    case "published":
      return "free" as const;
    case "draft":
      return "plugin" as const;
    case "archived":
      return "paid" as const;
    default:
      return "plugin" as const;
  }
}

const statusOptions: Array<{
  value: PostStatusFilter;
  label: string;
}> = [
  { value: "all", label: "全部状态" },
  { value: "published", label: "已发布" },
  { value: "draft", label: "草稿" },
  { value: "archived", label: "已归档" }
];

/**
 * Admin posts inventory with search, filter, and edit entry.
 */
export function AdminPostsManager({ posts }: AdminPostsManagerProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatusFilter>("all");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [post.title, post.slug, post.author ?? "", post.excerpt ?? "", post.categories?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [posts, query, statusFilter]);

  const publishedCount = useMemo(
    () => posts.filter((post) => post.status === "published").length,
    [posts]
  );
  const draftCount = useMemo(() => posts.filter((post) => post.status === "draft").length, [posts]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Editorial Desk</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            文章管理
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/66">
            这里可以搜索、筛选和编辑已有文章，用于持续维护教程、资讯和专题内容。
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92"
        >
          <Plus className="h-4 w-4" />
          新建文章
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="space-y-3">
          <p className="text-sm font-medium text-foreground/56">文章总数</p>
          <p className="font-display text-4xl font-semibold text-foreground">{posts.length}</p>
          <p className="text-sm text-foreground/58">所有已录入的文章内容。</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm font-medium text-foreground/56">已发布</p>
          <p className="font-display text-4xl font-semibold text-foreground">{publishedCount}</p>
          <p className="text-sm text-foreground/58">当前在前台文章页可见。</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm font-medium text-foreground/56">草稿</p>
          <p className="font-display text-4xl font-semibold text-foreground">{draftCount}</p>
          <p className="text-sm text-foreground/58">适合先整理教程再发布。</p>
        </Card>
      </div>

      <Card className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />
            <input
              className="h-12 w-full rounded-2xl border border-line/80 bg-white/90 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
              placeholder="搜索标题、Slug、作者或分类"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as PostStatusFilter)}
            className="h-12 rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-foreground/58">当前匹配 {filteredPosts.length} 篇文章</div>
      </Card>

      <div className="grid gap-5">
        {filteredPosts.map((post) => (
          <article key={post.id} className="surface-panel p-6 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(post.status)}>{statusLabel(post.status)}</Badge>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/44">
                    {post.categories?.name ?? "未分类"}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-foreground/66">{post.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-foreground/54">
                  <span>{post.author || "未填写作者"}</span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {post.published_at
                      ? formatDate(post.published_at)
                      : `创建于 ${formatDate(post.created_at ?? new Date().toISOString())}`}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {post.views ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                {post.status === "published" ? (
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-line/70 px-5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
                  >
                    查看前台
                  </Link>
                ) : null}
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-background/80"
                >
                  <FileEdit className="h-4 w-4" />
                  编辑文章
                </Link>
              </div>
            </div>
          </article>
        ))}

        {filteredPosts.length ? null : (
          <div className="surface-panel p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground">没有匹配的文章</h2>
            <p className="mt-3 text-sm text-foreground/62">可以换个关键词，或切换状态筛选后再试。</p>
            <Link
              href="/admin/posts/new"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/92"
            >
              去新建文章
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminPostsManager;
