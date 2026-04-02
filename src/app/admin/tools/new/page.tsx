import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminCreateToolForm } from "@/components/admin/AdminCreateToolForm";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

/**
 * Direct admin entry page for creating live tools.
 */
export default async function AdminNewToolPage() {
  const supabase = createAdminSupabaseClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/tools"
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/65 transition hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        返回工具管理
      </Link>

      <AdminCreateToolForm
        categories={(categories ?? []) as Pick<Tables<"categories">, "id" | "name" | "slug">[]}
      />
    </div>
  );
}
