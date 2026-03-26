import Link from "next/link";
import { Compass, Globe2, Newspaper, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";

const footerLinks = [
  {
    title: "快速入口",
    items: [
      { label: "热门工具", href: "/tools" },
      { label: "精选分类", href: "/categories" },
      { label: "最新文章", href: "/posts" }
    ]
  },
  {
    title: "站点页面",
    items: [
      { label: "提交工具", href: "/submit" },
      { label: "工具详情示例", href: "/tools/chatgpt" },
      { label: "分类总览", href: "/categories" }
    ]
  }
];

/**
 * Site footer with supporting navigation and product summary.
 */
export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-white/70">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="rounded-[1.75rem] border border-line/70 bg-gradient-to-br from-brand/10 via-white to-accent-gold/10 p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-foreground">
                  AI Tools Navigator
                </p>
                <p className="text-sm text-foreground/65">
                  用更清晰的方式，找到真正值得用的 AI 工具。
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4">
                <Compass className="mb-3 h-5 w-5 text-brand" />
                <p className="text-sm font-semibold text-foreground">精选导航</p>
                <p className="mt-1 text-sm text-foreground/65">按场景筛选，不再被信息淹没。</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4">
                <Newspaper className="mb-3 h-5 w-5 text-accent-coral" />
                <p className="text-sm font-semibold text-foreground">内容策展</p>
                <p className="mt-1 text-sm text-foreground/65">用文章帮助用户建立选择框架。</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4">
                <Globe2 className="mb-3 h-5 w-5 text-accent-gold" />
                <p className="text-sm font-semibold text-foreground">持续扩展</p>
                <p className="mt-1 text-sm text-foreground/65">后续可平滑接入 API 与数据库。</p>
              </div>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-lg font-semibold text-foreground">{group.title}</h3>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-foreground/68 transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line/70 pt-6 text-sm text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AI Tools Navigator. 当前版本支持 mock 展示与 Supabase 实数切换。</p>
          <p>Next.js 14 · TypeScript · Tailwind CSS</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
