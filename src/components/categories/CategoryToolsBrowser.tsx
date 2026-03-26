"use client";

import { SearchX } from "lucide-react";
import { useState } from "react";

import { CategoryFilterBar } from "@/components/categories/CategoryFilterBar";
import type {
  CategoryFilterValue,
  CategorySortValue,
  CategoryViewMode
} from "@/components/categories/CategoryFilterBar";
import { CategoryPagination } from "@/components/categories/CategoryPagination";
import { CategoryToolListItem } from "@/components/categories/CategoryToolListItem";
import { Button } from "@/components/ui/Button";
import { ToolCard } from "@/components/ui/ToolCard";
import { mapMockToolToCard, type MockTool } from "@/lib/mock";

interface CategoryToolsBrowserProps {
  tools: MockTool[];
}

const PAGE_SIZE = 12;

function applyFilter(tools: MockTool[], filter: CategoryFilterValue) {
  switch (filter) {
    case "free":
      return tools.filter((tool) => tool.priceModel === "Free");
    case "paid":
      return tools.filter((tool) => tool.priceModel === "Paid");
    case "trial":
      return tools.filter((tool) => tool.priceModel === "Freemium");
    case "api":
      return tools.filter((tool) => tool.apiAvailable);
    default:
      return tools;
  }
}

function applySort(tools: MockTool[], sort: CategorySortValue) {
  switch (sort) {
    case "hot":
      return [...tools].sort((a, b) => b.viewCount - a.viewCount);
    case "clicks":
      return [...tools].sort((a, b) => b.clickCount - a.clickCount);
    case "latest":
    default:
      return [...tools].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

/**
 * 分类页主交互区域，处理筛选、排序、视图切换和分页。
 */
export function CategoryToolsBrowser({ tools }: CategoryToolsBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilterValue>("all");
  const [activeSort, setActiveSort] = useState<CategorySortValue>("latest");
  const [viewMode, setViewMode] = useState<CategoryViewMode>("grid");
  const [page, setPage] = useState(1);

  const filteredTools = applySort(applyFilter(tools, activeFilter), activeSort);
  const totalPages = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (value: CategoryFilterValue) => {
    setActiveFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: CategorySortValue) => {
    setActiveSort(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <CategoryFilterBar
        activeFilter={activeFilter}
        activeSort={activeSort}
        viewMode={viewMode}
        resultCount={filteredTools.length}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onViewModeChange={setViewMode}
      />

      {filteredTools.length === 0 ? (
        <div className="surface-panel flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-brand">
            <SearchX className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
            没有找到符合条件的工具
          </h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-foreground/64">
            可以尝试切换筛选条件，或者先查看全部工具，看看是否有接近你需求的方向。
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => {
              setActiveFilter("all");
              setActiveSort("latest");
              setPage(1);
            }}
          >
            重置筛选
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {paginatedTools.map((tool) => (
            <div key={tool.id} className="relative h-full">
              {tool.isSponsored ? (
                <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-accent-coral px-3 py-1 text-xs font-semibold text-white shadow-soft">
                  推荐
                </div>
              ) : null}
              <ToolCard tool={mapMockToolToCard(tool)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {paginatedTools.map((tool) => (
            <CategoryToolListItem key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      <CategoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setPage((value) => Math.max(1, value - 1))}
        onNext={() => setPage((value) => Math.min(totalPages, value + 1))}
      />
    </div>
  );
}

export default CategoryToolsBrowser;
