import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Cable,
  CircleHelp,
  Download,
  PlayCircle,
  ServerCog,
  ShieldAlert,
  TerminalSquare,
  Wrench
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getLobsterDownloadHref, lobsterTutorialPosts, lobsterZone } from "@/lib/lobster";

export const metadata: Metadata = {
  title: "OpenClaw（龙虾）专区 | AI Tools Navigator",
  description: "基于 OpenClaw 官方主页、官方文档、官方 FAQ 与 GitHub 仓库整理的真实资料专区。"
};

const iconMap = {
  downloads: Download,
  "install-guide": Wrench,
  "usage-guide": PlayCircle
} as const;

const sectionIconMap = {
  config: ServerCog,
  firstConversation: TerminalSquare,
  channels: Cable,
  diagnostics: ShieldAlert,
  docs: BookOpenText
} as const;

function difficultyTone(value: "Easy" | "Medium" | "Hard") {
  switch (value) {
    case "Easy":
      return "free" as const;
    case "Medium":
      return "plugin" as const;
    case "Hard":
      return "paid" as const;
    default:
      return "plugin" as const;
  }
}

export default function LobsterPage() {
  const hasDownloadUrl = Boolean(lobsterZone.package.downloadUrl);
  const downloadHref = getLobsterDownloadHref();
  const ConfigIcon = sectionIconMap.config;
  const FirstConversationIcon = sectionIconMap.firstConversation;
  const ChannelsIcon = sectionIconMap.channels;
  const DiagnosticsIcon = sectionIconMap.diagnostics;
  const DocsIcon = sectionIconMap.docs;

  return (
    <Container className="space-y-12 py-10 sm:space-y-14 sm:py-14">
      <section className="surface-panel relative overflow-hidden bg-gradient-to-br from-accent-coral/16 via-white to-accent-gold/14 p-6 sm:p-8 lg:p-10">
        <div className="hero-orb left-[-40px] top-8 h-28 w-28 bg-accent-coral/20" />
        <div className="hero-orb right-[-10px] top-4 h-36 w-36 bg-accent-gold/18" />

        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">OpenClaw Official Hub</p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              {lobsterZone.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-foreground/72">{lobsterZone.subtitle}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/64">{lobsterZone.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {lobsterZone.heroBadges.map((badge) => (
                <Badge key={badge} tone="plugin">
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-line/70 bg-white/82 px-5 py-4 text-sm leading-7 text-foreground/66">
              {lobsterZone.verificationNote}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={downloadHref}
                target={hasDownloadUrl ? "_blank" : undefined}
                rel={hasDownloadUrl ? "noreferrer" : undefined}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92"
              >
                查看官方安装文档
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={lobsterTutorialPosts.usage.href}
                className="inline-flex h-12 items-center justify-center rounded-full border border-line/70 bg-white/90 px-6 text-sm font-semibold text-foreground transition hover:border-accent-coral/35 hover:text-accent-coral"
              >
                阅读使用指南
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

      <section className="space-y-6">
        <div>
          <p className="eyebrow">Official Positioning</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            OpenClaw 现在到底是什么
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {lobsterZone.quickFacts.map((fact) => (
            <Card key={fact.label} className="space-y-4">
              <p className="font-display text-4xl font-semibold text-foreground">{fact.value}</p>
              <h3 className="font-display text-2xl font-semibold text-foreground">{fact.label}</h3>
              <p className="text-sm leading-7 text-foreground/66">{fact.description}</p>
              <Link
                href={fact.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
              >
                查看官方来源
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section id="downloads" className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="surface-panel bg-gradient-to-br from-foreground to-brand p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/68">Official Entry</p>
          <h2 className="mt-4 font-display text-3xl font-semibold">{lobsterZone.package.name}</h2>
          <p className="mt-4 text-sm leading-7 text-white/76">{lobsterZone.package.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="plugin" className="bg-white/12 text-white">
              {lobsterZone.package.platform}
            </Badge>
            <Badge tone="plugin" className="bg-white/12 text-white">
              {lobsterZone.package.delivery}
            </Badge>
            <Badge tone="plugin" className="bg-white/12 text-white">
              已核对 {lobsterZone.package.verifiedAt}
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
              打开官方安装页
            </Link>
            <Link
              href={lobsterTutorialPosts.install.href}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/18 px-6 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/8"
            >
              看站内安装指南
            </Link>
          </div>
        </div>

        <Card className="space-y-4">
          <h2 className="font-display text-3xl font-semibold text-foreground">安装前先核对</h2>
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

      <section className="space-y-6">
        <div>
          <p className="eyebrow">System Requirements</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            官方系统要求
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {lobsterZone.requirements.map((requirement) => (
            <Card key={requirement.label} className="space-y-4">
              <h3 className="font-display text-2xl font-semibold text-foreground">{requirement.label}</h3>
              <div className="space-y-3 text-sm leading-7 text-foreground/66">
                <p>
                  <span className="font-semibold text-foreground">最低：</span>
                  {requirement.minimum}
                </p>
                <p>
                  <span className="font-semibold text-foreground">推荐：</span>
                  {requirement.recommended}
                </p>
                <p>{requirement.description}</p>
              </div>
              <Link
                href={requirement.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
              >
                查看官方要求
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section id="install-guide" className="space-y-6">
        <div>
          <p className="eyebrow">Install Methods</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            官方安装方式
          </h2>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {lobsterZone.installMethods.map((method) => (
            <Card key={method.title} className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="api">{method.platform}</Badge>
                <h3 className="font-display text-2xl font-semibold text-foreground">{method.title}</h3>
              </div>
              <p className="text-sm leading-7 text-foreground/66">{method.description}</p>
              <pre className="overflow-x-auto rounded-[1.5rem] bg-foreground px-5 py-4 text-sm leading-7 text-white">
                <code>{method.command}</code>
              </pre>
              <div className="space-y-2">
                {method.notes.map((note) => (
                  <div
                    key={note}
                    className="rounded-[1.25rem] border border-line/70 bg-background/75 px-4 py-3 text-sm text-foreground/68"
                  >
                    {note}
                  </div>
                ))}
              </div>
              <Link
                href={method.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
              >
                对照官方文档
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <ConfigIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Configuration</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">配置要点</h2>
            </div>
          </div>

          <div className="space-y-5">
            {lobsterZone.configModules.map((module) => (
              <Card key={module.title} className="space-y-4">
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
                <Link
                  href={module.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
                >
                  查看官方配置文档
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-coral/10 text-accent-coral">
              <FirstConversationIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">First Conversation</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">首次启动与首聊</h2>
            </div>
          </div>

          <div className="space-y-5">
            {lobsterZone.firstConversationModules.map((module) => (
              <Card key={module.title} className="space-y-4">
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
                <Link
                  href={module.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
                >
                  查看官方步骤
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <ChannelsIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Channels</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">频道与接入难度</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {lobsterZone.channelHighlights.map((channel) => (
              <Card key={channel.name} className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold text-foreground">{channel.name}</h3>
                  <Badge tone={difficultyTone(channel.difficulty)}>{channel.difficulty}</Badge>
                </div>
                <p className="text-sm leading-7 text-foreground/66">{channel.description}</p>
                <Link
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
                >
                  查看 Channels Overview
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-coral/10 text-accent-coral">
              <DiagnosticsIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Diagnostics</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">排障与健康检查</h2>
            </div>
          </div>

          <div className="space-y-5">
            {lobsterZone.diagnostics.map((module) => (
              <Card key={module.title} className="space-y-4">
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
                <Link
                  href={module.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
                >
                  查看官方排障文档
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <DocsIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="eyebrow">Official Sources</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              官方资料地图
            </h2>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {lobsterZone.officialLinkGroups.map((group) => (
            <Card key={group.title} className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground">{group.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/66">{group.description}</p>
              </div>
              <div className="space-y-4">
                {group.links.map((linkItem) => (
                  <div key={linkItem.href} className="rounded-[1.25rem] border border-line/70 bg-background/75 p-4">
                    <p className="font-semibold text-foreground">{linkItem.label}</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/62">{linkItem.description}</p>
                    <Link
                      href={linkItem.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
                    >
                      打开原始来源
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="usage-guide" className="space-y-6">
        <div>
          <p className="eyebrow">Article Links</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            站内教程文章
          </h2>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {[
            {
              title: lobsterTutorialPosts.install.title,
              href: lobsterTutorialPosts.install.href,
              description: "把官方 requirements、installation、verification 和 common issues 汇总成中文文章。"
            },
            {
              title: lobsterTutorialPosts.usage.title,
              href: lobsterTutorialPosts.usage.href,
              description: "把官方 configuration、first conversation、channels、FAQ 和 commands 汇总成中文文章。"
            }
          ].map((article) => (
            <Card key={article.href} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground">{article.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/64">{article.description}</p>
              </div>
              <Link
                href={article.href}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92"
              >
                阅读全文
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>

        <Card className="rounded-[1.75rem] border border-line/70 bg-background/75 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-coral/12 text-accent-coral">
              <CircleHelp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground">维护原则</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/66">
                这个专区后续只补两类内容：一类是官方来源的新链接，另一类是基于官方来源整理出来的中文索引与中文教程。没有官方出处的内容，不再放进专区主页面。
              </p>
            </div>
          </div>
        </Card>
      </section>
    </Container>
  );
}
