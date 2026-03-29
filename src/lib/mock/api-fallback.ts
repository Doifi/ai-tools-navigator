import {
  mockCategories,
  mockPosts,
  mockTools
} from "@/lib/mock";
import type { ApiCategory, ApiPost, ApiTool } from "@/lib/api-mappers";
import type { Enums } from "@/types/supabase";

const mockCategoryIdMap = new Map(
  mockCategories.map((category, index) => [
    category.slug,
    `00000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`
  ])
);

function toCategoryId(slug: string) {
  return mockCategoryIdMap.get(slug) ?? null;
}

function toPriceModel(priceModel: "Free" | "Freemium" | "Paid"): Enums<"price_model"> {
  switch (priceModel) {
    case "Free":
      return "free";
    case "Paid":
      return "paid";
    case "Freemium":
    default:
      return "freemium";
  }
}

export function getMockApiCategories(): ApiCategory[] {
  return mockCategories.map((category, index) => ({
    id: toCategoryId(category.slug) ?? category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    sort_order: index + 1,
    created_at: "2026-01-01T00:00:00.000Z",
    toolCount: category.count
  }));
}

export function getMockApiCategoryById(id: string) {
  return getMockApiCategories().find((category) => category.id === id) ?? null;
}

export function getMockApiCategoryBySlug(slug: string) {
  return getMockApiCategories().find((category) => category.slug === slug) ?? null;
}

export function getMockApiTools(): ApiTool[] {
  const categoriesBySlug = new Map(getMockApiCategories().map((category) => [category.slug, category]));

  return mockTools.map((tool) => {
    const category = categoriesBySlug.get(tool.category) ?? null;
    const timestamp = new Date(tool.createdAt).toISOString();

    return {
      id: tool.id,
      name: tool.name,
      slug: tool.id,
      description: tool.description,
      detailed_intro: `${tool.tagline}\n\n${tool.description}`,
      logo_url: null,
      website_url: tool.website,
      category_id: category?.id ?? null,
      tags: tool.tags,
      price_model: toPriceModel(tool.priceModel),
      api_available: tool.apiAvailable,
      features: tool.tags,
      is_sponsored: tool.isSponsored,
      sponsor_plan: tool.isSponsored ? "featured" : null,
      sponsor_expiry: null,
      views: tool.viewCount,
      clicks: tool.clickCount,
      status: "published",
      created_at: timestamp,
      updated_at: timestamp,
      published_at: timestamp,
      categories: category
    };
  });
}

export function getMockApiToolById(id: string) {
  return getMockApiTools().find((tool) => tool.id === id) ?? null;
}

export function getMockApiPosts(): ApiPost[] {
  const categoriesBySlug = new Map(getMockApiCategories().map((category) => [category.slug, category]));

  return mockPosts.map((post) => {
    const category = categoriesBySlug.get(post.categorySlug) ?? null;
    const timestamp = new Date(post.date).toISOString();

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: JSON.stringify(post.content),
      excerpt: post.excerpt,
      cover_image: post.coverImage,
      related_tools: post.relatedToolIds,
      author: post.author,
      views: post.viewCount,
      status: "published",
      published_at: timestamp,
      created_at: timestamp,
      category_id: category?.id ?? null,
      categories: category
    };
  });
}

export function getMockApiPostBySlug(slug: string) {
  return getMockApiPosts().find((post) => post.slug === slug) ?? null;
}

interface MockToolsQuery {
  page: number;
  limit: number;
  categoryId?: string | null;
  tag?: string | null;
  sort?: string | null;
  priceModel?: Enums<"price_model"> | null;
  apiAvailable?: string | null;
}

export function queryMockApiTools({
  page,
  limit,
  categoryId,
  tag,
  sort,
  priceModel,
  apiAvailable
}: MockToolsQuery) {
  let tools = [...getMockApiTools()];

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

interface MockPostsQuery {
  page: number;
  limit: number;
  categoryId?: string | null;
  toolId?: string | null;
}

export function queryMockApiPosts({ page, limit, categoryId, toolId }: MockPostsQuery) {
  let posts = [...getMockApiPosts()];

  if (categoryId) {
    posts = posts.filter((post) => post.category_id === categoryId);
  }

  if (toolId) {
    posts = posts.filter((post) => post.related_tools?.includes(toolId));
  }

  posts.sort(
    (a, b) =>
      new Date(b.published_at ?? b.created_at ?? 0).getTime() -
      new Date(a.published_at ?? a.created_at ?? 0).getTime()
  );

  const total = posts.length;
  const from = (page - 1) * limit;
  const pagedPosts = posts.slice(from, from + limit);

  return {
    posts: pagedPosts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

export function getMockRelatedToolsForPost(slug: string) {
  const post = mockPosts.find((item) => item.slug === slug);

  if (!post) {
    return [];
  }

  return post.relatedToolIds
    .map((toolId) => getMockApiToolById(toolId))
    .filter(
      (
        tool
      ): tool is NonNullable<ReturnType<typeof getMockApiToolById>> => Boolean(tool)
    )
    .map((tool) => ({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      logo_url: tool.logo_url,
      description: tool.description
    }));
}
