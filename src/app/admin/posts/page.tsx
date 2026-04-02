import Link from "next/link";
import { CalendarDays, Eye, Plus, SquarePen } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = createAdminSupabaseClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, author, status, views, published_at, created_at, excerpt, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <Container className="space-y-8 py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Editorial Desk</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            文章管理
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/66">
            这里查看已录入文章，并通过新建入口直接发布教程、资讯和工具使用指南。
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

      <div className="grid gap-5">
        {(posts ?? []).map((post) => (
          <article key={post.id} className="surface-panel p-6 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/44">
                  <span>{post.categories?.name ?? "未分类"}</span>
                  <span>·</span>
                  <span>{post.status}</span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-foreground/66">{post.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-foreground/54">
                  <span>{post.author}</span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("zh-CN") : "未发布"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {post.views ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-line/70 px-5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:text-brand"
                >
                  查看前台
                </Link>
                <Link
                  href="/admin/posts/new"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-background/80"
                >
                  <SquarePen className="h-4 w-4" />
                  新建下一篇
                </Link>
              </div>
            </div>
          </article>
        ))}

        {posts?.length ? null : (
          <div className="surface-panel p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground">还没有文章</h2>
            <p className="mt-3 text-sm text-foreground/62">先创建第一篇文章，前台教程模块就能开始运营。</p>
            <Link
              href="/admin/posts/new"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/92"
            >
              去新建文章
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
