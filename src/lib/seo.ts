import type { Metadata } from "next";

export const SITE_NAME = "AI Tools Navigator";
export const SITE_TITLE = "AI Tools Navigator - AI 工具导航与 OpenClaw 教程";
export const SITE_DESCRIPTION =
  "精选国内外 AI 工具、AI 工具教程、OpenClaw（龙虾）专区和真实可访问的官网入口，帮助你快速发现适合工作流的 AI 产品。";
export const SITE_KEYWORDS = [
  "AI 工具导航",
  "AI 导航站",
  "AI 工具",
  "国内 AI 工具",
  "国外 AI 工具",
  "OpenClaw",
  "龙虾",
  "AI 教程",
  "AI 办公",
  "AI 编程"
];

const DEFAULT_SITE_URL = "https://aiworknav.cn";

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || DEFAULT_SITE_URL;
  const withProtocol = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : `https://${rawUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function stringifyJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function createSiteJsonLd() {
  const siteUrl = getSiteUrl();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: SITE_NAME,
      alternateName: ["AI 工具导航", "AI导航网站", "AI Tools Navigator"],
      url: siteUrl,
      description: SITE_DESCRIPTION,
      inLanguage: "zh-CN",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/tools?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE_NAME,
      url: siteUrl,
      logo: absoluteUrl("/icon.svg"),
      description: SITE_DESCRIPTION
    }
  ];
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string | null;
}): Metadata {
  const canonical = absoluteUrl(path);
  const metadataTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: {
      absolute: metadataTitle
    },
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: {
      canonical
    },
    openGraph: {
      title: metadataTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: "zh_CN",
      images: image ? [{ url: image, alt: title }] : undefined
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: metadataTitle,
      description,
      images: image ? [image] : undefined
    }
  };
}
