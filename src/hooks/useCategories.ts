import useSWR from "swr";

import type { ApiCategory } from "@/lib/api-mappers";
import { fetcher } from "@/lib/fetcher";

export interface CategoriesResponse {
  categories: ApiCategory[];
}

interface UseCategoriesOptions {
  fallbackData?: CategoriesResponse;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<CategoriesResponse>(
    "/api/categories",
    fetcher,
    {
      fallbackData: options.fallbackData
    }
  );

  return {
    categories: data?.categories ?? [],
    error,
    isLoading,
    isValidating,
    mutate
  };
}

export default useCategories;
