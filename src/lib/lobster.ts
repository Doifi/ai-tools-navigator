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

export interface LobsterOfficialLink {
  label: string;
  href: string;
  description: string;
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
    name: "OpenClaw（龙虾）官方安装入口",
    version: "官方文档 / 脚本 / 源码",
    platform: "Windows / macOS",
    updatedAt: "2026-04-03",
    downloadUrl: "https://openclawdoc.com/docs/getting-started/installation/",
    description:
      "这里直接使用 OpenClaw 官方安装文档作为主入口，同时补充 Windows、Linux / macOS 脚本和官方 GitHub 仓库，避免站内再放失效占位链接。",
    notes: [
      "优先从官方文档进入安装流程，再根据系统选择 PowerShell 或 Shell 脚本。",
      "首次安装前建议先阅读下方站内安装教程，再对照官方文档执行。",
      "如果需要查看源码安装方式，可直接跳到官方 GitHub 仓库。"
    ]
  },
  officialLinks: [
    {
      label: "官方安装文档",
      href: "https://openclawdoc.com/docs/getting-started/installation/",
      description: "官方 Getting Started 安装页，包含脚本安装、npm 安装和源码安装。"
    },
    {
      label: "Windows 安装脚本",
      href: "https://openclaw.ai/install.ps1",
      description: "官方文档给出的 Windows PowerShell 一键安装脚本。"
    },
    {
      label: "Linux/macOS 安装脚本",
      href: "https://openclaw.ai/install.sh",
      description: "官方文档给出的 Shell 安装脚本，适用于 Linux 与 macOS。"
    },
    {
      label: "官方 GitHub 仓库",
      href: "https://github.com/openclaw/openclaw",
      description: "OpenClaw 官方源码仓库，可按官方文档走源码安装。"
    },
    {
      label: "官方配置文档",
      href: "https://openclawdoc.com/docs/getting-started/configuration/",
      description: "官方配置说明，包含 `openclaw.yaml`、模型与环境变量设置。"
    },
    {
      label: "官方首次使用文档",
      href: "https://openclawdoc.com/docs/getting-started/first-conversation/",
      description: "官方使用入门，包含启动、打开 Web UI、发送第一条消息与排查。"
    }
  ] satisfies LobsterOfficialLink[],
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
