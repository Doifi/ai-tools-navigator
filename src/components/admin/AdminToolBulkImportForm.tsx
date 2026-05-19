"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, FileJson, Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface AdminCategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ImportResult {
  index: number;
  name: string;
  slug: string;
  status: "inserted" | "skipped" | "error";
  message: string;
}

interface ImportResponse {
  summary: {
    total: number;
    inserted: number;
    skipped: number;
    errors: number;
  };
  results: ImportResult[];
}

interface AdminToolBulkImportFormProps {
  categories: AdminCategoryOption[];
}

function buildSampleJson(categorySlug: string) {
  return JSON.stringify(
    {
      tools: [
        {
          name: "Example AI Tool",
          slug: "example-ai-tool",
          websiteUrl: "https://example.com",
          logoUrl: "",
          description: "用于演示批量导入格式的 AI 工具条目。",
          detailedIntro: "这里可以填写更完整的工具介绍，导入后会显示在工具详情页。",
          categorySlug,
          priceModel: "freemium",
          apiAvailable: false,
          isSponsored: false,
          status: "published",
          tags: ["示例", "效率"],
          features: ["批量导入", "后台维护"]
        }
      ]
    },
    null,
    2
  );
}

/**
 * Admin JSON importer for adding many tools without one-by-one form entry.
 */
export function AdminToolBulkImportForm({ categories }: AdminToolBulkImportFormProps) {
  const router = useRouter();
  const sampleJson = useMemo(() => buildSampleJson(categories[0]?.slug ?? ""), [categories]);
  const [jsonText, setJsonText] = useState(sampleJson);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResult(null);

    try {
      const parsed = JSON.parse(jsonText);
      const response = await fetch("/api/admin/tools/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "批量导入失败");
      }

      setResult(payload);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "批量导入失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6 sm:p-8">
        <div className="border-b border-line/70 pb-5">
          <p className="eyebrow">Bulk Import</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">
            批量导入工具
          </h1>
          <p className="mt-3 text-sm leading-7 text-foreground/65">
            粘贴 JSON 后一次写入多个工具。系统会按 slug 跳过已有工具，不会覆盖现有数据。
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-foreground">导入 JSON</span>
            <textarea
              className="min-h-[520px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 font-mono text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10"
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              spellCheck={false}
            />
          </label>

          {error ? (
            <div className="rounded-[1.25rem] border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="rounded-[1.25rem] border border-success/20 bg-success/5 px-4 py-3 text-sm leading-7 text-success">
              共 {result.summary.total} 条，成功导入 {result.summary.inserted} 条，跳过{" "}
              {result.summary.skipped} 条，错误 {result.summary.errors} 条。
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              loading={isSubmitting}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              开始导入
            </Button>
            <Button
              type="button"
              variant="outline"
              leftIcon={<FileJson className="h-4 w-4" />}
              onClick={() => setJsonText(sampleJson)}
            >
              重置示例
            </Button>
            <Link
              href="/admin/tools"
              className="inline-flex h-11 items-center justify-center rounded-full border border-line/80 bg-white/90 px-5 text-sm font-semibold text-foreground transition hover:border-brand/35 hover:text-brand"
            >
              返回工具管理
            </Link>
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-white">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">字段说明</h2>
              <p className="mt-2 text-sm leading-7 text-foreground/64">
                `tools` 是数组。`name`、`websiteUrl`、`description` 必填；`slug` 不填时会尝试用英文名称自动生成。
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-foreground/66">
            <p>`categorySlug` 使用右侧分类 Slug，推荐使用它而不是手动复制分类 ID。</p>
            <p>`priceModel` 可选 `free`、`freemium`、`paid`。</p>
            <p>`status` 可选 `published`、`draft`、`archived`。</p>
            <p>`tags` 和 `features` 可以是字符串数组，也可以是逗号或换行分隔的字符串。</p>
            <p>单次最多 100 条。已有 slug 会跳过，避免误覆盖线上数据。</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">可用分类 Slug</h2>
          <div className="mt-5 grid gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-line/70 bg-background/80 px-4 py-3"
              >
                <p className="font-semibold text-foreground">{category.name}</p>
                <p className="mt-1 font-mono text-sm text-foreground/58">{category.slug}</p>
              </div>
            ))}
          </div>
        </Card>

        {result ? (
          <Card className="p-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">导入明细</h2>
            <div className="mt-5 max-h-[460px] space-y-3 overflow-auto pr-2">
              {result.results.map((item) => (
                <div
                  key={`${item.index}-${item.slug || item.name}`}
                  className="rounded-2xl border border-line/70 bg-background/80 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        #{item.index + 1} {item.name}
                      </p>
                      <p className="mt-1 font-mono text-xs text-foreground/52">
                        {item.slug || "no-slug"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "inserted"
                          ? "bg-success/10 text-success"
                          : item.status === "skipped"
                            ? "bg-brand/10 text-brand"
                            : "bg-warning/10 text-warning"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/62">{item.message}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

export default AdminToolBulkImportForm;
