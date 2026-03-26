import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import type { ToolBadgeTone } from "@/lib/mock/data";

const badgeTones: Record<ToolBadgeTone, string> = {
  free: "bg-success/12 text-success",
  paid: "bg-warning/14 text-warning",
  api: "bg-brand/12 text-brand",
  plugin: "bg-foreground/8 text-foreground/75",
  new: "bg-accent-coral/12 text-accent-coral"
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ToolBadgeTone;
}

/**
 * 标签组件，用于展示免费、付费、API 等状态。
 */
export function Badge({ className, tone = "plugin", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        badgeTones[tone],
        className
      )}
      {...props}
    />
  );
}

export default Badge;

