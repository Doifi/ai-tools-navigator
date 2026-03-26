import { ToolsCatalogPageClient } from "@/components/tools/ToolsCatalogPageClient";

interface ToolsPageProps {
  searchParams?: {
    sort?: string;
  };
}

function normalizeSort(sort?: string) {
  if (sort === "latest" || sort === "clicks" || sort === "hot") {
    return sort;
  }

  return "hot";
}

export default function ToolsPage({ searchParams }: ToolsPageProps) {
  return <ToolsCatalogPageClient initialSort={normalizeSort(searchParams?.sort)} />;
}
