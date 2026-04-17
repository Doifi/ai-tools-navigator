import { ToolsCatalogPageClient } from "@/components/tools/ToolsCatalogPageClient";

interface ToolsPageProps {
  searchParams?: {
    q?: string;
    sort?: string;
    market?: string;
  };
}

function normalizeSort(sort?: string) {
  if (sort === "latest" || sort === "clicks" || sort === "hot") {
    return sort;
  }

  return "hot";
}

function normalizeMarket(market?: string) {
  if (market === "china" || market === "global") {
    return market;
  }

  return "all";
}

export default function ToolsPage({ searchParams }: ToolsPageProps) {
  return (
    <ToolsCatalogPageClient
      initialSort={normalizeSort(searchParams?.sort)}
      initialQuery={searchParams?.q?.trim() ?? ""}
      initialMarket={normalizeMarket(searchParams?.market)}
    />
  );
}
