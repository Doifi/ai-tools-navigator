"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

/**
 * Password form for the admin area.
 */
export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const redirectPath = nextPath?.startsWith("/admin") ? nextPath : "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "登录失败");
      }

      router.push(redirectPath);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-lg overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-coral/12 p-8 sm:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-white shadow-soft">
        <LockKeyhole className="h-6 w-6" />
      </div>

      <p className="eyebrow mt-6">Admin Access</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-foreground">后台登录</h1>
      <p className="mt-4 text-sm leading-7 text-foreground/66">
        当前后台采用环境变量密码保护。通过后可进入提交审核和工具管理页面。
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Input
          id="admin-password"
          type="password"
          label="管理员密码"
          placeholder="请输入 ADMIN_PASSWORD"
          value={password}
          error={error ?? undefined}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          登录后台
        </Button>
      </form>
    </Card>
  );
}

export default AdminLoginForm;
