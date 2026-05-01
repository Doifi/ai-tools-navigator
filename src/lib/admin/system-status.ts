import { getMockApiPosts } from "@/lib/mock/api-fallback";
import { getOfficialApiCategories, getOfficialApiTools } from "@/lib/official-tools-sync";

type StatusTone = "ok" | "warning" | "error";

export interface AdminSystemCheck {
  id: string;
  label: string;
  status: StatusTone;
  value: string;
  description: string;
}

export interface AdminSystemStatus {
  checkedAt: string;
  supabaseHost: string;
  checks: AdminSystemCheck[];
  fallback: {
    tools: number;
    categories: number;
    posts: number;
  };
}

const SUPABASE_CHECK_TIMEOUT_MS = 3500;

function getSupabaseHost(rawUrl?: string) {
  if (!rawUrl) {
    return "未配置";
  }

  try {
    return new URL(rawUrl).host;
  } catch {
    return "URL 格式无效";
  }
}

function envCheck(id: string, label: string, value: string | undefined, description: string) {
  return {
    id,
    label,
    status: value ? "ok" : "error",
    value: value ? "已配置" : "未配置",
    description
  } satisfies AdminSystemCheck;
}

async function checkSupabaseRest(): Promise<AdminSystemCheck> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      id: "supabase-rest",
      label: "Supabase REST",
      status: "error",
      value: "无法检测",
      description: "缺少 Supabase URL 或访问密钥，后台无法连接实时数据库。"
    };
  }

  let endpoint: string;

  try {
    endpoint = new URL("/rest/v1/tools?select=id&limit=1", supabaseUrl).toString();
  } catch {
    return {
      id: "supabase-rest",
      label: "Supabase REST",
      status: "error",
      value: "URL 无效",
      description: "NEXT_PUBLIC_SUPABASE_URL 不是有效 URL，需要换成 Supabase 项目 API 地址。"
    };
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      },
      signal: controller.signal
    });
    const elapsed = Date.now() - startedAt;

    if (response.ok) {
      return {
        id: "supabase-rest",
        label: "Supabase REST",
        status: "ok",
        value: `${elapsed}ms`,
        description: "Vercel 当前运行环境可以访问 Supabase REST 接口。"
      };
    }

    return {
      id: "supabase-rest",
      label: "Supabase REST",
      status: "error",
      value: `HTTP ${response.status}`,
      description: "Supabase REST 接口可访问，但返回了错误状态，请检查密钥、表权限或项目状态。"
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "连接失败";

    return {
      id: "supabase-rest",
      label: "Supabase REST",
      status: "error",
      value: message,
      description: "当前运行环境无法访问 Supabase。常见原因是项目 URL 失效、DNS 解析失败或项目已迁移。"
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getAdminSystemStatus(): Promise<AdminSystemStatus> {
  const fallbackTools = getOfficialApiTools();
  const fallbackCategories = getOfficialApiCategories();
  const fallbackPosts = getMockApiPosts();
  const supabaseRestCheck = await checkSupabaseRest();

  return {
    checkedAt: new Date().toISOString(),
    supabaseHost: getSupabaseHost(process.env.NEXT_PUBLIC_SUPABASE_URL),
    checks: [
      envCheck(
        "supabase-url",
        "Supabase URL",
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        "后台实时读写依赖这个项目地址。"
      ),
      envCheck(
        "supabase-service-role",
        "Service Role Key",
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        "后台写入、同步和审核操作需要服务端管理密钥。"
      ),
      envCheck(
        "admin-password",
        "后台密码",
        process.env.ADMIN_PASSWORD,
        "用于后台登录保护。"
      ),
      supabaseRestCheck,
      {
        id: "tools-fallback",
        label: "工具快照",
        status: fallbackTools.length > 0 ? "ok" : "warning",
        value: `${fallbackTools.length} 条`,
        description: "Supabase 不可用时，工具管理会使用这份官方目录快照。"
      },
      {
        id: "posts-fallback",
        label: "文章快照",
        status: fallbackPosts.length > 0 ? "ok" : "warning",
        value: `${fallbackPosts.length} 篇`,
        description: "Supabase 不可用时，文章管理会使用这份站内文章快照。"
      }
    ],
    fallback: {
      tools: fallbackTools.length,
      categories: fallbackCategories.length,
      posts: fallbackPosts.length
    }
  };
}
