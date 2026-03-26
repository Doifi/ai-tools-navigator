import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface VerticalScrollPanelProps {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  gridClassName?: string;
  hint?: string;
  maxHeightClassName?: string;
}

/**
 * 通用纵向滚动面板，用于在固定区域内向下滚动浏览更多卡片内容。
 */
export function VerticalScrollPanel({
  items,
  className,
  itemClassName,
  gridClassName = "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
  hint = "向下滚动查看更多工具",
  maxHeightClassName = "max-h-[58rem]"
}: VerticalScrollPanelProps) {
  return (
    <div className="space-y-4">
      <div className={cn("slider-scrollbar overflow-y-auto pr-2", maxHeightClassName, className)}>
        <div className={gridClassName}>
          {items.map((item, index) => (
            <div key={index} className={itemClassName}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-foreground/52">{hint}</p>
    </div>
  );
}

export default VerticalScrollPanel;
