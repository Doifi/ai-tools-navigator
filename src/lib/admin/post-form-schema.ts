import { z } from "zod";

export const adminPostStatuses = ["draft", "published", "archived"] as const;

export const adminCreatePostSchema = z.object({
  title: z.string().trim().min(4, "标题至少 4 个字符").max(200, "标题不能超过 200 个字符"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug 至少 2 个字符")
    .max(200, "Slug 不能超过 200 个字符")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和中划线"),
  excerpt: z
    .string()
    .trim()
    .min(20, "摘要至少 20 个字符")
    .max(300, "摘要不能超过 300 个字符"),
  coverImage: z
    .string()
    .trim()
    .url("封面图必须是合法 URL")
    .or(z.literal(""))
    .optional()
    .transform((value) => value || ""),
  author: z.string().trim().min(2, "作者名至少 2 个字符").max(100, "作者名不能超过 100 个字符"),
  categoryId: z.string().uuid("请选择有效分类"),
  status: z.enum(adminPostStatuses),
  content: z.string().trim().min(80, "正文至少 80 个字符"),
  relatedToolIds: z.array(z.string().uuid("关联工具格式不正确")).default([])
});

export type AdminCreatePostInput = z.infer<typeof adminCreatePostSchema>;

export function slugifyPostTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/[\u4e00-\u9fa5]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
