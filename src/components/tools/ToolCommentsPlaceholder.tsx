import { MessageSquareDashed } from "lucide-react";

import { Card } from "@/components/ui/Card";

/**
 * 评论区占位组件，预留后续评论系统接入。
 */
export function ToolCommentsPlaceholder() {
  return (
    <section>
      <Card className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background text-brand">
          <MessageSquareDashed className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-foreground">评论区开发中</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-foreground/64">
          这里后续可以接入评论、点赞、用户评分与提问反馈，当前先保留界面占位。
        </p>
      </Card>
    </section>
  );
}

export default ToolCommentsPlaceholder;
