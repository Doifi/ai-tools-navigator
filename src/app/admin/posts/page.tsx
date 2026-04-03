import { AdminPostsManager, type AdminPostRecord } from "@/components/admin/AdminPostsManager";
import { Container } from "@/components/layout/Container";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
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
}
