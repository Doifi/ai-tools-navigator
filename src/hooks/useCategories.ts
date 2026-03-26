import useSWR from "swr";

import type { ApiCategory } from "@/lib/api-mappers";
import { fetcher } from "@/lib/fetcher";

interface CategoriesResponse {
  categories: ApiCategory[];
}

export function useCategories() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<CategoriesResponse>(
    "/api/categories",
    fetcher
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
