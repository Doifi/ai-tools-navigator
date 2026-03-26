"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const FAVORITES_STORAGE_KEY = "ai-tools-favorites";

interface ToolActionPanelProps {
  toolId: string;
  toolName: string;
  website: string;
}

/**
 * Handles visit, favorite, and share actions for the tool detail page.
 */
export function ToolActionPanel({ toolId, toolName, website }: ToolActionPanelProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [shareLabel, setShareLabel] = useState("分享");
  const [isTrackingClick, setIsTrackingClick] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      setIsFavorite(parsed.includes(toolId));
    } catch {
      setIsFavorite(false);
    }
  }, [toolId]);

  const toggleFavorite = () => {
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as string[]) : [];
      const next = parsed.includes(toolId)
        ? parsed.filter((item) => item !== toolId)
        : [...parsed, toolId];

      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      setIsFavorite(next.includes(toolId));
    } catch {
      setIsFavorite((value) => !value);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${toolName} - AI Tools Navigator`,
          url: shareUrl
        });
        setShareLabel("已分享");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareLabel("链接已复制");
      } else {
        setShareLabel("请手动复制");
      }
    } catch {
      setShareLabel("分享已取消");
    }

    window.setTimeout(() => setShareLabel("分享"), 1800);
  };

  const handleConfirmLeave = async () => {
    setIsTrackingClick(true);

    try {
      await fetch("/api/track/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ toolId })
      });
    } catch {
      // Ignore tracking failures and continue navigation.
    } finally {
      setIsTrackingClick(false);
      setIsConfirmOpen(false);
      window.open(website, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          size="lg"
          className="sm:flex-1"
          rightIcon={<ExternalLink className="h-4 w-4" />}
          onClick={() => setIsConfirmOpen(true)}
        >
          访问官网
        </Button>
        <Button
          type="button"
          size="lg"
          variant={isFavorite ? "secondary" : "outline"}
          leftIcon={
            <Heart
              className={cn("h-4 w-4 transition", isFavorite ? "fill-current text-white" : "text-foreground")}
            />
          }
          onClick={toggleFavorite}
        >
          {isFavorite ? "已收藏" : "收藏"}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          leftIcon={<Share2 className="h-4 w-4" />}
          onClick={handleShare}
        >
          {shareLabel}
        </Button>
      </div>

      {isConfirmOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/50 px-4">
          <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-glow">
            <p className="eyebrow">Leave Site</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">即将离开本站</h3>
            <p className="mt-4 text-sm leading-7 text-foreground/68">
              你将前往 {toolName} 官网。确认后会在新标签页打开，同时会记录一次官网点击。
            </p>

            <div className="mt-6 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsConfirmOpen(false)}>
                取消
              </Button>
              <Button type="button" className="flex-1" loading={isTrackingClick} onClick={handleConfirmLeave}>
                继续前往
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ToolActionPanel;
