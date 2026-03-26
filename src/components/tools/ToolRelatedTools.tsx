import { ToolCard } from "@/components/ui/ToolCard";
import { mapMockToolToCard, type MockTool } from "@/lib/mock";

interface ToolRelatedToolsProps {
  tools: MockTool[];
}

/**
 * 同分类相关工具区块，使用横向滚动卡片展示。
 */
export function ToolRelatedTools({ tools }: ToolRelatedToolsProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Related Tools</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">相关工具</h2>
      </div>

      <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-3">
        {tools.map((tool) => (
          <div key={tool.id} className="min-w-[320px] max-w-[360px] snap-start">
            <ToolCard tool={mapMockToolToCard(tool)} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ToolRelatedTools;

