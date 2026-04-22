import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
import { AdminCreatePostForm } from "@/components/admin/AdminCreatePostForm";
import { Container } from "@/components/layout/Container";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hasAdminSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  if (!hasAdminSupabaseEnv()) {
    return (
      <Container className="py-10 sm:py-14">
        <AdminEnvNotice description="当前部署没有注入后台所需的 Supabase 管理变量，所以新建文章页暂时不可用。" />
      </Container>
    );
  }

  try {
    const supabase = createAdminSupabaseClient();

    const [{ data: categories, error: categoriesError }, { data: tools, error: toolsError }] =
      await Promise.all([
        supabase.from("categories").select("id, name, slug").order("sort_order", { ascending: true }),
        supabase
          .from("tools")
          .select("id, name, slug")
          .eq("status", "published")
          .order("name", { ascending: true })
      ]);

    if (categoriesError) {
      throw new Error(categoriesError.message);
    }

    if (toolsError) {
      throw new Error(toolsError.message);
    }

    return (
      <Container className="space-y-6 py-10 sm:py-14">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/62 transition hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          返回文章管理
        </Link>

        <AdminCreatePostForm categories={categories ?? []} tools={tools ?? []} />
      </Container>
    );
  } catch (error) {
    console.error("Admin new post page error:", error);
    return (
      <Container className="py-10 sm:py-14">
        <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但新建文章页在连接 Supabase 时失败，所以暂时无法加载分类、工具或写入实时文章数据。" />
      </Container>
    );
  }
}
