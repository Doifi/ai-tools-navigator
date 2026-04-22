import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminSupabaseConnectionNotice } from "@/components/admin/AdminSupabaseConnectionNotice";
import { AdminPostsManager, type AdminPostRecord } from "@/components/admin/AdminPostsManager";
import { Container } from "@/components/layout/Container";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hasAdminSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  if (!hasAdminSupabaseEnv()) {
    return (
      <Container className="py-10 sm:py-14">
        <AdminEnvNotice description="当前部署没有注入后台所需的 Supabase 管理变量，所以文章管理页暂时不可用。" />
      </Container>
    );
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, title, slug, author, status, views, published_at, created_at, excerpt, categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (
      <Container className="py-10 sm:py-14">
        <AdminPostsManager posts={(posts ?? []) as AdminPostRecord[]} />
      </Container>
    );
  } catch (error) {
    console.error("Admin posts page error:", error);
    return (
      <Container className="py-10 sm:py-14">
        <AdminSupabaseConnectionNotice description="当前部署已经进入后台，但文章管理页在连接 Supabase 时失败，所以暂时无法读取和维护实时文章数据。" />
      </Container>
    );
  }
}
