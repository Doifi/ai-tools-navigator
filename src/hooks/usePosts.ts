import { useMemo } from "react";
import useSWR from "swr";

import type { ApiPost } from "@/lib/api-mappers";
import { fetcher } from "@/lib/fetcher";

interface UsePostsOptions {
  page?: number;
  limit?: number;
  category?: string | null;
  toolId?: string | null;
  enabled?: boolean;
}

interface PostsResponse {
  posts: ApiPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function buildPostsUrl(options: UsePostsOptions) {
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

  if (options.toolId) {
    params.set("tool_id", options.toolId);
  }

  return `/api/posts${params.toString() ? `?${params.toString()}` : ""}`;
}

export function usePosts(options: UsePostsOptions = {}) {
  const key = useMemo(() => {
    if (options.enabled === false) {
      return null;
    }

    return buildPostsUrl(options);
  }, [options.category, options.enabled, options.limit, options.page, options.toolId]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<PostsResponse>(key, fetcher, {
    keepPreviousData: true
  });

  return {
    posts: data?.posts ?? [],
    pagination: data?.pagination ?? {
      page: options.page ?? 1,
      limit: options.limit ?? 9,
      total: 0,
      totalPages: 1
    },
    error,
    isLoading,
    isValidating,
    mutate
  };
}

export default usePosts;
