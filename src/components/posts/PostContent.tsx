import Link from "next/link";
import type { ReactNode } from "react";

import type { MockPostContentBlock, MockTool } from "@/lib/mock";
import { getToolPath } from "@/lib/tool-routes";

interface PostContentProps {
  blocks: MockPostContentBlock[];
  mentionedTools: MockTool[];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderTextWithMentions(text: string, tools: MockTool[]): ReactNode {
  if (tools.length === 0) {
    return text;
  }

  const sortedTools = [...tools].sort((a, b) => b.name.length - a.name.length);
  const pattern = new RegExp(`(${sortedTools.map((tool) => escapeRegExp(tool.name)).join("|")})`, "g");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const matchedTool = sortedTools.find((tool) => tool.name === part);

    if (!matchedTool) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <Link
        key={`${matchedTool.id}-${index}`}
        href={getToolPath(matchedTool)}
        className="inline-flex rounded-full bg-brand/10 px-2 py-0.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
      >
        {matchedTool.name}
      </Link>
    );
  });
}

/**
 * 文章内容渲染组件，使用 mock 富文本块模拟 Markdown 风格内容。
 */
export function PostContent({ blocks, mentionedTools }: PostContentProps) {
  return (
    <article className="article-content">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 3) {
            return (
              <h3 key={`${block.type}-${index}`} className="mt-8 font-display text-xl font-semibold text-foreground">
                {block.content}
              </h3>
            );
          }

          return (
            <h2 key={`${block.type}-${index}`} className="mt-10 font-display text-2xl font-semibold text-foreground first:mt-0">
              {block.content}
            </h2>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={`${block.type}-${index}`} className="mt-4 text-base leading-8 text-foreground/72">
              {renderTextWithMentions(block.content, mentionedTools)}
            </p>
          );
        }

        if (block.type === "list") {
          const ListTag = block.style === "ordered" ? "ol" : "ul";

          return (
            <ListTag
              key={`${block.type}-${index}`}
              className={
                block.style === "ordered"
                  ? "mt-4 list-decimal space-y-3 pl-6 text-base leading-8 text-foreground/72"
                  : "mt-4 list-disc space-y-3 pl-6 text-base leading-8 text-foreground/72"
              }
            >
              {block.items.map((item) => (
                <li key={item}>{renderTextWithMentions(item, mentionedTools)}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={`${block.type}-${index}`}
              className="mt-6 rounded-[1.5rem] border border-brand/15 bg-brand/6 px-5 py-4 text-base leading-8 text-foreground/72"
            >
              <span className="text-lg font-semibold text-brand">“</span>
              {renderTextWithMentions(block.content, mentionedTools)}
            </blockquote>
          );
        }

        return (
          <div key={`${block.type}-${index}`} className="mt-6 overflow-hidden rounded-[1.5rem] border border-line/70 bg-foreground">
            <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              {block.language}
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-7 text-white/88">
              <code>{block.code}</code>
            </pre>
          </div>
        );
      })}
    </article>
  );
}

export default PostContent;
