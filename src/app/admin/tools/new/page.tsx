import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
import { AdminCreateToolForm } from "@/components/admin/AdminCreateToolForm";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hasAdminSupabaseEnv } from "@/lib/supabase/env";
import type { Tables } from "@/types/supabase";

export const dynamic = "force-dynamic";

/**
 * Direct admin entry page for creating live tools.
 */
export default async function AdminNewToolPage() {
  if (!hasAdminSupabaseEnv()) {
    return (
      <AdminEnvNotice description="当前部署没有注入后台所需的 Supabase 管理变量，所以新建工具页暂时不可用。" />
    );
  }

  try {
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
  } catch (error) {
    console.error("Admin new tool page error:", error);
    return (
      <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但新建工具页在连接 Supabase 时失败，所以暂时无法加载分类数据或创建实时工具记录。" />
    );
  }
}
