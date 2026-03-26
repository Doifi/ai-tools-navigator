import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

/**
 * 基础输入框组件，带 label、提示文案和错误信息。
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, label, error, hint, id, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {label ? (
          <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          id={id}
          className={cn(
            "h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10",
            error && "border-warning/45 focus:border-warning/55 focus:ring-warning/10",
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-sm text-warning">{error}</p>
        ) : hint ? (
          <p className="text-sm text-foreground/55">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

