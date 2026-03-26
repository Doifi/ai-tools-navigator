import Link from "next/link";
import { ArrowRight, Mail, Newspaper } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getMockCategoryBySlug, mockPostCategories, popularMockTools } from "@/lib/mock";

interface PostsSidebarProps {
  className?: string;
}

/**
 * 文章模块侧边栏，复用热门分类、热门工具和订阅入口。
 */
export function PostsSidebar({ className }: PostsSidebarProps) {
  return (
    <aside className={className}>
      <div className="space-y-5 xl:sticky xl:top-24">
        <Card>
          <p className="eyebrow">Hot Categories</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">热门分类</h2>

          <div className="mt-5 space-y-3">
            {mockPostCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/posts?category=${category.slug}`}
                className="flex items-center justify-between rounded-[1.25rem] border border-line/70 bg-background/85 px-4 py-3 text-sm transition hover:border-brand/30 hover:text-brand"
              >
                <span>{category.name}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground/55">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <p className="eyebrow">Popular Tools</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">热门工具推荐</h2>

          <div className="mt-5 space-y-3">
            {popularMockTools.slice(0, 4).map((tool) => {
              const category = getMockCategoryBySlug(tool.category);

              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="block rounded-[1.25rem] border border-line/70 bg-background/85 p-4 transition hover:border-brand/30 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{tool.name}</p>
                      <p className="mt-1 text-xs text-foreground/55">{category?.name ?? "AI 工具"}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand" />
                  </div>
                  <p className="mt-3 text-xs text-foreground/55">
                    {tool.clickCount.toLocaleString("zh-CN")} 次点击
                  </p>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-coral/12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-soft">
            <Mail className="h-5 w-5" />
          </div>

          <p className="eyebrow mt-5">Subscribe</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">订阅更新</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/68">
            订阅文章更新、热门工具评测和工作流方法论。当前先展示 UI，后续可接入真实订阅接口。
          </p>

          <div className="mt-5 space-y-3">
            <Input id="sidebar-subscribe-email" type="email" placeholder="输入你的邮箱" />
            <Button type="button" className="w-full" leftIcon={<Newspaper className="h-4 w-4" />}>
              立即订阅
            </Button>
          </div>
        </Card>
      </div>
    </aside>
  );
}

export default PostsSidebar;
