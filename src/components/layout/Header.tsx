"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/tools", label: "热门工具" },
  { href: "/categories", label: "精选分类" },
  { href: "/lobster", label: "龙虾专区" },
  { href: "/posts", label: "文章教程" },
  { href: "/submit", label: "提交工具" }
];

/**
 * Responsive site header with desktop navigation and mobile menu.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/75 backdrop-blur-xl">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent-coral text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                AI Tools Navigator
              </p>
              <p className="text-xs text-foreground/60">发现值得收藏的 AI 工具</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/70 transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition hover:bg-foreground/90"
            >
              推荐新工具
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line/70 bg-white text-foreground transition hover:border-brand/30 hover:text-brand md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 md:hidden",
            open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="mt-4 space-y-2 rounded-3xl border border-line/70 bg-white/85 p-4 shadow-soft">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/75 transition hover:bg-background hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
