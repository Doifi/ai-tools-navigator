import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminToolsManager, type AdminToolRecord } from "@/components/admin/AdminToolsManager";
import { getOfficialApiCategories, getOfficialApiTools } from "@/lib/official-tools-sync";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hasAdminSupabaseEnv } from "@/lib/supabase/env";
import type { Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

/**
 * Admin tools inventory and editor.
 */
export default async function AdminToolsPage() {
  if (!hasAdminSupabaseEnv()) {
    return (
      <AdminEnvNotice description="当前部署没有注入后台所需的 Supabase 管理变量，所以工具管理页暂时不可用。" />
    );
  }

  try {
    const supabase = createAdminSupabaseClient();

    const [{ data: tools, error: toolsError }, { data: categories, error: categoriesError }] =
      await Promise.all([
        supabase
          .from("tools")
          .select("*, categories(id, name, slug)")
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("id, name, slug").order("sort_order", { ascending: true })
      ]);

    if (toolsError) {
      throw new Error(toolsError.message);
    }

    if (categoriesError) {
      throw new Error(categoriesError.message);
    }

    return (
      <AdminToolsManager
        tools={(tools ?? []) as AdminToolRecord[]}
        categories={(categories ?? []) as Pick<Tables<"categories">, "id" | "name" | "slug">[]}
      />
    );
  } catch (error) {
    console.warn("Admin tools page switched to read-only fallback:", error);
    const fallbackTools = getOfficialApiTools() as AdminToolRecord[];
    const fallbackCategories = getOfficialApiCategories() as Pick<
      Tables<"categories">,
      "id" | "name" | "slug"
    >[];

    return (
      <AdminToolsManager
        tools={fallbackTools}
        categories={fallbackCategories}
        mode="readonly"
        banner={{
          title: "当前为只读快照模式",
          description: `实时数据库暂时不可写，已自动载入 ${fallbackTools.length} 个站内官方工具条目。搜索、官网跳转、分类和标签核对都可以正常使用；连接恢复后会自动回到可编辑模式。`
        }}
      />
    );
  }
}
