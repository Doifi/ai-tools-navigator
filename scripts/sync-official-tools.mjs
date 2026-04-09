import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

import { officialTools } from "./official-tools-catalog.mjs";

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

async function main() {
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, slug, name");

  if (categoriesError) {
    throw categoriesError;
  }

  const categoryIdBySlug = new Map((categories ?? []).map((category) => [category.slug, category.id]));
  const categoryNameBySlug = new Map((categories ?? []).map((category) => [category.slug, category.name]));
  const results = [];

  for (const tool of officialTools) {
    const categoryId = categoryIdBySlug.get(tool.categorySlug);

    if (!categoryId) {
      throw new Error(`未找到分类 ${tool.categorySlug}，无法同步工具 ${tool.slug}`);
    }

    const { data: existingTool, error: existingToolError } = await supabase
      .from("tools")
      .select("id, published_at")
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

      results.push({
        slug: tool.slug,
        action: "updated",
        market: tool.market,
        category: categoryNameBySlug.get(tool.categorySlug) ?? tool.categorySlug,
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

    results.push({
      slug: tool.slug,
      action: "inserted",
      market: tool.market,
      category: categoryNameBySlug.get(tool.categorySlug) ?? tool.categorySlug,
      website: tool.websiteUrl
    });
  }

  const summary = officialTools.reduce(
    (accumulator, tool) => {
      accumulator.total += 1;
      accumulator.byMarket[tool.market] = (accumulator.byMarket[tool.market] ?? 0) + 1;
      accumulator.byCategory[tool.categorySlug] = (accumulator.byCategory[tool.categorySlug] ?? 0) + 1;
      return accumulator;
    },
    {
      total: 0,
      byMarket: {},
      byCategory: {}
    }
  );

  console.log(
    JSON.stringify(
      {
        summary,
        results
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
