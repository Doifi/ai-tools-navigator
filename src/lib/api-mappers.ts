import type { MockToolDetailContent, PostCardData } from "@/lib/mock";
import type { Category, Tool } from "@/lib/mock/data";
import type { IconName } from "@/lib/mock/icon-map";
import { formatDate } from "@/lib/utils";
import type { Tables } from "@/types/supabase";

export type ApiCategory = Tables<"categories"> & {
  toolCount?: number;
};

export type ApiTool = Tables<"tools"> & {
  categories: Tables<"categories"> | null;
};

export type ApiPost = Tables<"posts"> & {
  categories?: Tables<"categories"> | null;
};

const categoryMetaMap: Record<
  string,
  {
    accent: string;
    focus: string;
    surface: string;
    cover: string;
  }
> = {
  "ai-drawing": {
    accent: "from-accent-gold/24 via-brand-soft/16 to-transparent",
    focus: "图像生成与视觉创意",
    surface: "from-accent-gold/12 via-white to-brand-soft/10",
    cover: "from-accent-gold/30 via-brand-soft/18 to-transparent"
  },
  "ai-writing": {
    accent: "from-accent-coral/18 via-brand/12 to-transparent",
    focus: "写作与内容产出",
    surface: "from-accent-coral/10 via-white to-brand/10",
    cover: "from-accent-coral/28 via-brand/18 to-transparent"
  },
  "ai-video": {
    accent: "from-accent-coral/16 via-accent-gold/14 to-transparent",
    focus: "视频生成与剪辑增强",
    surface: "from-accent-coral/10 via-white to-accent-gold/10",
    cover: "from-accent-coral/24 via-accent-gold/16 to-transparent"
  },
  "ai-coding": {
    accent: "from-accent-mint/20 via-brand/12 to-transparent",
    focus: "代码生成与开发协作",
    surface: "from-accent-mint/10 via-white to-brand/10",
    cover: "from-accent-mint/26 via-brand/16 to-transparent"
  },
  "ai-design": {
    accent: "from-brand-soft/20 via-accent-gold/14 to-transparent",
    focus: "设计辅助与创意提案",
    surface: "from-brand-soft/10 via-white to-accent-gold/10",
    cover: "from-brand-soft/26 via-accent-gold/16 to-transparent"
  },
  "ai-productivity": {
    accent: "from-brand/18 via-white to-transparent",
    focus: "办公提效与知识整理",
    surface: "from-brand/10 via-white to-white",
    cover: "from-brand/24 via-white to-accent-mint/12"
  },
  "ai-education": {
    accent: "from-brand-soft/22 via-brand/12 to-transparent",
    focus: "学习辅导与内容理解",
    surface: "from-brand-soft/12 via-white to-brand/8",
    cover: "from-brand-soft/24 via-brand/14 to-transparent"
  },
  "ai-audio": {
    accent: "from-brand-soft/24 via-accent-coral/14 to-transparent",
    focus: "语音合成与音频生成",
    surface: "from-brand-soft/12 via-white to-accent-coral/10",
    cover: "from-accent-coral/24 via-brand-soft/18 to-transparent"
  }
};

export function getCategoryPresentation(slug?: string | null) {
  return categoryMetaMap[slug ?? ""] ?? {
    accent: "from-brand/18 via-accent-coral/14 to-transparent",
    focus: "发现适合当前场景的 AI 工具",
    surface: "from-brand/10 via-white to-accent-coral/10",
    cover: "from-brand/22 via-accent-coral/14 to-transparent"
  };
}

function resolveIconName(icon?: string | null): IconName {
  return (icon || "Sparkles") as IconName;
}

function toPriceLabel(priceModel?: ApiTool["price_model"] | null) {
  switch (priceModel) {
    case "free":
      return "Free" as const;
    case "freemium":
      return "Freemium" as const;
    case "paid":
      return "Paid" as const;
    default:
      return "Freemium" as const;
  }
}

function toPriceBadgeLabel(priceModel?: ApiTool["price_model"] | null) {
  switch (priceModel) {
    case "free":
      return "免费";
    case "freemium":
      return "免费试用";
    case "paid":
      return "付费";
    default:
      return "免费试用";
  }
}

function estimateReadTime(post: ApiPost) {
  const contentLength = `${post.content ?? ""} ${post.excerpt ?? ""}`.trim().length;
  const minutes = Math.max(3, Math.ceil(contentLength / 220));
  return `${minutes} 分钟`;
}

export function mapApiCategoryToCard(category: ApiCategory): Category {
  const meta = getCategoryPresentation(category.slug);

  return {
    slug: category.slug,
    name: category.name,
    description: category.description ?? "暂无分类说明",
    icon: resolveIconName(category.icon),
    accent: meta.accent,
    focus: meta.focus,
    toolCount: category.toolCount ?? 0
  };
}

export function mapApiToolToCard(tool: ApiTool): Tool {
  return {
    id: tool.id,
    name: tool.name,
    tagline: tool.categories?.name ? `${tool.categories.name} 工具` : "AI 工具",
    description: tool.description ?? "暂无工具介绍",
    icon: resolveIconName(tool.categories?.icon),
    logoUrl: tool.logo_url,
    website: tool.website_url,
    categorySlug: tool.categories?.slug ?? "",
    pricing: toPriceLabel(tool.price_model),
    badges: [
      {
        label: toPriceBadgeLabel(tool.price_model),
        tone: tool.price_model === "paid" ? "paid" : "free"
      },
      ...(tool.api_available ? [{ label: "API", tone: "api" as const }] : []),
      ...((tool.tags ?? []).slice(0, 2).map((tag) => ({
        label: tag,
        tone: "plugin" as const
      }))),
      ...(tool.is_sponsored ? [{ label: "推荐", tone: "new" as const }] : [])
    ],
    featured: Boolean(tool.is_sponsored),
    updatedAt: tool.published_at ?? tool.updated_at ?? tool.created_at ?? new Date().toISOString(),
    stats: [
      {
        label: "浏览",
        value: (tool.views ?? 0).toLocaleString("zh-CN")
      },
      {
        label: "点击",
        value: (tool.clicks ?? 0).toLocaleString("zh-CN")
      },
      {
        label: "更新",
        value: formatDate(tool.published_at ?? tool.updated_at ?? tool.created_at ?? new Date().toISOString())
      }
    ],
    useCases: tool.tags ?? [],
    highlights: tool.features ?? []
  };
}

export function mapApiPostToCard(post: ApiPost): PostCardData {
  const meta = getCategoryPresentation(post.categories?.slug);

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "暂无摘要",
    category: post.categories?.name ?? "文章",
    publishedAt: post.published_at ?? post.created_at ?? new Date().toISOString(),
    readTime: estimateReadTime(post),
    cover: meta.cover,
    viewCount: post.views ?? 0,
    author: {
      name: post.author ?? "AI Tools Navigator",
      role: "站点编辑"
    }
  };
}

export function buildToolDetailContent(tool: ApiTool): MockToolDetailContent {
  const categoryName = tool.categories?.name ?? "AI 工具";
  const tags = tool.tags ?? [];
  const features = tool.features ?? [];
  const primary = tags[0] ?? "效率提升";
  const secondary = tags[1] ?? "团队协作";

  return {
    overview: [
      `${tool.name} 属于 ${categoryName} 场景，适合围绕 ${primary} 相关任务做快速落地。当前详情内容由数据库字段动态生成，后续可以继续补充真实评测、截图和版本记录。`,
      `如果你希望把它放进日常工作流，建议优先关注它对 ${secondary}、自动化衔接和输出稳定性的支持程度。`,
      tool.detailed_intro?.trim() || tool.description?.trim() || "当前还没有补充更详细的产品介绍。"
    ],
    features: (features.length > 0 ? features : tags.slice(0, 3)).map((item, index) => ({
      title: item,
      description: `${tool.name} 在 ${item} 这个方向提供了相对明确的产品能力，适合先从高频场景切入验证价值。`,
      icon: (index % 3 === 0 ? "Sparkles" : index % 3 === 1 ? "Workflow" : "Code2") as IconName
    })),
    scenarios: [
      `当你需要更快完成 ${primary} 相关任务时，可以先把 ${tool.name} 作为主入口进行尝试。`,
      `如果团队已经有固定流程，可以把 ${tool.name} 放在内容生成、整理或交付前的一个关键节点。`,
      `如果你在评估多个同类产品，建议重点比较 ${tool.name} 在速度、稳定性和 API 支持上的差异。`
    ],
    faqs: [
      {
        question: `${tool.name} 适合什么类型的用户？`,
        answer: `适合有明确 ${categoryName} 需求，并且希望通过 AI 缩短产出时间的个人或团队。`
      },
      {
        question: `${tool.name} 是否支持 API？`,
        answer: tool.api_available ? "当前数据表明该工具支持 API，可继续评估接入成本。" : "当前数据表明该工具暂未提供 API。"
      },
      {
        question: "接下来还能补充哪些信息？",
        answer: "可以继续补充截图、优缺点、版本变化、真实使用案例和用户反馈。"
      }
    ]
  };
}

export function mapApiToolToDetailModel(tool: ApiTool) {
  return {
    id: tool.id,
    name: tool.name,
    description: tool.description ?? "暂无介绍",
    website: tool.website_url,
    categoryName: tool.categories?.name ?? "未分类",
    categorySlug: tool.categories?.slug ?? "",
    categoryIcon: resolveIconName(tool.categories?.icon),
    tags: tool.tags ?? [],
    features: tool.features ?? [],
    priceLabel: toPriceBadgeLabel(tool.price_model),
    priceTone: tool.price_model === "paid" ? ("paid" as const) : ("free" as const),
    apiAvailable: Boolean(tool.api_available),
    isSponsored: Boolean(tool.is_sponsored),
    publishedAt: tool.published_at ?? tool.created_at,
    updatedAt: tool.updated_at ?? tool.created_at,
    views: tool.views ?? 0,
    clicks: tool.clicks ?? 0,
    logoUrl: tool.logo_url,
    detailContent: buildToolDetailContent(tool),
    theme: getCategoryPresentation(tool.categories?.slug)
  };
}
