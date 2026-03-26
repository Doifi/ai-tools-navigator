"use client";

import { Grid2X2, List, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export type CategoryFilterValue = "all" | "free" | "paid" | "trial" | "api";
export type CategorySortValue = "latest" | "hot" | "clicks";
export type CategoryViewMode = "grid" | "list";

interface CategoryFilterBarProps {
  activeFilter: CategoryFilterValue;
  activeSort: CategorySortValue;
  viewMode: CategoryViewMode;
  resultCount: number;
  onFilterChange: (value: CategoryFilterValue) => void;
  onSortChange: (value: CategorySortValue) => void;
  onViewModeChange: (value: CategoryViewMode) => void;
}

const filterOptions: Array<{
  value: CategoryFilterValue;
  label: string;
  tone: "plugin" | "free" | "paid" | "api";
}> = [
  { value: "all", label: "全部", tone: "plugin" },
  { value: "free", label: "免费", tone: "free" },
  { value: "paid", label: "付费", tone: "paid" },
  { value: "trial", label: "免费试用", tone: "free" },
  { value: "api", label: "有 API", tone: "api" }
];

/**
 * 分类页工具栏，负责筛选、排序和视图切换。
 */
export function CategoryFilterBar({
  activeFilter,
  activeSort,
  viewMode,
  resultCount,
  onFilterChange,
  onSortChange,
  onViewModeChange
}: CategoryFilterBarProps) {
  return (
    <div className="surface-panel space-y-5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/65">
          <SlidersHorizontal className="h-4 w-4 text-brand" />
          当前共找到 {resultCount} 款工具
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-foreground/60" htmlFor="category-sort">
            排序
          </label>
          <select
            id="category-sort"
            value={activeSort}
            onChange={(event) => onSortChange(event.target.value as CategorySortValue)}
            className="h-11 rounded-full border border-line/70 bg-white px-4 text-sm text-foreground outline-none transition focus:border-brand/35"
          >
            <option value="latest">最新</option>
            <option value="hot">最热</option>
            <option value="clicks">最多点击</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(option.value)}
                className="transition hover:-translate-y-0.5"
              >
                <Badge
                  tone={isActive ? option.tone : "plugin"}
                  className={cn(
                    "border px-4 py-2 text-sm",
                    isActive
                      ? "border-transparent shadow-soft"
                      : "border-line/70 bg-white text-foreground/68 hover:border-brand/25 hover:text-brand"
                  )}
                >
                  {option.label}
                </Badge>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-line/70 bg-background/70 p-1">
          <button
            type="button"
            aria-label="网格视图"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition",
              viewMode === "grid"
                ? "bg-foreground text-white"
                : "text-foreground/55 hover:text-foreground"
            )}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="列表视图"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition",
              viewMode === "list"
                ? "bg-foreground text-white"
                : "text-foreground/55 hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryFilterBar;
