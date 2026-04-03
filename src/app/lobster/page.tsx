import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Download, PlayCircle, Wrench } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getLobsterDownloadHref, lobsterTutorialPosts, lobsterZone } from "@/lib/lobster";

export const metadata: Metadata = {
  title: "龙虾专区 | AI Tools Navigator",
  description: "集中查看龙虾安装包、安装教程和使用教程。"
};

const iconMap = {
  downloads: Download,
  "install-guide": Wrench,
  "usage-guide": PlayCircle
} as const;

export default function LobsterPage() {
  const hasDownloadUrl = Boolean(lobsterZone.package.downloadUrl);
  const downloadHref = getLobsterDownloadHref();

  return (
    <Container className="space-y-12 py-10 sm:space-y-14 sm:py-14">
      <section className="surface-panel relative overflow-hidden bg-gradient-to-br from-accent-coral/16 via-white to-accent-gold/14 p-6 sm:p-8 lg:p-10">
        <div className="hero-orb left-[-40px] top-8 h-28 w-28 bg-accent-coral/20" />
        <div className="hero-orb right-[-10px] top-4 h-36 w-36 bg-accent-gold/18" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">Lobster Resource Hub</p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              {lobsterZone.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-foreground/72">{lobsterZone.subtitle}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/64">{lobsterZone.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="new">龙虾安装包</Badge>
              <Badge tone="api">安装教程</Badge>
              <Badge tone="plugin">使用教程</Badge>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={downloadHref}
                target={hasDownloadUrl ? "_blank" : undefined}
                rel={hasDownloadUrl ? "noreferrer" : undefined}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92"
              >
                {hasDownloadUrl ? "立即下载安装包" : "查看安装包说明"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            <Link
              href={lobsterTutorialPosts.install.href}
              className="inline-flex h-12 items-center justify-center rounded-full border border-line/70 bg-white/90 px-6 text-sm font-semibold text-foreground transition hover:border-accent-coral/35 hover:text-accent-coral"
            >
              阅读安装教程
            </Link>
          </div>
        </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {lobsterZone.guideCards.map((card) => {
              const Icon = iconMap[card.id];

              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="rounded-[1.75rem] border border-white/60 bg-white/88 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/42">
                    {card.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-foreground">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-foreground/64">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="downloads" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel bg-gradient-to-br from-foreground to-brand p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/68">Package Center</p>
          <h2 className="mt-4 font-display text-3xl font-semibold">{lobsterZone.package.name}</h2>
          <p className="mt-4 text-sm leading-7 text-white/76">{lobsterZone.package.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="plugin" className="bg-white/12 text-white">
              {lobsterZone.package.platform}
            </Badge>
            <Badge tone="plugin" className="bg-white/12 text-white">
              {lobsterZone.package.version}
            </Badge>
            <Badge tone="plugin" className="bg-white/12 text-white">
              更新于 {lobsterZone.package.updatedAt}
            </Badge>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={downloadHref}
              target={hasDownloadUrl ? "_blank" : undefined}
              rel={hasDownloadUrl ? "noreferrer" : undefined}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-foreground transition hover:bg-white/92"
            >
              <Download className="h-4 w-4" />
              {hasDownloadUrl ? "下载安装包" : "当前先看安装教程"}
            </Link>
            <Link
              href="/lobster#usage-guide"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/18 px-6 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/8"
            >
              查看使用教程
            </Link>
          </div>
        </div>

        <Card className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-foreground">下载前准备</h2>
          <div className="space-y-3">
            {lobsterZone.package.notes.map((note, index) => (
              <div
                key={note}
                className="flex gap-4 rounded-[1.5rem] border border-line/70 bg-background/75 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-coral/12 text-accent-coral">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-foreground/68">{note}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="install-guide" className="space-y-6">
        <div>
          <p className="eyebrow">Install Guide</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            龙虾安装教程
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {lobsterZone.installSteps.map((step, index) => (
            <Card key={step} className="h-full space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                0{index + 1}
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground">步骤 {index + 1}</h3>
              <p className="text-sm leading-7 text-foreground/68">{step}</p>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/42">Article Link</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
              {lobsterTutorialPosts.install.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-foreground/64">
              完整版安装说明已经作为后台文章收录，可直接用于运营维护和后续补充。
            </p>
          </div>
          <Link
            href={lobsterTutorialPosts.install.href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92"
          >
            阅读全文
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>

      <section id="usage-guide" className="space-y-6">
        <div>
          <p className="eyebrow">Usage Guide</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            龙虾使用教程
          </h2>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {lobsterZone.usageModules.map((module) => (
            <Card key={module.title} className="space-y-5">
              <h3 className="font-display text-2xl font-semibold text-foreground">{module.title}</h3>
              <p className="text-sm leading-7 text-foreground/66">{module.description}</p>
              <div className="space-y-3">
                {module.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[1.25rem] border border-line/70 bg-background/75 px-4 py-3 text-sm text-foreground/68"
                  >
                    {bullet}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/42">Article Link</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
              {lobsterTutorialPosts.usage.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-foreground/64">
              完整版使用教程已经作为后台文章收录，可继续追加工作流、截图和问题排查。
            </p>
          </div>
          <Link
            href={lobsterTutorialPosts.usage.href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92"
          >
            阅读全文
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>
    </Container>
  );
}
