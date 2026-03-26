import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

/**
 * 基础卡片容器，统一边框、圆角和悬停风格。
 */
export function Card({ className, hoverable = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[1.75rem] border border-line/70 bg-white/85 p-6 shadow-soft",
        hoverable && "transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-glow",
        className
      )}
      {...props}
    />
  );
}

export default Card;

