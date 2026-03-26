import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PostCard } from "@/components/ui/PostCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { Post } from "@/lib/mock/data";

interface LatestPostsSectionProps {
  posts: Post[];
}

/**
 * 首页文章策展区块，用于强化站点的内容属性与 SEO 入口。
 */
export function LatestPostsSection({ posts }: LatestPostsSectionProps) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Editorial"
          title="不只收录工具，也给出选择工具的方法"
          description="文章区适合承接 SEO、工具对比、使用方法和场景指南，是导航站后续增长的重要部分。"
        />

        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand"
        >
          查看全部文章
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

export default LatestPostsSection;
