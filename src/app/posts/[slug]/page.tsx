import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Eye, Link2, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PostMarkdownContent } from "@/components/posts/PostMarkdownContent";
import { hasAdminSupabaseEnv, hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface PostDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  if (!hasPublicSupabaseEnv() && !hasAdminSupabaseEnv()) {
    notFound();
  }

  const supabase = hasPublicSupabaseEnv()
    ? createServerSupabaseClient()
    : createAdminSupabaseClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, slug, content, excerpt, cover_image, related_tools, author, views, published_at, category_id, categories(name, slug)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  const relatedToolIds = Array.isArray(post.related_tools) ? post.related_tools : [];
  const categoryId = post.category_id;
  const publishedAt = post.published_at;

  const [{ data: relatedTools }, { data: relatedPosts }, { data: previousPost }, { data: nextPost }] =
    await Promise.all([
      relatedToolIds.length
        ? supabase
            .from("tools")
            .select("id, name, slug, description, website_url")
            .in("id", relatedToolIds)
            .eq("status", "published")
        : Promise.resolve({
            data: [] as Array<{
              id: string;
              name: string;
              slug: string;
              description: string;
              website_url: string;
            }>
          }),
      categoryId
        ? supabase
            .from("posts")
            .select("id, title, slug, excerpt, published_at")
            .neq("id", post.id)
            .eq("status", "published")
            .eq("category_id", categoryId)
            .order("published_at", { ascending: false })
            .limit(6)
        : Promise.resolve({
            data: [] as Array<{
              id: string;
              title: string;
              slug: string;
              excerpt: string | null;
              published_at: string | null;
            }>
          }),
      publishedAt
        ? supabase
            .from("posts")
            .select("title, slug")
            .eq("status", "published")
            .lt("published_at", publishedAt)
            .order("published_at", { ascending: false })
            .limit(1)
            .maybeSingle()
        : Promise.resolve({ data: null as { title: string; slug: string } | null }),
      publishedAt
        ? supabase
            .from("posts")
            .select("title, slug")
            .eq("status", "published")
            .gt("published_at", publishedAt)
            .order("published_at", { ascending: true })
            .limit(1)
            .maybeSingle()
        : Promise.resolve({ data: null as { title: string; slug: string } | null })
    ]);

  return (
    <Container className="space-y-10 py-10 sm:space-y-12 sm:py-14">
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/62 transition hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        返回文章列表
      </Link>

      <header className="surface-panel overflow-hidden p-0">
        {post.cover_image ? (
          <div className="h-64 w-full bg-cover bg-center sm:h-80" style={{ backgroundImage: `url(${post.cover_image})` }} />
        ) : (
          <div className="h-64 w-full bg-gradient-to-br from-brand/16 via-accent-coral/10 to-white sm:h-80" />
        )}

        <div className="space-y-5 p-6 sm:p-8">
          <div className="inline-flex rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55">
            {post.categories?.name ?? "文章"}
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-foreground/68">{post.excerpt}</p>
          <div className="flex flex-wrap gap-4 text-sm text-foreground/54">
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString("zh-CN") : ""}
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {post.views ?? 0}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <article className="surface-panel p-6 sm:p-8">
          <PostMarkdownContent content={post.content ?? ""} relatedTools={relatedTools ?? []} />
        </article>

        <aside className="space-y-5">
          {(relatedTools ?? []).length > 0 ? (
            <div className="surface-panel p-6">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-brand" />
                <h2 className="font-display text-2xl font-semibold text-foreground">关联工具</h2>
              </div>

              <div className="mt-5 space-y-3">
                {(relatedTools ?? []).map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="block rounded-2xl border border-line/70 bg-white px-4 py-4 transition hover:border-brand/40"
                  >
                    <p className="font-semibold text-foreground">{tool.name}</p>
                    <p className="mt-2 text-sm leading-6 text-foreground/62">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="surface-panel p-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">相关文章</h2>
            <div className="mt-5 space-y-3">
              {(relatedPosts ?? []).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/posts/${relatedPost.slug}`}
                  className="block rounded-2xl border border-line/70 bg-white px-4 py-4 transition hover:border-brand/40"
                >
                  <p className="font-semibold text-foreground">{relatedPost.title}</p>
                  <p className="mt-2 text-sm leading-6 text-foreground/62">{relatedPost.excerpt}</p>
                </Link>
              ))}
              {relatedPosts?.length ? null : (
                <p className="text-sm text-foreground/56">当前分类下还没有其他文章。</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <nav className="grid gap-4 sm:grid-cols-2">
        {previousPost ? (
          <Link
            href={`/posts/${previousPost.slug}`}
            className="surface-panel flex items-center gap-3 p-5 transition hover:-translate-y-1"
          >
            <ArrowLeft className="h-4 w-4 text-brand" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-foreground/42">上一篇</p>
              <p className="mt-2 font-semibold text-foreground">{previousPost.title}</p>
            </div>
          </Link>
        ) : (
          <div className="surface-panel p-5 text-sm text-foreground/42">没有更早的文章</div>
        )}

        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="surface-panel flex items-center justify-between gap-3 p-5 text-right transition hover:-translate-y-1"
          >
            <div className="ml-auto">
              <p className="text-xs uppercase tracking-[0.16em] text-foreground/42">下一篇</p>
              <p className="mt-2 font-semibold text-foreground">{nextPost.title}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-brand" />
          </Link>
        ) : (
          <div className="surface-panel p-5 text-sm text-foreground/42">没有更新的文章</div>
        )}
      </nav>
    </Container>
  );
}
