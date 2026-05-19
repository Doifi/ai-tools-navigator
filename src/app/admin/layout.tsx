import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Activity, FolderTree, LayoutDashboard, Newspaper, Wrench } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "后台管理",
  robots: {
    index: false,
    follow: false
  }
};

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    href: "/admin",
    label: "审核提交",
    icon: LayoutDashboard
  },
  {
    href: "/admin/posts",
    label: "文章管理",
    icon: Newspaper
  },
  {
    href: "/admin/categories",
    label: "分类管理",
    icon: FolderTree
  },
  {
    href: "/admin/tools",
    label: "工具管理",
    icon: Wrench
  },
  {
    href: "/admin/status",
    label: "系统状态",
    icon: Activity
  }
];

/**
 * Shared shell for the admin area.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const sessionValue = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await verifyAdminSession(sessionValue);

  return (
    <section className="pb-16 pt-10 sm:pt-12">
      <Container className="space-y-6">
        <div className="surface-panel overflow-hidden bg-gradient-to-br from-foreground to-brand p-6 text-white shadow-glow sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
                Admin Panel
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold">AI Tools Navigator 后台</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78">
                处理工具提交、同步工具信息、维护赞助展示状态。
              </p>
            </div>

            {isAuthenticated ? <AdminLogoutButton /> : null}
          </div>
        </div>

        {isAuthenticated ? (
          <nav className="surface-panel flex flex-wrap gap-3 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground/70 transition hover:bg-brand/10 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        {children}
      </Container>
    </section>
  );
}
