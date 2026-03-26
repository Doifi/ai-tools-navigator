"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

const API_KEY_PREFIX = "/api/";
const REFRESH_COOLDOWN_MS = 12000;

/**
 * 全站触底刷新组件。滚动到底部时自动刷新当前页面并重新验证 API 数据。
 */
export function BottomRefresh() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastRefreshRef = useRef(0);
  const canTriggerRef = useRef(true);
  const hideTimerRef = useRef<number | null>(null);
  const [statusText, setStatusText] = useState("继续下滑可自动刷新");
  const [isRefreshing, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useSWRConfig();

  useEffect(() => {
    canTriggerRef.current = true;
    lastRefreshRef.current = 0;
    setStatusText("继续下滑可自动刷新");
  }, [pathname]);

  useEffect(() => {
    const target = sentinelRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry) {
          return;
        }

        if (!entry.isIntersecting) {
          canTriggerRef.current = true;
          if (!isRefreshing) {
            setStatusText("继续下滑可自动刷新");
          }
          return;
        }

        const now = Date.now();

        if (!canTriggerRef.current || now - lastRefreshRef.current < REFRESH_COOLDOWN_MS) {
          return;
        }

        canTriggerRef.current = false;
        lastRefreshRef.current = now;
        setStatusText("已触底，正在刷新内容...");

        startTransition(() => {
          router.refresh();
        });

        try {
          await mutate(
            (key) => typeof key === "string" && key.startsWith(API_KEY_PREFIX),
            undefined,
            { revalidate: true }
          );
          setStatusText("内容已刷新");
        } catch {
          setStatusText("刷新失败，请稍后再试");
        }

        if (hideTimerRef.current) {
          window.clearTimeout(hideTimerRef.current);
        }

        hideTimerRef.current = window.setTimeout(() => {
          setStatusText("继续下滑可自动刷新");
        }, 2200);
      },
      {
        threshold: 0.9
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [isRefreshing, mutate, router]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-12 w-full" />

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-4">
        <div className="flex items-center gap-2 rounded-full border border-line/80 bg-white/92 px-4 py-2 text-xs font-medium text-foreground/68 shadow-soft backdrop-blur">
          <RefreshCw className={`h-3.5 w-3.5 text-brand ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{statusText}</span>
        </div>
      </div>
    </>
  );
}

export default BottomRefresh;
