import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

/**
 * Password-gated login page for the admin area.
 */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <AdminLoginForm />
    </div>
  );
}
