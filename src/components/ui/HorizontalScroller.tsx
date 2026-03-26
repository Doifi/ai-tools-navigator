"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HorizontalScrollerProps {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  hint?: string;
}

/**
 * 通用横向滑动容器，支持滚动条、左右切换按钮和滚动状态检测。
 */
export function HorizontalScroller({
  items,
  className,
  itemClassName,
  hint = "左右滑动查看更多工具"
}: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const updateState = () => {
      const { scrollLeft, clientWidth, scrollWidth } = element;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
    };

    updateState();
    element.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      element.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [items.length]);

  const handleScroll = (direction: "left" | "right") => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const scrollAmount = Math.max(element.clientWidth * 0.82, 320);
    element.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        ref={scrollRef}
        className="slider-scrollbar -mx-1 flex snap-x gap-5 overflow-x-auto px-1 pb-4 scroll-smooth"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "min-w-[280px] flex-none snap-start sm:min-w-[320px] xl:min-w-[340px]",
              itemClassName
            )}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/52">{hint}</p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="向左滑动"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="向右滑动"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HorizontalScroller;
