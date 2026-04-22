import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
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

  const supabase = createAdminSupabaseClient();

  const [{ data: categories }, { data: tools }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("sort_order", { ascending: true }),
    supabase.from("tools").select("id, name, slug").eq("status", "published").order("name", { ascending: true })
  ]);

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
}
