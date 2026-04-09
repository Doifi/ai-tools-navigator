const categorySlugAliases: Record<string, string> = {
  "ai-copywriting": "ai-writing",
  productivity: "ai-productivity",
  "ai-chat": "ai-productivity"
};

export function resolveCategorySlugAlias(slug: string) {
  return categorySlugAliases[slug] ?? slug;
}

export function isLegacyCategorySlug(slug: string) {
  return slug in categorySlugAliases;
}
