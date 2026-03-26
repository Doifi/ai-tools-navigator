import { ToolPageClient } from "@/components/tools/ToolPageClient";

interface ToolPageProps {
  params: {
    id: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  return <ToolPageClient id={params.id} />;
}
