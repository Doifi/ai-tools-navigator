"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/Button";

/**
 * Clears the admin session and returns to the login page.
 */
export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/admin/login", {
        method: "DELETE"
      });
    } finally {
      router.push("/admin/login");
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      loading={isLoading}
      leftIcon={<LogOut className="h-4 w-4" />}
      onClick={handleLogout}
    >
      退出
    </Button>
  );
}

export default AdminLogoutButton;
