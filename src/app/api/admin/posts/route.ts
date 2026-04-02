import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { adminCreatePostSchema } from "@/lib/admin/post-form-schema";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = adminCreatePostSchema.parse(body);
    const supabase = createAdminSupabaseClient();

    const { data: existingPost, error: existingPostError } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();

    if (existingPostError) {
      return NextResponse.json({ error: existingPostError.message }, { status: 500 });
    }

    if (existingPost) {
      return NextResponse.json({ error: "该文章 Slug 已存在，请更换后再提交" }, { status: 409 });
    }

    const { data: createdPost, error: createError } = await supabase
      .from("posts")
      .insert({
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        cover_image: payload.coverImage || null,
        content: payload.content,
        author: payload.author,
        category_id: payload.categoryId,
        related_tools: payload.relatedToolIds,
        status: payload.status,
        views: 0,
        published_at: new Date().toISOString()
      })
      .select("id, slug, status")
      .single();

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath("/admin/posts");
    revalidatePath(`/posts/${createdPost.slug}`);

    return NextResponse.json({
      success: true,
      post: createdPost
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "文章数据校验失败",
          details: error.flatten()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "文章创建失败"
      },
      { status: 500 }
    );
  }
}
