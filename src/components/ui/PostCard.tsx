import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { PostCardData } from "@/lib/mock";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: PostCardData;
}

/**
 * 文章卡片组件，用于首页、文章列表和相关文章推荐。
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="block h-full">
      <Card className="flex h-full flex-col overflow-hidden p-0">
        <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${post.cover} p-6`}>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
          <div className="relative inline-flex rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-foreground/72">
            {post.category}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readTime}</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.viewCount.toLocaleString("zh-CN")}
            </span>
          </div>

          <div>
            <h3 className="font-display text-xl font-semibold leading-snug text-foreground">
              {post.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-foreground/68">{post.excerpt}</p>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-line/70 pt-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
              <p className="text-xs text-foreground/55">{post.author.role}</p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
              阅读文章
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default PostCard;
