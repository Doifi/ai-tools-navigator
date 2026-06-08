import Link from "next/link";
import { Fragment, ReactNode } from "react";

import { getToolPath } from "@/lib/tool-routes";

interface RelatedToolSummary {
  id: string;
  slug?: string | null;
  name: string;
}

interface PostMarkdownContentProps {
  content: string;
  relatedTools?: RelatedToolSummary[];
}

function renderInline(content: string, relatedTools: RelatedToolSummary[]) {
  const parts = content
    .split(/(\[\[[^[\]]+\]\]|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g)
    .filter(Boolean);

  return parts.map((part, index) => {
    const matched = part.match(/^\[\[([^[\]]+)\]\]$/);

    if (matched) {
      const toolName = matched[1];
      const linkedTool = relatedTools.find((tool) => tool.name.toLowerCase() === toolName.toLowerCase());

      if (linkedTool) {
        return (
          <Link
            key={`${toolName}-${index}`}
            href={getToolPath(linkedTool)}
            className="rounded-full bg-brand/10 px-2 py-1 font-semibold text-brand transition hover:bg-brand/15"
          >
            {linkedTool.name}
          </Link>
        );
      }

      return (
        <span
          key={`${toolName}-${index}`}
          className="rounded-full bg-background px-2 py-1 font-semibold text-foreground"
        >
          {toolName}
        </span>
      );
    }

    const markdownLink = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);

    if (markdownLink) {
      return (
        <Link
          key={`${markdownLink[2]}-${index}`}
          href={markdownLink[2]}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition hover:text-brand-strong"
        >
          {markdownLink[1]}
        </Link>
      );
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

export function PostMarkdownContent({
  content,
  relatedTools = []
}: PostMarkdownContentProps) {
  const blocks: ReactNode[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.replace(/```/, "").trim() || "text";
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(
        <pre
          key={`code-${index}`}
          className="overflow-x-auto rounded-[1.75rem] bg-foreground px-5 py-4 text-sm text-white"
        >
          <code data-language={language}>{codeLines.join("\n")}</code>
        </pre>
      );

      index += 1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${index}`} className="font-display text-2xl font-semibold text-foreground">
          {renderInline(trimmed.slice(4), relatedTools)}
        </h3>
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${index}`} className="font-display text-3xl font-semibold text-foreground">
          {renderInline(trimmed.slice(3), relatedTools)}
        </h2>
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push(
        <h1 key={`h1-${index}`} className="font-display text-4xl font-semibold text-foreground">
          {renderInline(trimmed.slice(2), relatedTools)}
        </h1>
      );
      index += 1;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="rounded-[1.75rem] border-l-4 border-brand bg-brand/5 px-5 py-4 text-base leading-8 text-foreground/72"
        >
          {quoteLines.map((quoteLine, quoteIndex) => (
            <p key={`${quoteLine}-${quoteIndex}`}>{renderInline(quoteLine, relatedTools)}</p>
          ))}
        </blockquote>
      );

      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index].trim();
        if (!(current.startsWith("- ") || current.startsWith("* "))) {
          break;
        }
        items.push(current.slice(2));
        index += 1;
      }

      blocks.push(
        <ul key={`list-${index}`} className="space-y-3 pl-6 text-base leading-8 text-foreground/72">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`} className="list-disc">
              {renderInline(item, relatedTools)}
            </li>
          ))}
        </ul>
      );

      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && lines[index].trim()) {
      const current = lines[index].trim();
      if (
        current.startsWith("#") ||
        current.startsWith("> ") ||
        current.startsWith("- ") ||
        current.startsWith("* ") ||
        current.startsWith("```")
      ) {
        break;
      }
      paragraphLines.push(current);
      index += 1;
    }

    blocks.push(
      <p key={`paragraph-${index}`} className="text-base leading-8 text-foreground/72">
        {renderInline(paragraphLines.join(" "), relatedTools)}
      </p>
    );
  }

  return <div className="space-y-6">{blocks}</div>;
}
