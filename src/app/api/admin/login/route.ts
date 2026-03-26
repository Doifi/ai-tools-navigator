import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  verifyAdminPassword
} from "@/lib/admin-auth";

const loginSchema = z.object({
  password: z.string().min(1, "请输入管理员密码")
});

/**
 * POST /api/admin/login
 * Creates a password-based admin session cookie.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = loginSchema.parse(body);
    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: await createAdminSessionValue(),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "请求参数无效" },
        { status: 400 }
      );
    }

    console.error("Admin login error:", error);
    return NextResponse.json({ error: "登录失败，请稍后重试" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/login
 * Clears the admin session cookie.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
