import { CategoryCard } from "@/components/ui/CategoryCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { Category } from "@/lib/mock/data";

interface CategoryShowcaseProps {
  categories: Category[];
}

/**
 * 首页分类展示区块，让用户按场景继续深入浏览。
 */
export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section id="categories" className="space-y-8">
      <SectionHeading
        eyebrow="Categories"
        title="把 AI 工具拆成更容易理解的使用场景"
        description="相比堆叠列表，分类入口更适合新用户快速找到方向，也更便于后续扩展筛选系统。"
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}

export default CategoryShowcase;

