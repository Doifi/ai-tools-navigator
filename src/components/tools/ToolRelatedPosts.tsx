import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { MockPost } from "@/lib/mock";
import { formatDate } from "@/lib/utils";

interface ToolRelatedPostsProps {
  posts: MockPost[];
}

/**
 * 工具相关的文章区块，只有在存在相关文章时才展示。
 */
export function ToolRelatedPosts({ posts }: ToolRelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Related Posts</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">相关文章</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className="block h-full">
            <Card className="flex h-full flex-col overflow-hidden p-0">
              <div className={`h-32 bg-gradient-to-br ${post.coverImage} p-5`}>
                <div className="inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-foreground/70">
                  {post.category}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-foreground/48">{formatDate(post.date)}</p>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-foreground/68">{post.excerpt}</p>

                <div className="mt-auto flex items-center justify-between border-t border-line/70 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-foreground/52">{post.readTime}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                    查看文章
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ToolRelatedPosts;

