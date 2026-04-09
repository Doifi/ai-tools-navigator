import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env.local");

if (!fs.existsSync(envPath)) {
  throw new Error("缺少 .env.local，无法同步官方工具数据。");
}

const envContent = fs.readFileSync(envPath, "utf8");

for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    continue;
  }

  const key = trimmed.slice(0, separatorIndex);
  const value = trimmed.slice(separatorIndex + 1);

  if (!(key in process.env)) {
    process.env[key] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("缺少 Supabase 必要环境变量。");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const officialTools = [
  {
    name: "ChatGPT",
    slug: "chatgpt",
    websiteUrl: "https://chatgpt.com",
    categorySlug: "ai-productivity",
    description: "全能型 AI 助手，适合问答、写作、分析和工作流整理。",
    detailedIntro:
      "ChatGPT 是 OpenAI 推出的通用型 AI 助手，适合内容创作、问题分析、方案草拟和团队知识整理，是最常见的 AI 工作入口之一。",
    tags: ["工作流", "知识问答", "多场景"],
    features: ["通用问答", "写作辅助", "方案分析"],
    priceModel: "freemium",
    apiAvailable: true,
    isSponsored: true,
    sponsorPlan: "homepage",
    views: 198400,
    clicks: 56120,
    publishedAt: "2026-03-16T00:00:00.000Z"
  },
  {
    name: "Claude",
    slug: "claude",
    websiteUrl: "https://claude.ai",
    categorySlug: "ai-writing",
    description: "擅长长文本理解与结构化写作的 AI 助手。",
    detailedIntro:
      "Claude 由 Anthropic 推出，适合 PRD、访谈纪要、研究报告和品牌文案等高信息密度文本任务。",
    tags: ["长文总结", "策略写作", "语气稳定"],
    features: ["长文本理解", "结构化写作", "内容整理"],
    priceModel: "freemium",
    apiAvailable: true,
    isSponsored: false,
    sponsorPlan: null,
    views: 174800,
    clicks: 48650,
    publishedAt: "2026-03-14T00:00:00.000Z"
  },
  {
    name: "Midjourney",
    slug: "midjourney",
    websiteUrl: "https://midjourney.com",
    categorySlug: "ai-drawing",
    description: "高表现力图像生成工具，适合视觉概念探索。",
    detailedIntro:
      "Midjourney 适合设计师和内容团队快速生成风格化视觉、概念海报和灵感草图。",
    tags: ["视觉创意", "海报灵感", "品牌风格"],
    features: ["图像生成", "风格探索", "创意打样"],
    priceModel: "paid",
    apiAvailable: false,
    isSponsored: true,
    sponsorPlan: "featured",
    views: 186200,
    clicks: 51910,
    publishedAt: "2026-03-15T00:00:00.000Z"
  },
  {
    name: "Runway",
    slug: "runway",
    websiteUrl: "https://runwayml.com",
    categorySlug: "ai-video",
    description: "AI 视频生成与编辑平台，适合营销内容打样。",
    detailedIntro:
      "Runway 可用于视频生成、镜头延展、素材处理和广告创意演示，适合内容与增长团队。",
    tags: ["视频生成", "镜头延展", "广告素材"],
    features: ["文生视频", "视频编辑", "创意打样"],
    priceModel: "paid",
    apiAvailable: true,
    isSponsored: true,
    sponsorPlan: "featured",
    views: 140600,
    clicks: 39820,
    publishedAt: "2026-03-11T00:00:00.000Z"
  },
  {
    name: "Cursor",
    slug: "cursor",
    websiteUrl: "https://cursor.com",
    categorySlug: "ai-coding",
    description: "面向工程团队的 AI 编辑器，聚焦真实代码上下文。",
    detailedIntro:
      "Cursor 提供代码补全、项目问答、重构建议和跨文件上下文理解能力，适合真实工程协作。",
    tags: ["代码补全", "项目问答", "重构"],
    features: ["AI 编辑器", "项目理解", "跨文件重构"],
    priceModel: "freemium",
    apiAvailable: false,
    isSponsored: false,
    sponsorPlan: null,
    views: 162700,
    clicks: 47240,
    publishedAt: "2026-03-17T00:00:00.000Z"
  },
  {
    name: "GitHub Copilot",
    slug: "github-copilot",
    websiteUrl: "https://github.com/features/copilot",
    categorySlug: "ai-coding",
    description: "集成在开发流程中的 AI 编程助手。",
    detailedIntro:
      "GitHub Copilot 适合在 IDE 中完成代码补全、测试生成和代码解释等工程任务。",
    tags: ["IDE 集成", "代码建议", "测试生成"],
    features: ["代码补全", "测试辅助", "开发协作"],
    priceModel: "paid",
    apiAvailable: false,
    isSponsored: false,
    sponsorPlan: null,
    views: 133200,
    clicks: 36570,
    publishedAt: "2026-03-09T00:00:00.000Z"
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    websiteUrl: "https://elevenlabs.io",
    categorySlug: "ai-audio",
    description: "高拟真语音合成与角色配音工具。",
    detailedIntro:
      "ElevenLabs 适合课程配音、播客旁白、多语言语音生成和角色声音设计。",
    tags: ["配音", "语音克隆", "多语言"],
    features: ["语音合成", "语音克隆", "多语言配音"],
    priceModel: "freemium",
    apiAvailable: true,
    isSponsored: false,
    sponsorPlan: null,
    views: 128900,
    clicks: 34110,
    publishedAt: "2026-03-13T00:00:00.000Z"
  },
  {
    name: "Suno",
    slug: "suno",
    websiteUrl: "https://suno.com",
    categorySlug: "ai-audio",
    description: "一句话生成完整歌曲，适合创意灵感和传播实验。",
    detailedIntro:
      "Suno 帮助团队快速生成歌曲 demo、短视频配乐和轻量音乐创意方案。",
    tags: ["音乐生成", "短视频配乐", "创意实验"],
    features: ["AI 作曲", "歌曲生成", "创意配乐"],
    priceModel: "freemium",
    apiAvailable: false,
    isSponsored: false,
    sponsorPlan: null,
    views: 98700,
    clicks: 25520,
    publishedAt: "2026-03-08T00:00:00.000Z"
  },
  {
    name: "Notion AI",
    slug: "notion-ai",
    websiteUrl: "https://www.notion.com/product/ai",
    categorySlug: "ai-productivity",
    description: "嵌入知识库与协作空间的 AI 办公助手。",
    detailedIntro:
      "Notion AI 适合会议纪要、知识库整理、任务拆解和团队文档协作，是效率办公场景里的高频入口。",
    tags: ["知识管理", "会议纪要", "团队协作"],
    features: ["知识库协作", "会议纪要", "文档智能整理"],
    priceModel: "paid",
    apiAvailable: false,
    isSponsored: false,
    sponsorPlan: null,
    views: 121400,
    clicks: 29630,
    publishedAt: "2026-03-12T00:00:00.000Z"
  },
  {
    name: "Perplexity",
    slug: "perplexity",
    websiteUrl: "https://perplexity.ai",
    categorySlug: "ai-productivity",
    description: "以搜索和研究为核心的 AI 答案引擎。",
    detailedIntro:
      "Perplexity 适合快速查资料、梳理竞品信息和生成带来源的研究摘要，是研究型工作流常用入口。",
    tags: ["AI 搜索", "研究分析", "来源引用"],
    features: ["AI 搜索", "研究摘要", "来源引用"],
    priceModel: "freemium",
    apiAvailable: false,
    isSponsored: true,
    sponsorPlan: "featured",
    views: 176300,
    clicks: 49380,
    publishedAt: "2026-03-18T00:00:00.000Z"
  },
  {
    name: "Jasper",
    slug: "jasper",
    websiteUrl: "https://www.jasper.ai",
    categorySlug: "ai-writing",
    description: "面向营销团队的 AI 文案与 Campaign 生成工具。",
    detailedIntro:
      "Jasper 适合广告文案、邮件营销、品牌内容和多渠道 Campaign 素材生成。",
    tags: ["广告文案", "Campaign", "品牌内容"],
    features: ["营销文案", "Campaign 生成", "品牌内容"],
    priceModel: "paid",
    apiAvailable: true,
    isSponsored: true,
    sponsorPlan: "featured",
    views: 117500,
    clicks: 31220,
    publishedAt: "2026-03-10T00:00:00.000Z"
  },
  {
    name: "Canva Magic Design",
    slug: "canva-magic-design",
    websiteUrl: "https://www.canva.com/magic-design/",
    categorySlug: "ai-design",
    description: "适合非设计团队快速生成图文素材与演示视觉。",
    detailedIntro:
      "Canva Magic Design 可快速产出社媒图、演示稿视觉和多尺寸营销素材，适合轻量设计场景。",
    tags: ["社媒素材", "演示视觉", "轻量设计"],
    features: ["设计生成", "演示视觉", "多尺寸素材"],
    priceModel: "freemium",
    apiAvailable: false,
    isSponsored: false,
    sponsorPlan: null,
    views: 89500,
    clicks: 21780,
    publishedAt: "2026-03-07T00:00:00.000Z"
  }
];

async function main() {
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, slug");

  if (categoriesError) {
    throw categoriesError;
  }

  const categoryIdBySlug = new Map((categories ?? []).map((category) => [category.slug, category.id]));
  const result = [];

  for (const tool of officialTools) {
    const categoryId = categoryIdBySlug.get(tool.categorySlug);

    if (!categoryId) {
      throw new Error(`未找到分类 ${tool.categorySlug}，无法同步工具 ${tool.slug}`);
    }

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("id, created_at, published_at, views, clicks")
      .eq("slug", tool.slug)
      .maybeSingle();

    if (existingToolError) {
      throw existingToolError;
    }

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
      status: "published",
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

      result.push({
        slug: tool.slug,
        action: "updated",
        website: tool.websiteUrl
      });
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

    result.push({
      slug: tool.slug,
      action: "inserted",
      website: tool.websiteUrl
    });
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
