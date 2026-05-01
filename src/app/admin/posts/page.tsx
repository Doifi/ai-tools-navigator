import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";
import { AdminPostsManager, type AdminPostRecord } from "@/components/admin/AdminPostsManager";
import { Container } from "@/components/layout/Container";
import { getMockApiPosts } from "@/lib/mock/api-fallback";
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
    console.warn("Admin posts page switched to read-only fallback:", error);
    const fallbackPosts = getMockApiPosts() as AdminPostRecord[];

    return (
      <Container className="py-10 sm:py-14">
        <AdminPostsManager
          posts={fallbackPosts}
          mode="readonly"
          banner={{
            title: "当前为只读快照模式",
            description: `实时数据库暂时不可写，已自动载入 ${fallbackPosts.length} 篇站内文章快照。搜索、筛选和前台文章检查都可以正常使用；连接恢复后会自动回到可编辑模式。`
          }}
        />
      </Container>
    );
  }
}
