export interface LobsterGuideCard {
  id: "downloads" | "install-guide" | "usage-guide";
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  cta: string;
}

export interface LobsterExternalCard {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  cta: string;
}

export interface LobsterOfficialLink {
  label: string;
  href: string;
  description: string;
}

export interface LobsterQuickFact {
  value: string;
  label: string;
  description: string;
  href: string;
}

export interface LobsterRequirement {
  label: string;
  minimum: string;
  recommended: string;
  description: string;
  href: string;
}

export interface LobsterInstallMethod {
  title: string;
  platform: string;
  description: string;
  command: string;
  href: string;
  notes: string[];
}

export interface LobsterGuideModule {
  title: string;
  description: string;
  bullets: string[];
  href: string;
}

export interface LobsterChannelHighlight {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  href: string;
}

export interface LobsterLinkGroup {
  title: string;
  description: string;
  links: LobsterOfficialLink[];
}

export const lobsterTutorialPosts = {
  install: {
    title: "OpenClaw（龙虾）安装指南：系统要求、安装方式与验证",
    slug: "lobster-install-guide",
    href: "/posts/lobster-install-guide"
  },
  usage: {
    title: "OpenClaw（龙虾）使用指南：配置、首聊、频道与排障",
    slug: "lobster-usage-guide",
    href: "/posts/lobster-usage-guide"
  }
} as const;

export const lobsterZone = {
  title: "OpenClaw（龙虾）专区",
  subtitle: "把 OpenClaw 的官方主页、系统要求、安装方式、配置方法、首轮使用、频道文档和 FAQ 集中到一个真实入口。",
  description:
    "本专区全部内容都以 OpenClaw 官方主页、官方 Getting Started、官方 Channels 文档、官方 Commands 文档、官方 FAQ 和官方 GitHub 仓库为准，避免继续使用泛化介绍或失效占位链接。",
  skillsMarket: {
    title: "Skills市场",
    eyebrow: "Skills Market",
    description: "直达 ClawHub 官方技能市场，查看 OpenClaw 公开技能生态与上架内容。",
    href: "https://clawhub.ai/",
    cta: "打开 Skills 市场"
  } satisfies LobsterExternalCard,
  verificationNote:
    "当前页面内容已于 2026-04-09 对照官方公开文档和官方仓库核对，可继续点击各来源链接追溯原始说明。",
  heroBadges: ["官方主页", "系统要求", "安装 / 配置", "首聊 / 频道 / FAQ"],
  package: {
    name: "OpenClaw 官方安装入口",
    delivery: "脚本 / npm / 源码",
    platform: "Linux / macOS / Windows（PowerShell / WSL 2）",
    verifiedAt: "2026-04-09",
    downloadUrl: "https://openclawdoc.com/docs/getting-started/installation/",
    description:
      "官方 Installation 文档已经覆盖 Quick install、npm 安装和源码安装三条路径；首页还提供 Linux/macOS 脚本、Windows PowerShell 脚本和 npm 一行命令。",
    notes: [
      "先读 System Requirements，再选择脚本安装、npm 安装或源码安装。",
      "Windows 官方建议优先使用 WSL 2 + Ubuntu，或直接在 PowerShell 里运行安装脚本。",
      "安装完成后，用 openclaw --version、openclaw doctor、openclaw status、openclaw dashboard 做验证。"
    ]
  },
  quickFacts: [
    {
      value: "50+",
      label: "官方支持渠道",
      description: "官方主页和 What is OpenClaw 文档都强调它可以覆盖 50+ communication channels。",
      href: "https://openclawdoc.com/"
    },
    {
      value: "5700+",
      label: "内置技能规模",
      description: "官方主页和 What is OpenClaw 文档都把 ClawHub 技能规模写成 5,700+。",
      href: "https://openclawdoc.com/docs/getting-started/what-is-openclaw/"
    },
    {
      value: "Any Model",
      label: "模型无锁",
      description: "官方主页与配置文档明确支持 OpenAI、Anthropic、Google、Ollama 和 OpenAI-compatible endpoints。",
      href: "https://openclawdoc.com/docs/getting-started/configuration/"
    },
    {
      value: "Self-Hosted",
      label: "自托管 + Sandbox",
      description: "官方主页和 What is OpenClaw 文档都强调 self-hosted、privacy-first 与 sandboxed skills。",
      href: "https://openclawdoc.com/docs/getting-started/what-is-openclaw/"
    }
  ] satisfies LobsterQuickFact[],
  requirements: [
    {
      label: "系统要求",
      minimum: "Linux 5.4+ / macOS 13+ / Windows 10+ + WSL 2",
      recommended: "Ubuntu 22.04 LTS 或 macOS 14+",
      description: "Windows 官方建议优先用 WSL 2 Ubuntu 环境继续后续步骤。",
      href: "https://openclawdoc.com/docs/getting-started/requirements/"
    },
    {
      label: "Node.js 与 npm",
      minimum: "Node.js 22.16.0 + npm 10",
      recommended: "Node.js 24 + npm 10+",
      description: "官方 Installation 和 Requirements 都写明 Node.js 22+，并推荐 Node.js 24。",
      href: "https://openclawdoc.com/docs/getting-started/requirements/"
    },
    {
      label: "硬件资源",
      minimum: "2 GB RAM / 1 GB 磁盘 / 1 核 CPU",
      recommended: "4 GB+ RAM / 5 GB 磁盘 / 2+ 核 CPU",
      description: "OpenClaw 本体较轻，但活跃技能、会话上下文和本地模型会继续吃资源。",
      href: "https://openclawdoc.com/docs/getting-started/requirements/"
    },
    {
      label: "网络与 Docker",
      minimum: "出站 443",
      recommended: "出站 443 + Web UI/API 入站 3000 + Docker 24+（可选）",
      description: "如果要接 Slack、Telegram 等 webhook，官方要求你的服务能被公网访问。",
      href: "https://openclawdoc.com/docs/getting-started/requirements/"
    }
  ] satisfies LobsterRequirement[],
  installMethods: [
    {
      title: "Quick Install",
      platform: "Linux / macOS",
      description: "官方推荐的单命令安装方式，会自动装依赖并跑 onboarding。",
      command: "curl -fsSL https://openclaw.ai/install.sh | bash",
      href: "https://openclawdoc.com/docs/getting-started/installation/",
      notes: [
        "默认安装到 ~/.openclaw/。",
        "如果你要换目录，先设置 OPENCLAW_HOME 再执行脚本。"
      ]
    },
    {
      title: "PowerShell / WSL 2",
      platform: "Windows",
      description: "官方支持在 PowerShell 里直接跑脚本，也建议在 WSL 2 Ubuntu 里走 Linux 流程。",
      command: "iwr -useb https://openclaw.ai/install.ps1 | iex",
      href: "https://openclawdoc.com/docs/getting-started/installation/",
      notes: [
        "官方建议最佳体验是 WSL 2 + Ubuntu。",
        "PowerShell 遇到权限问题时，文档建议管理员模式并先执行 Set-ExecutionPolicy RemoteSigned。"
      ]
    },
    {
      title: "npm / pnpm",
      platform: "跨平台",
      description: "想手动掌控安装步骤时，用官方 CLI 包后再跑 onboarding。",
      command: "npm install -g openclaw@latest\n# or: pnpm add -g openclaw@latest\nopenclaw onboard --install-daemon",
      href: "https://openclawdoc.com/docs/getting-started/installation/",
      notes: [
        "onboard 会配置认证、Gateway、可选频道和后台服务。",
        "GitHub README 还说明 stable 渠道对应 npm dist-tag latest。"
      ]
    },
    {
      title: "From Source",
      platform: "开发 / 二次开发",
      description: "官方仓库 README 和 Installation 文档都给了源码构建路径。",
      command: "git clone https://github.com/openclaw/openclaw.git\ncd openclaw\npnpm install\npnpm ui:build\npnpm build\npnpm link --global\nopenclaw onboard --install-daemon",
      href: "https://github.com/openclaw/openclaw",
      notes: [
        "GitHub README 明确推荐 pnpm 进行源码构建。",
        "README 还列出了 stable / beta / dev 三种 development channels。"
      ]
    }
  ] satisfies LobsterInstallMethod[],
  configModules: [
    {
      title: "配置文件与默认账号",
      description: "官方配置文档把 openclaw.yaml 作为核心配置入口，并给了默认 dashboard 账号示例。",
      bullets: [
        "配置文件路径用 openclaw config path 查看；FAQ 还列出 ~/.openclaw/openclaw.json、~/.clawdbot/moltbot.json、~/.config/openclaw/config.json 等位置。",
        "官方配置文档示例默认账号是 admin / changeme123，文档明确要求在暴露到网络前先改默认密码。",
        "环境变量可用 OPENCLAW_ 前缀覆盖配置，例如 OPENCLAW_ADMIN_PASSWORD、OPENCLAW_SERVER_PORT。"
      ],
      href: "https://openclawdoc.com/docs/getting-started/configuration/"
    },
    {
      title: "模型与提供商",
      description: "官方 Getting Started 配置文档给出了 OpenAI、Anthropic、Google、Ollama 和 OpenAI-compatible 的最小配置。",
      bullets: [
        "OpenAI 示例默认模型写的是 gpt-4o；Anthropic 示例默认模型是 claude-sonnet-4.6。",
        "Google（Gemini）示例默认模型是 gemini-2.0-flash。",
        "Ollama 可本地跑模型，不需要 API key，但文档要求先确保 Ollama 服务已经启动。"
      ],
      href: "https://openclawdoc.com/docs/getting-started/configuration/"
    },
    {
      title: "配置验证",
      description: "官方文档明确建议在启动或重启前先做配置校验。",
      bullets: [
        "命令是 openclaw config validate。",
        "文档说明它会检查 YAML 结构、逻辑错误和 deprecated 字段，并指出具体报错行。",
        "官方建议把这一步也放进 CI/CD。"
      ],
      href: "https://openclawdoc.com/docs/getting-started/configuration/"
    }
  ] satisfies LobsterGuideModule[],
  firstConversationModules: [
    {
      title: "onboard 与 dashboard",
      description: "官方 Commands 文档把 openclaw onboard 当成首装主入口，dashboard 是最直接的管理界面。",
      bullets: [
        "openclaw onboard 会引导认证、默认模型和频道设置；加 --install-daemon 会一起装后台服务。",
        "openclaw dashboard 会打开 Web dashboard；也支持 --no-open 和 --port 3000。",
        "Commands 文档里的 onboard 示例输出提到监听 18789；而 Installation 文档默认 Web UI/API 端口示例是 3000。"
      ],
      href: "https://www.openclawdoc.com/commands/setup"
    },
    {
      title: "首次启动与登录",
      description: "官方 First Conversation 文档给了启动、打开浏览器和默认登录账号示例。",
      bullets: [
        "启动命令是 openclaw start；后台运行可以用 openclaw start --daemon。",
        "文档默认在浏览器打开 http://localhost:3000。",
        "默认 dashboard 登录示例仍然是 admin / changeme123，登录后会看到聊天界面和配置入口。"
      ],
      href: "https://openclawdoc.com/docs/getting-started/first-conversation/"
    },
    {
      title: "第一条消息怎么发",
      description: "官方 First Conversation 文档建议先发一条简单消息确认模型、技能和界面都正常。",
      bullets: [
        "先发送“Hello, OpenClaw! What can you do?”确认文本响应。",
        "再测试一个技能触发问题，例如询问天气，看它是否会调用技能。",
        "官方文档建议接着去 dashboard 查看 conversation log 和 agent actions。"
      ],
      href: "https://openclawdoc.com/docs/getting-started/first-conversation/"
    }
  ] satisfies LobsterGuideModule[],
  channelHighlights: [
    {
      name: "Telegram",
      difficulty: "Easy",
      description: "Channels Overview 里把 Telegram 列成 easy，支持 inline keyboards，适合作为最快的上手频道之一。",
      href: "https://openclawdoc.com/docs/channels/overview/"
    },
    {
      name: "Discord",
      difficulty: "Easy",
      description: "Channels Overview 里把 Discord 列成 easy，支持 embeds、buttons、select menus。",
      href: "https://openclawdoc.com/docs/channels/overview/"
    },
    {
      name: "Slack",
      difficulty: "Medium",
      description: "官方列为 medium，需要开发者应用和 webhook / token 配置。",
      href: "https://openclawdoc.com/docs/channels/overview/"
    },
    {
      name: "WeChat",
      difficulty: "Hard",
      description: "官方列为 hard，并明确提示需要 ICP filing 等额外条件。",
      href: "https://openclawdoc.com/docs/channels/overview/"
    },
    {
      name: "Microsoft Teams",
      difficulty: "Hard",
      description: "官方列为 hard，需要 Azure subscription 与外部集成配置。",
      href: "https://openclawdoc.com/docs/channels/overview/"
    },
    {
      name: "WebChat",
      difficulty: "Easy",
      description: "官方列为 easy，适合先把一个 agent 挂到自己网站上验证对话体验。",
      href: "https://openclawdoc.com/docs/channels/overview/"
    }
  ] satisfies LobsterChannelHighlight[],
  diagnostics: [
    {
      title: "安装后健康检查",
      description: "Installation 文档建议至少跑这几条命令。",
      bullets: [
        "openclaw --version",
        "openclaw doctor",
        "openclaw status",
        "openclaw dashboard"
      ],
      href: "https://openclawdoc.com/docs/getting-started/installation/"
    },
    {
      title: "最常见安装问题",
      description: "官方 Installation 文档集中写了几类高频问题。",
      bullets: [
        "npm install 权限错误时，不要 sudo 跑 npm，改 npm prefix。",
        "node: command not found 说明 Node.js 没装好或 PATH 不对。",
        "内存不足时可先设置 NODE_OPTIONS=--max-old-space-size=4096。"
      ],
      href: "https://openclawdoc.com/docs/getting-started/installation/"
    },
    {
      title: "FAQ 里的排障点",
      description: "官方 FAQ 对 Docker / Unraid / macOS 权限 / 401 / 404 / 429 都有独立条目。",
      bullets: [
        "FAQ 明确写 Node.js 需要 22+，并提醒检查端口冲突。",
        "macOS 需授予 Screen Recording、Accessibility、Full Disk Access。",
        "如果容器里访问本机模型失败，FAQ 建议把 localhost 改成 host.docker.internal。"
      ],
      href: "https://openclawdoc.com/en/faq/"
    }
  ] satisfies LobsterGuideModule[],
  officialLinkGroups: [
    {
      title: "官方主页与入门",
      description: "先建立全局认识，再按 getting started 顺序往下走。",
      links: [
        {
          label: "官方主页",
          href: "https://openclawdoc.com/",
          description: "官方首页，包含 50+ channels、5700+ skills、Quick Start 和核心定位。"
        },
        {
          label: "What is OpenClaw?",
          href: "https://openclawdoc.com/docs/getting-started/what-is-openclaw/",
          description: "官方架构、Agents / Skills / Channels / Models 概念解释。"
        },
        {
          label: "System Requirements",
          href: "https://openclawdoc.com/docs/getting-started/requirements/",
          description: "官方系统要求，覆盖 OS、Node.js、npm、RAM、磁盘、Docker 和网络。"
        },
        {
          label: "Installation",
          href: "https://openclawdoc.com/docs/getting-started/installation/",
          description: "官方安装文档，包含 Quick install、npm、源码、验证与常见问题。"
        }
      ]
    },
    {
      title: "配置、首聊与频道",
      description: "安装完之后，官方建议继续看这几页。",
      links: [
        {
          label: "Configuration",
          href: "https://openclawdoc.com/docs/getting-started/configuration/",
          description: "官方配置文档，包含 openclaw.yaml、provider、model、admin 和 validation。"
        },
        {
          label: "Your First Conversation",
          href: "https://openclawdoc.com/docs/getting-started/first-conversation/",
          description: "官方首次启动、打开 localhost、登录 dashboard、发第一条消息。"
        },
        {
          label: "Channels Overview",
          href: "https://openclawdoc.com/docs/channels/overview/",
          description: "官方频道总览，包含平台难度、富消息能力、文件上传与群支持。"
        },
        {
          label: "Setup & Initialization",
          href: "https://www.openclawdoc.com/commands/setup",
          description: "官方命令文档，覆盖 onboard、setup、configure、doctor、dashboard、tui。"
        }
      ]
    },
    {
      title: "FAQ 与仓库",
      description: "排障、版本渠道和源码构建都在这两处最集中。",
      links: [
        {
          label: "官方 FAQ",
          href: "https://openclawdoc.com/en/faq/",
          description: "官方常见问题，覆盖端口、macOS 权限、API key、BaseURL、通道连接等。"
        },
        {
          label: "官方 GitHub 仓库",
          href: "https://github.com/openclaw/openclaw",
          description: "官方源码仓库，README 里有 stable / beta / dev channels 和源码构建说明。"
        }
      ]
    }
  ] satisfies LobsterLinkGroup[],
  guideCards: [
    {
      id: "downloads",
      title: "官方安装入口",
      eyebrow: "Official Entry",
      description: "直接进入官方主页、系统要求和安装文档，不再展示虚构安装包。",
      href: "/lobster#downloads",
      cta: "查看官方入口"
    },
    {
      id: "install-guide",
      title: "安装指南",
      eyebrow: "Install Guide",
      description: "把系统要求、安装方式、验证命令和常见问题整理成中文入口。",
      href: lobsterTutorialPosts.install.href,
      cta: "阅读安装指南"
    },
    {
      id: "usage-guide",
      title: "使用指南",
      eyebrow: "Usage Guide",
      description: "围绕配置、首聊、频道文档、FAQ 和排障命令做站内整合。",
      href: lobsterTutorialPosts.usage.href,
      cta: "阅读使用指南"
    }
  ] satisfies LobsterGuideCard[]
} as const;

export function getLobsterDownloadHref() {
  return lobsterZone.package.downloadUrl || "/lobster#downloads";
}
