import { redirect } from "next/navigation";

import { CategoryPageClient } from "@/components/categories/CategoryPageClient";
import { resolveCategorySlugAlias } from "@/lib/routing/legacy";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedSlug = resolveCategorySlugAlias(params.slug);

  if (resolvedSlug !== params.slug) {
    redirect(`/categories/${resolvedSlug}`);
  }

  return <CategoryPageClient slug={resolvedSlug} />;
}
