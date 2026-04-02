import { z } from "zod";

export const adminToolPriceModels = ["free", "freemium", "paid"] as const;
export const adminToolSponsorPlans = ["starter", "featured", "homepage"] as const;
export const adminToolStatuses = ["draft", "published", "archived"] as const;

export const adminCreateToolSchema = z
  .object({
    name: z.string().trim().min(2, "工具名称至少 2 个字符").max(200, "工具名称过长"),
    slug: z
      .string()
      .trim()
      .min(2, "Slug 至少 2 个字符")
      .max(200, "Slug 过长")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug 只能包含小写字母、数字和中划线"),
    websiteUrl: z.string().trim().url("请输入合法的官网 URL"),
    logoUrl: z.union([z.literal(""), z.string().trim().url("请输入合法的 Logo URL")]).default(""),
    description: z.string().trim().min(10, "简介至少 10 个字符").max(300, "简介过长"),
    detailedIntro: z
      .union([z.literal(""), z.string().trim().min(20, "详细介绍至少 20 个字符").max(5000, "详细介绍过长")])
      .default(""),
    categoryId: z.string().uuid("请选择分类"),
    priceModel: z.enum(adminToolPriceModels),
    apiAvailable: z.boolean().default(false),
    isSponsored: z.boolean().default(false),
    sponsorPlan: z.union([z.literal(""), z.enum(adminToolSponsorPlans)]).default(""),
    status: z.enum(adminToolStatuses).default("published"),
    tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
    features: z.array(z.string().trim().min(1).max(120)).max(12).default([])
  })
  .superRefine((value, ctx) => {
    if (value.isSponsored && !value.sponsorPlan) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sponsorPlan"],
        message: "设置为赞助工具时必须选择赞助计划"
      });
    }
  });

export type AdminCreateToolInput = z.infer<typeof adminCreateToolSchema>;

export function slugifyToolName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeDelimitedInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
