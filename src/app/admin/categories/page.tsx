import { AdminCategoriesManager, type AdminCategoryRecord } from "@/components/admin/AdminCategoriesManager";
import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hasAdminSupabaseEnv } from "@/lib/supabase/env";
import type { Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

function countByCategory(rows: Array<{ category_id: string | null }>) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    if (!row.category_id) {
      return counts;
    }

    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
    return counts;
  }, {});
}

export default async function AdminCategoriesPage() {
  if (!hasAdminSupabaseEnv()) {
    return (
      <AdminEnvNotice description="当前部署没有注入后台所需的 Supabase 管理变量，所以分类管理页暂时不可用。" />
    );
  }

  try {
    const supabase = createAdminSupabaseClient();
    const [
      { data: categories, error: categoriesError },
      { data: tools, error: toolsError },
      { data: posts, error: postsError }
    ] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, description, icon, sort_order, created_at")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("tools").select("category_id"),
      supabase.from("posts").select("category_id")
    ]);

    if (categoriesError) {
      throw new Error(categoriesError.message);
    }

    if (toolsError) {
      throw new Error(toolsError.message);
    }

    if (postsError) {
      throw new Error(postsError.message);
    }

    const toolCounts = countByCategory(tools ?? []);
    const postCounts = countByCategory(posts ?? []);
    const categoryRecords = ((categories ?? []) as Pick<
      Tables<"categories">,
      "id" | "name" | "slug" | "description" | "icon" | "sort_order" | "created_at"
    >[]).map((category) => ({
      ...category,
      toolCount: toolCounts[category.id] ?? 0,
      postCount: postCounts[category.id] ?? 0
    })) satisfies AdminCategoryRecord[];

    return <AdminCategoriesManager categories={categoryRecords} />;
  } catch (error) {
    console.error("Admin categories page error:", error);
    return (
      <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但分类管理页在连接 Supabase 时失败，所以暂时无法读取或修改分类数据。" />
    );
  }
}
