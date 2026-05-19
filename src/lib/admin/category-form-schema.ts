import { z } from "zod";

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2, "分类名称至少 2 个字符").max(80, "分类名称不能超过 80 个字符"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug 至少 2 个字符")
    .max(80, "Slug 不能超过 80 个字符")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和中划线"),
  description: z
    .union([z.literal(""), z.string().trim().max(300, "分类描述不能超过 300 个字符")])
    .default(""),
  icon: z.union([z.literal(""), z.string().trim().max(80, "图标名称不能超过 80 个字符")]).default(""),
  sortOrder: z.coerce.number().int("排序必须是整数").min(0, "排序不能小于 0").max(9999, "排序过大")
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;

export function slugifyCategoryName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
