import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
import { AdminToolsManager, type AdminToolRecord } from "@/components/admin/AdminToolsManager";
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
    return (
      <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但工具管理页在连接 Supabase 时失败，所以暂时无法读取和编辑实时工具数据。" />
    );
  }
}
