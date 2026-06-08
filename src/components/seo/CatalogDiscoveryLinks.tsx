import Link from "next/link";

import { Container } from "@/components/layout/Container";
import type { ApiCategory, ApiTool } from "@/lib/api-mappers";
import { getToolPath } from "@/lib/tool-routes";

interface CatalogDiscoveryLinksProps {
  title: string;
  description: string;
  categories?: ApiCategory[];
  tools?: ApiTool[];
}

export function CatalogDiscoveryLinks({
  title,
  description,
  categories = [],
  tools = []
}: CatalogDiscoveryLinksProps) {
  if (categories.length === 0 && tools.length === 0) {
    return null;
  }

  return (
    <Container className="pb-14">
      <section className="space-y-7 border-t border-line/70 pt-10">
        <div className="max-w-3xl">
          <p className="eyebrow">Discovery Links</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">{title}</h2>
          <p className="mt-4 text-sm leading-7 text-foreground/64">{description}</p>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-foreground">分类入口</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="rounded-full border border-line/70 bg-white px-4 py-2 text-sm font-semibold text-foreground/68 transition hover:border-brand/30 hover:text-brand"
                >
                  {category.name}
                  {typeof category.toolCount === "number" ? (
                    <span className="ml-2 text-foreground/42">{category.toolCount}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {tools.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-foreground">工具入口</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={getToolPath(tool)}
                  className="rounded-2xl border border-line/70 bg-white px-4 py-4 transition hover:border-brand/30 hover:shadow-soft"
                >
                  <span className="block font-semibold text-foreground">{tool.name}</span>
                  <span className="mt-2 block line-clamp-2 text-sm leading-6 text-foreground/60">
                    {tool.description ?? tool.categories?.name ?? "AI 工具"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </Container>
  );
}

export default CatalogDiscoveryLinks;
