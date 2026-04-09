import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  adminCreatePostSchema,
  adminUpdatePostStatusSchema
} from "@/lib/admin/post-form-schema";
import { ensureAdminRequest } from "@/lib/admin-route";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function revalidatePostRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/lobster");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  revalidatePath(`/posts/${slug}`);
}

/**
 * PATCH /api/admin/posts/[id]
 * Updates an existing post from the admin panel.
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();

    const { data: existingPost, error: existingPostError } = await supabase
      .from("posts")
      .select("id, slug, published_at")
      .eq("id", params.id)
      .maybeSingle();

    if (existingPostError) {
      return NextResponse.json({ error: existingPostError.message }, { status: 500 });
    }

    if (!existingPost) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    const isStatusOnlyUpdate =
      typeof body === "object" &&
      body !== null &&
      Object.keys(body).length === 1 &&
      "status" in body;

    if (isStatusOnlyUpdate) {
      const payload = adminUpdatePostStatusSchema.parse(body);
      const nextPublishedAt =
        payload.status === "published"
          ? existingPost.published_at ?? new Date().toISOString()
          : existingPost.published_at;

      const { data: updatedPost, error: updateError } = await supabase
        .from("posts")
        .update({
          status: payload.status,
          published_at: nextPublishedAt
        })
        .eq("id", params.id)
        .select("id, slug, status")
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      revalidatePostRoutes(existingPost.slug);

      return NextResponse.json({
        success: true,
        post: updatedPost
      });
    }

    const payload = adminCreatePostSchema.parse(body);

    const { data: conflictingPost, error: conflictingPostError } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", payload.slug)
      .neq("id", params.id)
      .maybeSingle();

    if (conflictingPostError) {
      return NextResponse.json({ error: conflictingPostError.message }, { status: 500 });
    }

    if (conflictingPost) {
      return NextResponse.json({ error: "该文章 Slug 已存在，请更换后再提交" }, { status: 409 });
    }

    const nextPublishedAt =
      payload.status === "published"
        ? existingPost.published_at ?? new Date().toISOString()
        : existingPost.published_at;

    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        cover_image: payload.coverImage || null,
        content: payload.content,
        author: payload.author,
        category_id: payload.categoryId,
        related_tools: payload.relatedToolIds,
        status: payload.status,
        published_at: nextPublishedAt
      })
      .eq("id", params.id)
      .select("id, slug, status")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    revalidatePostRoutes(existingPost.slug);
    revalidatePostRoutes(updatedPost.slug);

    return NextResponse.json({
      success: true,
      post: updatedPost
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
        error: error instanceof Error ? error.message : "文章更新失败"
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/posts/[id]
 * Removes a post from the admin panel.
 */
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const unauthorizedResponse = await ensureAdminRequest();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const supabase = createAdminSupabaseClient();

    const { data: existingPost, error: existingPostError } = await supabase
      .from("posts")
      .select("id, slug")
      .eq("id", params.id)
      .maybeSingle();

    if (existingPostError) {
      return NextResponse.json({ error: existingPostError.message }, { status: 500 });
    }

    if (!existingPost) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    const { error: deleteError } = await supabase.from("posts").delete().eq("id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    revalidatePostRoutes(existingPost.slug);

    return NextResponse.json({
      success: true,
      message: "文章已删除"
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "文章删除失败"
      },
      { status: 500 }
    );
  }
}
