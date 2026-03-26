"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * 分类页分页组件，负责页码展示和上一页/下一页切换。
 */
export function CategoryPagination({
  currentPage,
  totalPages,
  onPrev,
  onNext
}: CategoryPaginationProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-line/70 bg-white/85 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-foreground/62">
        当前第 <span className="font-semibold text-foreground">{currentPage}</span> 页，共{" "}
        <span className="font-semibold text-foreground">{totalPages}</span> 页
      </p>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={currentPage <= 1}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          上一页
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          下一页
        </Button>
      </div>
    </div>
  );
}

export default CategoryPagination;
