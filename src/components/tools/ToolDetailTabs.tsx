"use client";

import { useState } from "react";
import { HelpCircle, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getIcon } from "@/lib/mock/icon-map";
import { getMockToolDetailContent, type MockTool } from "@/lib/mock";
import { cn } from "@/lib/utils";

type DetailTab = "overview" | "features" | "scenarios" | "faq";

interface ToolDetailTabsProps {
  tool: MockTool;
  categoryName?: string;
}

const tabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "详细介绍" },
  { id: "features", label: "功能特点" },
  { id: "scenarios", label: "适用场景" },
  { id: "faq", label: "FAQ" }
];

/**
 * 工具详情选项卡区域，负责介绍、功能、场景和 FAQ 的切换展示。
 */
export function ToolDetailTabs({ tool, categoryName }: ToolDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const detailContent = getMockToolDetailContent(tool, categoryName);

  return (
    <section className="space-y-6">
      <div className="surface-panel overflow-hidden p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full px-4 py-3 text-sm font-semibold transition sm:px-5",
                activeTab === tab.id
                  ? "bg-foreground text-white shadow-soft"
                  : "text-foreground/62 hover:bg-background hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <div key={activeTab} className="opacity-0 animate-fade-up">
          {activeTab === "overview" ? (
            <div className="space-y-4">
              {detailContent.overview.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-foreground/72">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {activeTab === "features" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {detailContent.features.map((feature) => {
                const Icon = getIcon(feature.icon);

                return (
                  <div
                    key={feature.title}
                    className="rounded-[1.5rem] border border-line/70 bg-background/85 p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-soft">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-foreground/68">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : null}

          {activeTab === "scenarios" ? (
            <div className="space-y-4">
              {detailContent.scenarios.map((scenario, index) => (
                <div
                  key={scenario}
                  className="flex gap-4 rounded-[1.5rem] border border-line/70 bg-background/80 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-soft">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                      场景 0{index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-foreground/72">{scenario}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "faq" ? (
            <div className="space-y-4">
              {detailContent.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[1.5rem] border border-line/70 bg-background/85 p-5"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 text-brand" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground/68">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}

export default ToolDetailTabs;

