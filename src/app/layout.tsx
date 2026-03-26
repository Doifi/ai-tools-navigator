import type { Metadata } from "next";

import "@/app/globals.css";
import { BottomRefresh } from "@/components/layout/BottomRefresh";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "AI Tools Navigator",
  description: "一个使用 Next.js 14、TypeScript 和 Tailwind CSS 构建的 AI 工具导航站。",
  keywords: ["AI 工具导航", "AI 导航站", "Next.js", "Mock Data"]
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body className="page-shell">
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomRefresh />
      </body>
    </html>
  );
}
