"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Mail,
  RefreshCcw,
  ShieldCheck
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getIcon } from "@/lib/mock/icon-map";
import { cn } from "@/lib/utils";

const DRAFT_STORAGE_KEY = "submit-tool-draft-v2";

const submitToolSchema = z.object({
  toolName: z.string().trim().min(2, "工具名称至少 2 个字符").max(50, "工具名称不能超过 50 个字符"),
  websiteUrl: z.string().trim().url("请输入合法的官网 URL"),
  logoUrl: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || z.string().url().safeParse(value).success, "请输入合法的 Logo URL"),
  description: z.string().trim().min(10, "简短描述至少 10 个字符").max(200, "简短描述不能超过 200 个字符"),
  categoryId: z
    .string()
    .trim()
    .min(1, "请选择分类")
    .refine((value) => z.string().uuid().safeParse(value).success, "分类 ID 格式不正确"),
  priceModel: z.enum(["free", "freemium", "paid"]),
  apiAvailable: z.boolean(),
  submitterEmail: z.string().trim().email("请输入合法的邮箱地址"),
  captchaAnswer: z.string().trim().min(1, "请输入验证码答案")
});

type SubmitToolFormValues = z.infer<typeof submitToolSchema>;
type SubmitStep = 1 | 2 | 3;

type CategoryOption = {
  id: string;
  name: string;
  icon: string | null;
  toolCount?: number;
};

type CaptchaPayload = {
  id: string;
  question: string;
};

type SubmitSuccessPayload = {
  success: true;
  message: string;
  submissionId: string;
};

const defaultValues: SubmitToolFormValues = {
  toolName: "",
  websiteUrl: "",
  logoUrl: "",
  description: "",
  categoryId: "",
  priceModel: "freemium",
  apiAvailable: false,
  submitterEmail: "",
  captchaAnswer: ""
};

const priceOptions: Array<{
  value: SubmitToolFormValues["priceModel"];
  label: string;
  description: string;
}> = [
  {
    value: "free",
    label: "免费",
    description: "适合完全开放使用、无需付费即可体验核心功能的工具。"
  },
  {
    value: "freemium",
    label: "免费试用",
    description: "适合有免费额度、试用方案或部分功能可免费体验的工具。"
  },
  {
    value: "paid",
    label: "付费",
    description: "适合订阅制、按次付费或面向企业收费的工具。"
  }
];

const steps: Array<{
  id: SubmitStep;
  title: string;
  description: string;
}> = [
  { id: 1, title: "填写信息", description: "录入工具资料并完成校验" },
  { id: 2, title: "预览", description: "确认展示内容后再提交" },
  { id: 3, title: "提交完成", description: "等待后续审核结果" }
];

function getPriceLabel(priceModel: SubmitToolFormValues["priceModel"]) {
  switch (priceModel) {
    case "free":
      return "免费";
    case "freemium":
      return "免费试用";
    case "paid":
      return "付费";
    default:
      return priceModel;
  }
}

function getResponseErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: unknown }).error;

    if (typeof error === "string" && error.trim().length > 0) {
      return error;
    }
  }

  return fallback;
}

function StepIndicator({ currentStep }: { currentStep: SubmitStep }) {
  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-[1.5rem] border p-4 transition",
                isActive
                  ? "border-brand/30 bg-brand/10 shadow-soft"
                  : isCompleted
                    ? "border-accent-mint/30 bg-accent-mint/10"
                    : "border-line/70 bg-white/80"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                    isCompleted
                      ? "bg-accent-mint text-white"
                      : isActive
                        ? "bg-foreground text-white"
                        : "bg-background text-foreground/60"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : `0${step.id}`}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-foreground/56">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubmitTips({
  categoriesError,
  captchaError,
  onReloadCategories,
  onReloadCaptcha
}: {
  categoriesError: string | null;
  captchaError: string | null;
  onReloadCategories: () => void;
  onReloadCaptcha: () => void;
}) {
  return (
    <div className="space-y-4 xl:sticky xl:top-24">
      <Card className="overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-coral/14">
        <p className="eyebrow">填写提示</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">提交前先把信息写准</h2>
        <p className="mt-4 text-sm leading-7 text-foreground/68">
          名称、官网、分类和简短描述会直接影响后续展示质量。描述建议聚焦“解决什么问题”和“适合谁使用”。
        </p>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">分类和收费模式要准确</p>
            <p className="mt-2 text-sm leading-7 text-foreground/64">
              这两个字段会直接影响后续筛选和卡片展示，不建议用泛化描述代替真实定位。
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/15 text-accent-gold">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">草稿会自动保存在本地</p>
            <p className="mt-2 text-sm leading-7 text-foreground/64">页面刷新后仍可恢复已填写内容，避免中途丢失。</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-coral/12 text-accent-coral">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">邮箱用于审核反馈</p>
            <p className="mt-2 text-sm leading-7 text-foreground/64">
              当前版本还没有接邮件通知，但字段已经按真实提交流程保留。
            </p>
          </div>
        </div>
      </Card>

      {categoriesError ? (
        <Card className="border-warning/30 bg-warning/5">
          <p className="text-sm font-semibold text-warning">分类加载失败</p>
          <p className="mt-2 text-sm leading-7 text-foreground/68">{categoriesError}</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<RefreshCcw className="h-4 w-4" />}
            className="mt-4"
            onClick={onReloadCategories}
          >
            重新加载分类
          </Button>
        </Card>
      ) : null}

      {captchaError ? (
        <Card className="border-warning/30 bg-warning/5">
          <p className="text-sm font-semibold text-warning">验证码加载失败</p>
          <p className="mt-2 text-sm leading-7 text-foreground/68">{captchaError}</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<RefreshCcw className="h-4 w-4" />}
            className="mt-4"
            onClick={onReloadCaptcha}
          >
            重新获取验证码
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

function ToolPreviewCard({
  values,
  category
}: {
  values: SubmitToolFormValues;
  category?: CategoryOption;
}) {
  const Icon = getIcon((category?.icon ?? "Sparkles") as Parameters<typeof getIcon>[0]);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white via-white to-background p-0">
      <div className="border-b border-line/70 bg-gradient-to-r from-brand/10 via-white to-accent-coral/10 p-5 sm:p-6">
        <p className="eyebrow">Preview</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">提交预览</h2>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand/15 via-white to-accent-coral/15 text-brand shadow-soft">
            {values.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.logoUrl} alt={values.toolName || "工具 Logo"} className="h-full w-full object-cover" />
            ) : (
              <Icon className="h-8 w-8" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-3xl font-semibold text-foreground">
              {values.toolName || "工具名称预览"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-foreground/68">
              {values.description || "这里会展示工具简介，帮助你在提交前确认最终卡片的展示效果。"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone={values.priceModel === "paid" ? "paid" : "free"}>{getPriceLabel(values.priceModel)}</Badge>
          {values.apiAvailable ? <Badge tone="api">API</Badge> : null}
          {category ? <Badge tone="plugin">{category.name}</Badge> : null}
          <Badge tone="new">待审核</Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-line/70 bg-background/85 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">官网链接</p>
            <p className="mt-3 break-all text-sm font-medium text-brand">
              {values.websiteUrl || "https://example.com"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-line/70 bg-background/85 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">联系人邮箱</p>
            <p className="mt-3 text-sm font-medium text-foreground">
              {values.submitterEmail || "name@example.com"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SuccessState({
  submissionId,
  onReset
}: {
  submissionId: string | null;
  onReset: () => void;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="overflow-hidden bg-gradient-to-br from-accent-mint/16 via-white to-brand/12 p-8 sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-mint text-white shadow-soft">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="eyebrow mt-6">Submitted</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
          提交成功
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70">
          记录已经写入 tool_submissions，当前状态为待审核。后续可以继续接入后台审核、邮件通知和状态查询。
        </p>

        {submissionId ? (
          <div className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-soft">
            Submission ID: {submissionId}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg">
            查看提交状态
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={onReset}>
            再提交一个
          </Button>
        </div>
      </Card>

      <Card>
        <p className="eyebrow">Next Step</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">后续可以继续接的能力</h2>

        <div className="mt-6 space-y-4">
          {[
            "管理后台审核列表与审核备注。",
            "提交状态详情页与邮件通知。",
            "去重检查，避免重复提交相同官网。",
            "审核通过后自动生成工具详情页草稿。"
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[1.5rem] border border-line/70 bg-background/85 p-4"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-sm leading-7 text-foreground/68">{item}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

export default function SubmitPage() {
  const [step, setStep] = useState<SubmitStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [draftReady, setDraftReady] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [captcha, setCaptcha] = useState<CaptchaPayload | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const form = useForm<SubmitToolFormValues>({
    resolver: zodResolver(submitToolSchema),
    mode: "onChange",
    defaultValues
  });

  const watchedValues = form.watch();
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === watchedValues.categoryId),
    [categories, watchedValues.categoryId]
  );

  const loadCategories = async () => {
    try {
      setCategoriesError(null);

      const response = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store"
      });
      const payload = (await response.json()) as {
        categories?: CategoryOption[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(getResponseErrorMessage(payload, "分类加载失败"));
      }

      setCategories(payload.categories ?? []);
    } catch (error) {
      setCategories([]);
      setCategoriesError(error instanceof Error ? error.message : "分类加载失败");
    }
  };

  const loadCaptcha = async () => {
    try {
      setCaptchaError(null);

      const response = await fetch("/api/captcha", {
        method: "GET",
        cache: "no-store"
      });
      const payload = (await response.json()) as CaptchaPayload & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(getResponseErrorMessage(payload, "验证码加载失败"));
      }

      setCaptcha({
        id: payload.id,
        question: payload.question
      });
      form.setValue("captchaAnswer", "");
    } catch (error) {
      setCaptcha(null);
      setCaptchaError(error instanceof Error ? error.message : "验证码加载失败");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const storedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);

        if (storedDraft) {
          const parsedDraft = JSON.parse(storedDraft) as Partial<SubmitToolFormValues>;
          form.reset({
            ...defaultValues,
            ...parsedDraft
          });
        }
      } catch {
        // Ignore malformed draft data.
      }

      await Promise.allSettled([loadCategories(), loadCaptcha()]);

      if (!cancelled) {
        setIsBootstrapping(false);
        setDraftReady(true);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [form]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(watchedValues));
    } catch {
      // Ignore storage write failures.
    }
  }, [draftReady, watchedValues]);

  const handlePreview = form.handleSubmit(() => {
    setSubmitError(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handleSubmitForm = async () => {
    setSubmitError(null);

    const isValid = await form.trigger();

    if (!isValid) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!captcha) {
      setSubmitError("验证码尚未就绪，请重新获取后再提交。");
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const captchaResponse = await fetch("/api/captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: captcha.id,
          answer: watchedValues.captchaAnswer
        })
      });

      const captchaPayload = (await captchaResponse.json()) as {
        valid?: boolean;
        error?: string;
      };

      if (!captchaResponse.ok || !captchaPayload.valid) {
        const message = getResponseErrorMessage(captchaPayload, "验证码校验失败");
        form.setError("captchaAnswer", { type: "server", message });
        setStep(1);
        await loadCaptcha();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const submitResponse = await fetch("/api/submit-tool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toolName: watchedValues.toolName,
          websiteUrl: watchedValues.websiteUrl,
          logoUrl: watchedValues.logoUrl || undefined,
          description: watchedValues.description,
          categoryId: watchedValues.categoryId,
          priceModel: watchedValues.priceModel,
          apiAvailable: watchedValues.apiAvailable,
          submitterEmail: watchedValues.submitterEmail
        })
      });

      const submitPayload = (await submitResponse.json()) as SubmitSuccessPayload & {
        error?: string;
      };

      if (!submitResponse.ok) {
        throw new Error(getResponseErrorMessage(submitPayload, "提交失败，请稍后重试"));
      }

      setSubmissionId(submitPayload.submissionId);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore storage cleanup failures.
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "提交失败，请稍后重试");
      await loadCaptcha();
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    form.reset(defaultValues);
    setStep(1);
    setSubmitError(null);
    setSubmissionId(null);

    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup failures.
    }

    await loadCaptcha();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const textareaClassName = cn(
    "min-h-[140px] w-full rounded-2xl border border-line/80 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand/45 focus:ring-4 focus:ring-brand/10",
    form.formState.errors.description && "border-warning/45 focus:border-warning/55 focus:ring-warning/10"
  );

  return (
    <Container className="space-y-8 py-10 sm:space-y-10 sm:py-14">
      <section className="surface-panel overflow-hidden bg-gradient-to-br from-brand/12 via-white to-accent-coral/14 p-6 sm:p-8">
        <p className="eyebrow">Submit Tool</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-foreground sm:text-5xl">
          提交你的 AI 工具
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/70">
          当前页面已经切到真实 API 流程：分类从接口加载，验证码由服务端生成并校验，提交后会写入
          tool_submissions。
        </p>
      </section>

      <StepIndicator currentStep={step} />

      {step === 3 ? (
        <SuccessState submissionId={submissionId} onReset={() => void handleReset()} />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            {step === 1 ? (
              <Card className="p-6 sm:p-8">
                <div className="mb-6">
                  <p className="eyebrow">Step 1</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">填写工具信息</h2>
                </div>

                <form className="space-y-5" onSubmit={handlePreview}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      id="toolName"
                      label="工具名称"
                      placeholder="例如：ChatGPT"
                      error={form.formState.errors.toolName?.message}
                      {...form.register("toolName")}
                    />
                    <Input
                      id="websiteUrl"
                      label="官网 URL"
                      type="url"
                      placeholder="https://example.com"
                      error={form.formState.errors.websiteUrl?.message}
                      {...form.register("websiteUrl")}
                    />
                  </div>

                  <Input
                    id="logoUrl"
                    label="Logo URL"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    hint="可选。不填写时，预览会使用分类图标作为占位。"
                    error={form.formState.errors.logoUrl?.message}
                    {...form.register("logoUrl")}
                  />

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-foreground/80">
                      简短描述
                    </label>
                    <textarea
                      id="description"
                      className={textareaClassName}
                      placeholder="用 1-2 句话说明这个工具解决什么问题、适合谁使用。"
                      {...form.register("description")}
                    />
                    {form.formState.errors.description?.message ? (
                      <p className="text-sm text-warning">{form.formState.errors.description.message}</p>
                    ) : (
                      <p className="text-sm text-foreground/55">建议聚焦核心价值，而不是平铺所有功能点。</p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="categoryId" className="block text-sm font-medium text-foreground/80">
                        分类
                      </label>
                      <select
                        id="categoryId"
                        className={cn(
                          "h-12 w-full rounded-2xl border border-line/80 bg-white/90 px-4 text-sm text-foreground outline-none transition focus:border-brand/45 focus:ring-4 focus:ring-brand/10",
                          form.formState.errors.categoryId &&
                            "border-warning/45 focus:border-warning/55 focus:ring-warning/10"
                        )}
                        disabled={isBootstrapping || categories.length === 0}
                        {...form.register("categoryId")}
                      >
                        <option value="">请选择分类</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {form.formState.errors.categoryId?.message ? (
                        <p className="text-sm text-warning">{form.formState.errors.categoryId.message}</p>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <p className="block text-sm font-medium text-foreground/80">收费模式</p>
                      <div className="grid gap-3">
                        {priceOptions.map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-line/70 bg-white/90 p-4 transition hover:border-brand/25",
                              watchedValues.priceModel === option.value && "border-brand/35 bg-brand/5"
                            )}
                          >
                            <input
                              type="radio"
                              value={option.value}
                              className="mt-1 h-4 w-4 border-line text-brand focus:ring-brand"
                              {...form.register("priceModel")}
                            />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{option.label}</p>
                              <p className="mt-1 text-sm text-foreground/58">{option.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-line/70 bg-white/90 p-4">
                    <Controller
                      control={form.control}
                      name="apiAvailable"
                      render={({ field }) => (
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">是否有 API</p>
                            <p className="mt-1 text-sm text-foreground/58">
                              如果工具支持 API，后续更适合做自动化集成和开发者推荐。
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={field.value}
                            onClick={() => field.onChange(!field.value)}
                            className={cn(
                              "relative inline-flex h-8 w-14 items-center rounded-full transition",
                              field.value ? "bg-brand" : "bg-line"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-6 w-6 rounded-full bg-white shadow-soft transition",
                                field.value ? "translate-x-7" : "translate-x-1"
                              )}
                            />
                          </button>
                        </div>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      id="submitterEmail"
                      label="联系人邮箱"
                      type="email"
                      placeholder="name@example.com"
                      error={form.formState.errors.submitterEmail?.message}
                      {...form.register("submitterEmail")}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="captchaAnswer" className="block text-sm font-medium text-foreground/80">
                          验证码：{captcha?.question ?? "加载中..."}
                        </label>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-strong"
                          onClick={() => void loadCaptcha()}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                          刷新
                        </button>
                      </div>
                      <Input
                        id="captchaAnswer"
                        inputMode="numeric"
                        placeholder="请输入结果"
                        error={form.formState.errors.captchaAnswer?.message}
                        disabled={!captcha}
                        {...form.register("captchaAnswer")}
                      />
                    </div>
                  </div>

                  {submitError ? (
                    <div className="rounded-[1.25rem] border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
                      {submitError}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                    className="w-full sm:w-auto"
                    disabled={isBootstrapping}
                  >
                    下一步：预览
                  </Button>
                </form>
              </Card>
            ) : (
              <div className="space-y-6">
                <ToolPreviewCard values={watchedValues} category={selectedCategory} />

                <Card className="p-5 sm:p-6">
                  <p className="eyebrow">Step 2</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">确认并提交</h2>
                  <p className="mt-4 text-sm leading-7 text-foreground/66">
                    提交时会先调用验证码校验接口，再把表单写入 tool_submissions。失败时会回到填写步骤并给出明确错误。
                  </p>

                  {submitError ? (
                    <div className="mt-5 rounded-[1.25rem] border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
                      {submitError}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      leftIcon={<ChevronLeft className="h-4 w-4" />}
                      onClick={() => setStep(1)}
                    >
                      返回修改
                    </Button>
                    <Button type="button" size="lg" loading={isSubmitting} onClick={() => void handleSubmitForm()}>
                      {isSubmitting ? "提交中..." : "确认提交"}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <SubmitTips
                categoriesError={categoriesError}
                captchaError={captchaError}
                onReloadCategories={() => void loadCategories()}
                onReloadCaptcha={() => void loadCaptcha()}
              />
            ) : (
              <div className="space-y-6 xl:sticky xl:top-24">
                <ToolPreviewCard values={watchedValues} category={selectedCategory} />

                <Card>
                  <p className="eyebrow">Preview Notes</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">提交前再检查这几项</h3>

                  <div className="mt-5 space-y-4">
                    {[
                      `分类：${selectedCategory?.name ?? "尚未选择"}`,
                      `收费模式：${getPriceLabel(watchedValues.priceModel)}`,
                      `API：${watchedValues.apiAvailable ? "有" : "无"}`,
                      "官网链接是否能正常访问。"
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-[1.25rem] bg-background/85 p-4"
                      >
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-brand">
                          <Check className="h-4 w-4" />
                        </div>
                        <p className="text-sm leading-7 text-foreground/68">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      )}
    </Container>
  );
}
