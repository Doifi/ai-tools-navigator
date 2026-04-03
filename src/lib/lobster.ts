export interface LobsterGuideCard {
  id: "downloads" | "install-guide" | "usage-guide";
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  cta: string;
}

export interface LobsterUsageModule {
  title: string;
  description: string;
  bullets: string[];
}

export const lobsterTutorialPosts = {
  install: {
    title: "OpenClaw（龙虾）安装教程：从下载安装到首次启动",
    slug: "lobster-install-guide",
    href: "/posts/lobster-install-guide"
  },
  usage: {
    title: "OpenClaw（龙虾）使用教程：基础设置、日常流程与常见问题",
    slug: "lobster-usage-guide",
    href: "/posts/lobster-usage-guide"
  }
} as const;

export const lobsterZone = {
  title: "OpenClaw（龙虾）专区",
  subtitle: "把 OpenClaw（龙虾）的安装包、安装教程和使用教程集中整理到一个入口。",
  description:
    "避免资料散落在聊天记录和网盘里，这里统一收纳 OpenClaw（龙虾）的下载入口、首次安装步骤和日常使用方法。",
  package: {
    name: "OpenClaw（龙虾）桌面端安装包",
    version: "最新版入口已预留",
    platform: "Windows / macOS",
    updatedAt: "2026-04-03",
    downloadUrl: "",
    description:
      "这里预留 OpenClaw（龙虾）安装包的统一下载入口。拿到正式下载地址后，只需补上链接即可直接对外使用。",
    notes: [
      "优先使用最新版安装包，避免旧版残留配置带来冲突。",
      "首次安装前建议先阅读下方安装教程，按步骤完成环境准备。",
      "如需补充历史版本、离线包说明，可继续通过后台文章管理维护。"
    ]
  },
  guideCards: [
    {
      id: "downloads",
      title: "OpenClaw 安装包",
      eyebrow: "Package Center",
      description: "集中查看安装包入口、版本说明和安装前准备项。",
      href: "/lobster#downloads",
      cta: "查看安装包"
    },
    {
      id: "install-guide",
      title: "安装教程",
      eyebrow: "Install Guide",
      description: "从下载到首次启动，按顺序梳理每一步该怎么做。",
      href: lobsterTutorialPosts.install.href,
      cta: "阅读安装教程"
    },
    {
      id: "usage-guide",
      title: "使用教程",
      eyebrow: "Usage Guide",
      description: "围绕常见工作流整理基础设置、操作方法和排查建议。",
      href: lobsterTutorialPosts.usage.href,
      cta: "阅读使用教程"
    }
  ] satisfies LobsterGuideCard[],
  installSteps: [
    "确认设备环境满足运行要求，优先使用干净的系统环境安装。",
    "下载 OpenClaw（龙虾）安装包后，按提示完成安装目录与基础组件配置。",
    "首次启动时完成必要的授权、网络设置和默认路径设置。",
    "进入主界面后先跑一次基础功能验证，确认安装结果正常。"
  ],
  usageModules: [
    {
      title: "首次启动与基础设置",
      description: "先把环境、目录和账户配置好，后续使用会稳定很多。",
      bullets: ["完成登录或授权", "检查默认保存路径", "确认网络与更新策略"]
    },
    {
      title: "日常使用流程",
      description: "建议把 OpenClaw（龙虾）放进固定工作流，而不是临时打开后再摸索。",
      bullets: ["先建立项目或任务模板", "按场景调用常用功能", "及时整理输出结果和历史记录"]
    },
    {
      title: "常见问题排查",
      description: "遇到安装失败、打不开或配置异常时，先排查最常见的几项。",
      bullets: ["检查旧版本残留", "确认系统权限和网络限制", "必要时重装并重新导入配置"]
    }
  ] satisfies LobsterUsageModule[]
} as const;

export function getLobsterDownloadHref() {
  return lobsterZone.package.downloadUrl || "/lobster#downloads";
}
