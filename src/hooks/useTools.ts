import { useMemo } from "react";
import useSWR from "swr";

import type { ApiTool } from "@/lib/api-mappers";
import { fetcher } from "@/lib/fetcher";
import type { Enums } from "@/types/supabase";

export type ToolsSortValue = "latest" | "popular" | "click";

interface UseToolsOptions {
  page?: number;
  limit?: number;
  category?: string | null;
  tag?: string | null;
  market?: "china" | "global" | null;
  query?: string | null;
  sort?: ToolsSortValue;
  priceModel?: Enums<"price_model"> | null;
  apiAvailable?: boolean | null;
  enabled?: boolean;
  fallbackData?: ToolsResponse;
}

export interface ToolsResponse {
  tools: ApiTool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function buildToolsUrl(options: UseToolsOptions) {
  const params = new URLSearchParams();

  if (options.page) {
    params.set("page", String(options.page));
  }

  if (options.limit) {
    params.set("limit", String(options.limit));
  }

  if (options.category) {
    params.set("category", options.category);
  }

  if (options.tag) {
    params.set("tag", options.tag);
  }

  if (options.market) {
    params.set("market", options.market);
  }

  if (options.query) {
    params.set("q", options.query);
  }

  if (options.sort) {
    params.set("sort", options.sort);
  }

  if (options.priceModel) {
    params.set("price_model", options.priceModel);
  }

  if (typeof options.apiAvailable === "boolean") {
    params.set("api_available", String(options.apiAvailable));
  }

  return `/api/tools${params.toString() ? `?${params.toString()}` : ""}`;
}

export function useTools(options: UseToolsOptions = {}) {
  const key = useMemo(() => {
    if (options.enabled === false) {
      return null;
    }

    return buildToolsUrl(options);
  }, [
    options.apiAvailable,
    options.category,
    options.enabled,
    options.limit,
    options.market,
    options.page,
    options.priceModel,
    options.query,
    options.sort,
    options.tag
  ]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ToolsResponse>(key, fetcher, {
    keepPreviousData: true,
    fallbackData: options.fallbackData
  });

  return {
    tools: data?.tools ?? [],
    pagination: data?.pagination ?? {
      page: options.page ?? 1,
      limit: options.limit ?? 12,
      total: 0,
      totalPages: 1
    },
    error,
    isLoading,
    isValidating,
    mutate
  };
}

export default useTools;
