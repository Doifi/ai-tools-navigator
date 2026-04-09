import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenText, Download, PlayCircle, Store, Wrench } from "lucide-react";

import { lobsterZone } from "@/lib/lobster";

const iconMap = {
  downloads: Download,
  "install-guide": Wrench,
  "usage-guide": PlayCircle
} as const;

/**
 * Home special section for Lobster resources.
 */
export function LobsterZoneSection() {
  return (
    <section className="surface-panel relative overflow-hidden bg-gradient-to-br from-accent-coral/14 via-white to-accent-gold/14 p-6 opacity-0 animate-fade-up sm:p-8 lg:p-10">
      <div className="hero-orb left-[-44px] top-6 h-28 w-28 bg-accent-coral/20" />
      <div className="hero-orb right-[-20px] bottom-6 h-32 w-32 bg-accent-gold/18" />

      <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="max-w-3xl">
          <p className="eyebrow">OpenClaw Hub</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {lobsterZone.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-foreground/72">{lobsterZone.subtitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/64">{lobsterZone.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {lobsterZone.heroBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-line/70 bg-white/80 px-4 py-2 text-sm font-medium text-foreground/70"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lobster"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-white transition hover:bg-foreground/92"
            >
              进入专区
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lobster#downloads"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line/70 bg-white/88 px-6 text-sm font-semibold text-foreground transition hover:border-accent-coral/35 hover:text-accent-coral"
            >
              查看官方入口
            </Link>
          </div>

          <div className="mt-7 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <a
              href={lobsterZone.skillsMarket.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[1.75rem] border border-brand/14 bg-gradient-to-br from-brand/10 via-white to-brand-soft/16 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-glow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-soft">
                  <Store className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-brand/14 bg-white/82 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  clawhub.ai
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/42">
                {lobsterZone.skillsMarket.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                {lobsterZone.skillsMarket.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-foreground/64">
                {lobsterZone.skillsMarket.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                {lobsterZone.skillsMarket.cta}
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </a>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {lobsterZone.quickFacts.slice(0, 2).map((fact) => (
                <a
                  key={fact.label}
                  href={fact.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.5rem] border border-line/70 bg-white/84 p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/28 hover:shadow-glow"
                >
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">{fact.value}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{fact.label}</p>
                  <p className="mt-2 text-xs leading-6 text-foreground/56">{fact.description}</p>
                </a>
              ))}
            </div>
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
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground/64">{card.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-coral">
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}

          <div className="rounded-[1.75rem] border border-line/70 bg-foreground px-5 py-6 text-white shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
              <BookOpenText className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold">官方资料映射</h3>
            <p className="mt-3 text-sm leading-7 text-white/74">
              专区内容现在按官方主页、官方文档、官方 FAQ 和官方 GitHub 仓库来整理，便于持续核对。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LobsterZoneSection;
