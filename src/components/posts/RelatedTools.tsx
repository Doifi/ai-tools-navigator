import { ToolCard } from "@/components/ui/ToolCard";
import { mapMockToolToCard, type MockTool } from "@/lib/mock";

interface RelatedToolsProps {
  tools: MockTool[];
}

/**
 * 文章底部关联工具展示区。
 */
export function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Related Tools</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">关联工具</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={mapMockToolToCard(tool)} />
        ))}
      </div>
    </section>
  );
}

export default RelatedTools;
