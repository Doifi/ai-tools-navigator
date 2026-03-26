import { ToolCard } from "@/components/ui/ToolCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { Tool } from "@/lib/mock/data";

interface FeaturedToolsSectionProps {
  tools: Tool[];
}

/**
 * 首页热门工具区块，强调核心工具卡片展示。
 */
export function FeaturedToolsSection({ tools }: FeaturedToolsSectionProps) {
  return (
    <section id="featured" className="space-y-8">
      <SectionHeading
        eyebrow="Featured Tools"
        title="先看当下最值得上手的一批工具"
        description="首页先展示精选集合，让用户在进入站点后的第一屏就能快速获得明确推荐。"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedToolsSection;

