import { AdminToolsManager, type AdminToolRecord } from "@/components/admin/AdminToolsManager";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

/**
 * Admin tools inventory and editor.
 */
export default async function AdminToolsPage() {
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
}
