import { NextResponse } from "next/server";

import {
  getMockApiPostBySlug,
  getMockRelatedToolsForPost
} from "@/lib/mock/api-fallback";
import { createReadableSupabaseClient, hasReadableSupabaseEnv } from "@/lib/supabase/read";

interface PostDetailRouteProps {
  params: {
    slug: string;
  };
}

/**
 * GET /api/posts/[slug]
 * Returns a single published post with related tool summaries.
 * Falls back to mock data when Supabase is not configured.
 */
export async function GET(_request: Request, { params }: PostDetailRouteProps) {
  const fallbackPost = getMockApiPostBySlug(params.slug);

  if (!hasReadableSupabaseEnv()) {
    if (!fallbackPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        ...fallbackPost,
        related_tools: getMockRelatedToolsForPost(params.slug)
      }
    });
  }

  try {
    const supabase = createReadableSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*, categories(*)")
      .eq("slug", params.slug)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      throw error;
    }

    let relatedTools: Array<{
      id: string;
      name: string;
      slug: string;
      logo_url: string | null;
      description: string | null;
    }> = [];

    if (Array.isArray(data.related_tools) && data.related_tools.length > 0) {
      const { data: tools, error: toolsError } = await supabase
        .from("tools")
        .select("id, name, slug, logo_url, description")
        .in("id", data.related_tools)
        .eq("status", "published");

      if (toolsError) {
        throw toolsError;
      }

      relatedTools = tools ?? [];
    }

    return NextResponse.json({
      post: {
        ...data,
        related_tools: relatedTools
      }
    });
  } catch (error) {
    console.error("Post detail API error:", error);

    if (!fallbackPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        ...fallbackPost,
        related_tools: getMockRelatedToolsForPost(params.slug)
      }
    });
  }
}
