import { CategoryPageClient } from "@/components/categories/CategoryPageClient";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryPageClient slug={params.slug} />;
}
