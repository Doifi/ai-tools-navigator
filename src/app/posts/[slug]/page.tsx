import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Eye, UserRound } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { PostContent } from "@/components/posts/PostContent";
import { PostsSidebar } from "@/components/posts/PostsSidebar";
import { RelatedTools } from "@/components/posts/RelatedTools";
import { PostCard } from "@/components/ui/PostCard";
import {
  getMockPostBySlug,
  getMockPostNeighbors,
  getMockRelatedPosts,
  mapMockPostToCard,
  mockPosts,
  mockTools
} from "@/lib/mock";
import { formatDate } from "@/lib/utils";

interface PostDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug
  }));
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const post = getMockPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedTools = mockTools.filter((tool) => post.relatedToolIds.includes(tool.id));
  const relatedPosts = getMockRelatedPosts(post, 4);
  const { previousPost, nextPost } = getMockPostNeighbors(post.slug);

  return (
    <Container className="space-y-10 py-10 sm:space-y-12 sm:py-14">
      <Link
        href="/posts"
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/65 transition hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        返回文章列表
      </Link>

      <section className={`surface-panel overflow-hidden bg-gradient-to-br ${post.coverImage} p-0`}>
        <div className="bg-white/82 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="inline-flex rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
            {post.category}
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-foreground/58">
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-brand" />
              {post.author} · {post.authorRole}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand" />
              {post.viewCount.toLocaleString("zh-CN")} 阅读
            </span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="h-[280px] bg-gradient-to-br from-transparent via-white/10 to-foreground/10 sm:h-[360px]" />
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <PostContent blocks={post.content} mentionedTools={relatedTools} />
          <RelatedTools tools={relatedTools} />

          {relatedPosts.length > 0 ? (
            <section className="space-y-6">
              <div>
                <p className="eyebrow">Related Posts</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">相关文章</h2>
              </div>

              <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-3">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.slug} className="min-w-[320px] max-w-[360px] snap-start">
                    <PostCard post={mapMockPostToCard(relatedPost)} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2">
            {previousPost ? (
              <Link
                href={`/posts/${previousPost.slug}`}
                className="surface-panel flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5"
              >
                <span className="text-sm font-semibold text-foreground/45">上一篇</span>
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  {previousPost.title}
                </h3>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  <ArrowLeft className="h-4 w-4" />
                  查看上一篇
                </span>
              </Link>
            ) : (
              <div className="surface-panel flex h-full flex-col gap-3 p-5 text-foreground/35">
                <span className="text-sm font-semibold">上一篇</span>
                <h3 className="font-display text-2xl font-semibold">没有更多了</h3>
              </div>
            )}

            {nextPost ? (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="surface-panel flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5"
              >
                <span className="text-sm font-semibold text-foreground/45">下一篇</span>
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  {nextPost.title}
                </h3>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  查看下一篇
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ) : (
              <div className="surface-panel flex h-full flex-col gap-3 p-5 text-foreground/35">
                <span className="text-sm font-semibold">下一篇</span>
                <h3 className="font-display text-2xl font-semibold">没有更多了</h3>
              </div>
            )}
          </section>
        </div>

        <PostsSidebar />
      </section>
    </Container>
  );
}
