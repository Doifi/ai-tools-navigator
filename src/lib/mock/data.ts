import type { IconName } from "@/lib/mock/icon-map";
import {
  featuredMockTools,
  getMockCategoryBySlug,
  getMockPostBySlug,
  getMockToolById,
  getMockToolsByCategorySlug,
  latestMockPosts,
  mapMockPostToCard,
  mapMockToolToCard,
  mockCategories,
  mockPosts,
  mockTools,
  type MockBadgeTone,
  type MockPostContentBlock,
  type PostCardData,
  type PriceModel,
  type ToolCardData
} from "@/lib/mock";

export type PricingTier = PriceModel;
export type ToolBadgeTone = MockBadgeTone;

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: IconName;
  accent: string;
  focus: string;
  toolCount: number;
}

export type Tool = ToolCardData;

export interface PostSection {
  heading: string;
  paragraphs: string[];
}

export interface Post extends PostCardData {
  sections: PostSection[];
  relatedToolIds: string[];
}

function blocksToSections(blocks: MockPostContentBlock[]): PostSection[] {
  const sections: PostSection[] = [];
  let currentSection: PostSection | null = null;

  for (const block of blocks) {
    if (block.type === "heading") {
      currentSection = {
        heading: block.content,
        paragraphs: []
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        heading: "概览",
        paragraphs: []
      };
      sections.push(currentSection);
    }

    if (block.type === "paragraph") {
      currentSection.paragraphs.push(block.content);
    }

    if (block.type === "list") {
      currentSection.paragraphs.push(...block.items.map((item) => `• ${item}`));
    }

    if (block.type === "quote") {
      currentSection.paragraphs.push(`“${block.content}”`);
    }

    if (block.type === "code") {
      currentSection.paragraphs.push(block.code);
    }
  }

  return sections;
}

export const categories: Category[] = mockCategories.map((category) => ({
  slug: category.slug,
  name: category.name,
  description: category.description,
  icon: category.icon,
  accent: category.accent,
  focus: category.focus,
  toolCount: category.count
}));

export const tools: Tool[] = mockTools.map(mapMockToolToCard);

export const posts: Post[] = latestMockPosts.map((post) => ({
  ...mapMockPostToCard(post),
  sections: blocksToSections(post.content),
  relatedToolIds: post.relatedToolIds
}));

export const featuredTools = featuredMockTools.map(mapMockToolToCard);
export const latestPosts = latestMockPosts.slice(0, 3).map((post) => ({
  ...mapMockPostToCard(post),
  sections: blocksToSections(post.content),
  relatedToolIds: post.relatedToolIds
}));

/**
 * 获取单个分类详情。
 */
export function getCategoryBySlug(slug: string) {
  const category = getMockCategoryBySlug(slug);

  if (!category) {
    return undefined;
  }

  return {
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: category.icon,
    accent: category.accent,
    focus: category.focus,
    toolCount: category.count
  };
}

/**
 * 获取分类下的工具列表。
 */
export function getToolsByCategorySlug(slug: string) {
  return getMockToolsByCategorySlug(slug).map(mapMockToolToCard);
}

/**
 * 获取单个工具详情。
 */
export function getToolById(id: string) {
  const tool = getMockToolById(id);
  return tool ? mapMockToolToCard(tool) : undefined;
}

/**
 * 获取单篇文章详情。
 */
export function getPostBySlug(slug: string) {
  const post = getMockPostBySlug(slug);

  if (!post) {
    return undefined;
  }

  return {
    ...mapMockPostToCard(post),
    sections: blocksToSections(post.content),
    relatedToolIds: post.relatedToolIds
  };
}

/**
 * 根据工具 id 获取相关文章推荐工具。
 */
export function getRelatedTools(ids: string[]) {
  return mockTools.filter((tool) => ids.includes(tool.id)).map(mapMockToolToCard);
}
