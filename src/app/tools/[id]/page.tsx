import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import { ToolPageClient } from "@/components/tools/ToolPageClient";
import { getOfficialApiToolById } from "@/lib/official-tools-sync";
import { createPageMetadata } from "@/lib/seo";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";

interface ToolPageProps {
  params: {
    id: string;
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function getCanonicalToolSlug(identifier: string) {
  if (hasReadableSupabaseEnv()) {
    try {
      const supabase = createReadableSupabaseClient();
      let query = supabase
        .from("tools")
        .select("slug")
        .eq("status", "published");

      query = isUuid(identifier) ? query.eq("id", identifier) : query.eq("slug", identifier);

      const { data: tool } = await query.maybeSingle();

      if (tool?.slug) {
        return tool.slug;
      }
    } catch (error) {
      console.error("Tool canonical slug lookup failed:", error);
    }
  }

  return getOfficialApiToolById(identifier)?.slug ?? null;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const identifier = params.id.trim();

  if (hasReadableSupabaseEnv()) {
    try {
      const supabase = createReadableSupabaseClient();
      let query = supabase
        .from("tools")
        .select("name, slug, description, tags, logo_url, categories(name, slug)")
        .eq("status", "published");

      query = isUuid(identifier) ? query.eq("id", identifier) : query.eq("slug", identifier);

      const { data: tool } = await query.maybeSingle();

      if (tool) {
        const description =
          tool.description ??
          `${tool.name} 的官网入口、功能介绍、价格模式和适用场景，收录于 AI Tools Navigator。`;

        return createPageMetadata({
          title: `${tool.name} - AI 工具详情`,
          description,
          path: `/tools/${tool.slug}`,
          keywords: [tool.name, tool.categories?.name ?? "AI 工具", ...(tool.tags ?? [])],
          image: tool.logo_url
        });
      }
    } catch (error) {
      console.error("Tool metadata generation failed:", error);
    }
  }

  const fallbackTool = getOfficialApiToolById(identifier);

  if (fallbackTool) {
    return createPageMetadata({
      title: `${fallbackTool.name} - AI 工具详情`,
      description: fallbackTool.description ?? `${fallbackTool.name} 的官网入口和工具介绍。`,
      path: `/tools/${fallbackTool.slug}`,
      keywords: [fallbackTool.name, fallbackTool.categories?.name ?? "AI 工具", ...(fallbackTool.tags ?? [])]
    });
  }

  return createPageMetadata({
    title: "AI 工具详情",
    description: "查看 AI 工具的官网入口、功能介绍、适用场景和相关文章。",
    path: `/tools/${identifier}`,
    keywords: ["AI 工具详情", "AI 工具官网"]
  });
}

export default async function ToolPage({ params }: ToolPageProps) {
  const identifier = params.id.trim();
  const canonicalSlug = await getCanonicalToolSlug(identifier);

  if (canonicalSlug && canonicalSlug !== identifier) {
    permanentRedirect(`/tools/${canonicalSlug}`);
  }

  return <ToolPageClient id={identifier} />;
}
