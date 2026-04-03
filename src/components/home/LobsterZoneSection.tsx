import Link from "next/link";
import { ArrowRight, BookOpenText, Download, PlayCircle, Wrench } from "lucide-react";

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
          <p className="eyebrow">Lobster Zone</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {lobsterZone.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-foreground/72">{lobsterZone.subtitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/64">{lobsterZone.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {lobsterZone.guideCards.map((card) => (
              <span
                key={card.id}
                className="rounded-full border border-line/70 bg-white/80 px-4 py-2 text-sm font-medium text-foreground/70"
              >
                {card.title}
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
              查看安装包
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
            <h3 className="mt-4 font-display text-2xl font-semibold">一站式整理</h3>
            <p className="mt-3 text-sm leading-7 text-white/74">
              先把龙虾相关资源集中到专区，再逐步扩展成完整教程和专题内容。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LobsterZoneSection;
