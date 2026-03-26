import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getIcon } from "@/lib/mock/icon-map";
import type { Category } from "@/lib/mock/data";

interface CategoryCardProps {
  category: Category;
}

/**
 * 分类卡片，用于在首页和分类列表中展示导航入口。
 */
export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = getIcon(category.icon);

  return (
    <Link href={`/categories/${category.slug}`} className="block h-full">
      <Card className="relative h-full overflow-hidden bg-gradient-to-br to-white">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-100`}
          aria-hidden="true"
        />
        <div className="relative flex h-full flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-brand shadow-soft">
              <Icon className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-foreground/60">
              {category.toolCount} 款工具
            </span>
          </div>

          <div>
            <h3 className="font-display text-xl font-semibold text-foreground">{category.name}</h3>
            <p className="mt-2 text-sm leading-7 text-foreground/70">{category.description}</p>
          </div>

          <div className="mt-auto flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-sm text-foreground/68">
            <span>{category.focus}</span>
            <ArrowRight className="h-4 w-4 text-brand" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default CategoryCard;
