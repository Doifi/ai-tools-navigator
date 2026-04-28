import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
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
    console.error("Admin tools page error:", error);
    const fallbackTools = getOfficialApiTools() as AdminToolRecord[];
    const fallbackCategories = getOfficialApiCategories() as Pick<
      Tables<"categories">,
      "id" | "name" | "slug"
    >[];

    return (
      <section className="space-y-6">
        <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但工具管理页在连接 Supabase 时失败，所以实时工具数据暂时不可读写。下面已经切到站内官方目录快照，只读可查。" />
        <AdminToolsManager
          tools={fallbackTools}
          categories={fallbackCategories}
          mode="readonly"
          banner={{
            title: "已切换到官方目录快照",
            description: `当前展示 ${fallbackTools.length} 个站内维护的官方工具条目。你可以继续搜索、查看官网、核对分类和标签；实时保存会在 Supabase 恢复后自动回到可编辑模式。`
          }}
        />
      </section>
    );
  }
}
