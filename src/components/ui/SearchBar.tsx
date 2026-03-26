"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

/**
 * 首页和列表页可复用的搜索栏，支持受控与非受控两种方式。
 */
export function SearchBar({
  placeholder = "搜索 AI 工具、分类或使用场景",
  defaultValue = "",
  value,
  onChange,
  onSubmit,
  className
}: SearchBarProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = useMemo(() => value ?? innerValue, [innerValue, value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(currentValue.trim());
  };

  return (
    <form
      className={cn(
        "flex flex-col gap-3 rounded-[1.75rem] border border-line/70 bg-white/85 p-3 shadow-soft sm:flex-row sm:items-center",
        className
      )}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-1 items-center gap-3 rounded-[1.25rem] bg-background/85 px-4 py-3">
        <Search className="h-5 w-5 text-foreground/40" />
        <input
          value={currentValue}
          onChange={(event) => {
            if (value === undefined) {
              setInnerValue(event.target.value);
            }
            onChange?.(event.target.value);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/35"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[1.25rem] bg-foreground px-5 text-sm font-semibold text-white transition hover:bg-foreground/90 sm:w-auto"
      >
        <Sparkles className="h-4 w-4" />
        开始探索
      </button>
    </form>
  );
}

export default SearchBar;
