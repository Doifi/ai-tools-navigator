import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminCreatePostForm } from "@/components/admin/AdminCreatePostForm";
import { Container } from "@/components/layout/Container";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
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
