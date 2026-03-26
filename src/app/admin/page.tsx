import {
  AdminSubmissionDashboard,
  type AdminSubmissionRecord
} from "@/components/admin/AdminSubmissionDashboard";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Admin dashboard for reviewing tool submissions.
 */
export default async function AdminPage() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("tool_submissions")
    .select("*, categories(id, name, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const submissions = (data ?? []) as AdminSubmissionRecord[];
  const pendingSubmissions = submissions.filter((submission) => submission.status === "pending");
  const recentReviewedSubmissions = submissions
    .filter((submission) => submission.status !== "pending")
    .slice(0, 6);

  return (
    <AdminSubmissionDashboard
      pendingSubmissions={pendingSubmissions}
      recentReviewedSubmissions={recentReviewedSubmissions}
    />
  );
}
