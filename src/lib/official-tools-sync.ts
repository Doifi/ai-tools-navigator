import type { SupabaseClient } from "@supabase/supabase-js";

import officialToolsCatalog from "@/data/official-tools-catalog.json";
import type { ApiCategory, ApiTool } from "@/lib/api-mappers";
import type { Database } from "@/types/supabase";

export type OfficialToolMarket = "china" | "global";

export interface OfficialToolSeed {
  market: OfficialToolMarket;
  name: string;
  slug: string;
  websiteUrl: string;
  categorySlug: string;
  description: string;
  detailedIntro: string;
  tags: string[];
  features: string[];
  priceModel: Database["public"]["Enums"]["price_model"];
  apiAvailable: boolean;
  isSponsored: boolean;
  sponsorPlan: Database["public"]["Enums"]["sponsor_plan"] | null;
  publishedAt: string;
  views: number;
  clicks: number;
}

export interface OfficialToolsSyncResult {
  total: number;
  inserted: number;
  updated: number;
  byMarket: Record<OfficialToolMarket, number>;
  byCategory: Record<string, number>;
}

const officialTools = officialToolsCatalog as OfficialToolSeed[];

const officialCategoryCatalog = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    slug: "ai-drawing",
    name: "AI绘画",
    description: "图像生成、海报设计、品牌视觉和创意出图工具。",
    icon: "Palette",
    sort_order: 1
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    slug: "ai-writing",
    name: "AI文案",
    description: "写作改写、营销文案、长文整理和内容创作工具。",
    icon: "PenSquare",
    sort_order: 2
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    slug: "ai-video",
    name: "AI视频",
    description: "视频生成、数字人、短视频和营销视频制作工具。",
    icon: "Film",
    sort_order: 3
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    slug: "ai-coding",
    name: "AI编程",
    description: "AI 编码、代码审查、开发问答和应用生成工具。",
    icon: "Code2",
    sort_order: 4
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    slug: "ai-design",
    name: "AI设计",
    description: "设计协作、演示文稿、素材生成和网站搭建工具。",
    icon: "Brush",
    sort_order: 5
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    slug: "ai-productivity",
    name: "AI办公",
    description: "办公提效、知识整理、搜索问答和协作工作台工具。",
    icon: "Workflow",
    sort_order: 6
  },
  {
    id: "10000000-0000-0000-0000-000000000007",
    slug: "ai-education",
    name: "AI教育",
    description: "学习辅导、研究阅读、学术和知识理解工具。",
    icon: "GraduationCap",
    sort_order: 7
  },
  {
    id: "10000000-0000-0000-0000-000000000008",
    slug: "ai-audio",
    name: "AI语音",
    description: "配音、音乐生成、播客编辑和语音创作工具。",
    icon: "Mic2",
    sort_order: 8
  }
] as const;

type OfficialToolsQuery = {
  page: number;
  limit: number;
  categoryId?: string | null;
  tag?: string | null;
  market?: string | null;
  query?: string | null;
  sort?: string | null;
  priceModel?: Database["public"]["Enums"]["price_model"] | null;
  apiAvailable?: string | null;
};

export async function getOfficialToolsCatalog() {
  return officialTools;
}

export function getOfficialApiCategories(): ApiCategory[] {
  const toolCountByCategory = officialTools.reduce<Record<string, number>>((accumulator, tool) => {
    accumulator[tool.categorySlug] = (accumulator[tool.categorySlug] ?? 0) + 1;
    return accumulator;
  }, {});

  return officialCategoryCatalog.map((category) => ({
    ...category,
    created_at: "2026-04-17T00:00:00.000Z",
    toolCount: toolCountByCategory[category.slug] ?? 0
  }));
}

export function getOfficialApiTools(): ApiTool[] {
  const categories = new Map(getOfficialApiCategories().map((category) => [category.slug, category]));

  return officialTools.map((tool) => {
    const category = categories.get(tool.categorySlug) ?? null;

    return {
      id: tool.slug,
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      detailed_intro: tool.detailedIntro,
      logo_url: null,
      website_url: tool.websiteUrl,
      category_id: category?.id ?? null,
      tags: tool.tags,
      price_model: tool.priceModel,
      api_available: tool.apiAvailable,
      features: tool.features,
      is_sponsored: tool.isSponsored,
      sponsor_plan: tool.isSponsored ? tool.sponsorPlan : null,
      sponsor_expiry: null,
      views: tool.views,
      clicks: tool.clicks,
      status: "published",
      created_at: tool.publishedAt,
      updated_at: tool.publishedAt,
      published_at: tool.publishedAt,
      categories: category
    };
  });
}

export function getOfficialApiToolById(identifier: string) {
  const normalizedIdentifier = identifier.trim();

  return (
    getOfficialApiTools().find(
      (tool) => tool.id === normalizedIdentifier || tool.slug === normalizedIdentifier
    ) ?? null
  );
}

export function queryOfficialApiTools({
  page,
  limit,
  categoryId,
  tag,
  market,
  query,
  sort,
  priceModel,
  apiAvailable
}: OfficialToolsQuery) {
  let tools = [...getOfficialApiTools()];

  if (categoryId) {
    tools = tools.filter((tool) => tool.category_id === categoryId);
  }

  if (priceModel) {
    tools = tools.filter((tool) => tool.price_model === priceModel);
  }

  if (apiAvailable === "true") {
    tools = tools.filter((tool) => tool.api_available === true);
  }

  if (apiAvailable === "false") {
    tools = tools.filter((tool) => tool.api_available === false);
  }

  if (tag) {
    tools = tools.filter((tool) => tool.tags?.includes(tag));
  }

  if (market === "china") {
    tools = tools.filter((tool) => tool.tags?.includes("国内"));
  }

  if (market === "global") {
    tools = tools.filter((tool) => tool.tags?.includes("海外"));
  }

  if (query) {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    tools = tools.filter((tool) =>
      [
        tool.name,
        tool.slug,
        tool.description,
        tool.detailed_intro,
        ...(tool.tags ?? []),
        ...(tool.features ?? [])
      ]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLocaleLowerCase().includes(normalizedQuery))
    );
  }

  switch (sort) {
    case "popular":
      tools.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      break;
    case "click":
      tools.sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
      break;
    case "latest":
    default:
      tools.sort(
        (a, b) =>
          new Date(b.published_at ?? b.created_at ?? 0).getTime() -
          new Date(a.published_at ?? a.created_at ?? 0).getTime()
      );
      break;
  }

  const total = tools.length;
  const from = (page - 1) * limit;
  const pagedTools = tools.slice(from, from + limit);

  return {
    tools: pagedTools,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

export async function syncOfficialToolsCatalog(
  supabase: SupabaseClient<Database>
): Promise<OfficialToolsSyncResult> {
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, slug");

  if (categoriesError) {
    throw categoriesError;
  }

  const categoryIdBySlug = new Map((categories ?? []).map((category) => [category.slug, category.id]));
  const slugs = officialTools.map((tool) => tool.slug);
  const { data: existingTools, error: existingToolsError } = await supabase
    .from("tools")
    .select("id, slug, published_at")
    .in("slug", slugs);

  if (existingToolsError) {
    throw existingToolsError;
  }

  const existingToolBySlug = new Map((existingTools ?? []).map((tool) => [tool.slug, tool]));
  let inserted = 0;
  let updated = 0;
  const byCategory: Record<string, number> = {};
  const byMarket: Record<OfficialToolMarket, number> = {
    china: 0,
    global: 0
  };

  for (const tool of officialTools) {
    const categoryId = categoryIdBySlug.get(tool.categorySlug);

    if (!categoryId) {
      throw new Error(`未找到分类 ${tool.categorySlug}，无法同步工具 ${tool.slug}`);
    }

    byCategory[tool.categorySlug] = (byCategory[tool.categorySlug] ?? 0) + 1;
    byMarket[tool.market] += 1;

    const existingTool = existingToolBySlug.get(tool.slug);
    const payload = {
      name: tool.name,
      slug: tool.slug,
      website_url: tool.websiteUrl,
      description: tool.description,
      detailed_intro: tool.detailedIntro,
      category_id: categoryId,
      tags: tool.tags,
      features: tool.features,
      price_model: tool.priceModel,
      api_available: tool.apiAvailable,
      is_sponsored: tool.isSponsored,
      sponsor_plan: tool.isSponsored ? tool.sponsorPlan : null,
      status: "published" as const,
      updated_at: new Date().toISOString(),
      published_at: existingTool?.published_at ?? tool.publishedAt
    };

    if (existingTool) {
      const { error: updateError } = await supabase
        .from("tools")
        .update(payload)
        .eq("id", existingTool.id);

      if (updateError) {
        throw updateError;
      }

      updated += 1;
      continue;
    }

    const { error: insertError } = await supabase.from("tools").insert({
      ...payload,
      logo_url: null,
      sponsor_expiry: null,
      views: tool.views,
      clicks: tool.clicks,
      created_at: tool.publishedAt
    });

    if (insertError) {
      throw insertError;
    }

    inserted += 1;
  }

  return {
    total: officialTools.length,
    inserted,
    updated,
    byMarket,
    byCategory
  };
}

export default syncOfficialToolsCatalog;
