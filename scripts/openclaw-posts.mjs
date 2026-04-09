export const openClawPosts = [
  {
    slug: "lobster-install-guide",
    title: "OpenClaw（龙虾）安装指南：系统要求、安装方式与验证",
    excerpt: "按官方文档整理 OpenClaw 的系统要求、安装方式、验证命令和常见安装问题。",
    content: `# OpenClaw（龙虾）安装指南：系统要求、安装方式与验证

本文根据 OpenClaw 官方 Getting Started、Commands 文档和官方 GitHub 仓库整理，适合作为中文安装入口。

## 官方来源

- [官方主页](https://openclawdoc.com/)
- [What is OpenClaw?](https://openclawdoc.com/docs/getting-started/what-is-openclaw/)
- [System Requirements](https://openclawdoc.com/docs/getting-started/requirements/)
- [Installation](https://openclawdoc.com/docs/getting-started/installation/)
- [Setup & Initialization](https://www.openclawdoc.com/commands/setup)
- [官方 GitHub 仓库](https://github.com/openclaw/openclaw)

## 安装前先确认

- 官方要求 Linux 5.4+、macOS 13+，或 Windows 10+ 并配合 WSL 2。
- Node.js 最低要求为 22.16.0，官方推荐 Node.js 24；npm 建议 10+。
- 最低资源建议为 2 GB RAM、1 GB 磁盘和 1 核 CPU；长期使用建议至少 4 GB RAM 和 5 GB 磁盘。
- 如果你要使用 sandboxed skills，官方建议准备 Docker 24+。
- 如果后续接 Slack、Telegram 等 webhook，官方要求实例具备可访问的公网地址。

## 安装方式一：Quick Install

### Linux / macOS

\`\`\`bash
curl -fsSL https://openclaw.ai/install.sh | bash
\`\`\`

### Windows（PowerShell / WSL 2）

\`\`\`powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
\`\`\`

- 官方文档说明脚本会自动安装 OpenClaw，并继续执行 onboarding 流程。
- Windows 最佳体验仍然是 WSL 2 + Ubuntu；如果直接在 PowerShell 运行，建议先确认执行策略允许脚本运行。
- 如需自定义安装目录，可先设置 \`OPENCLAW_HOME\`。

## 安装方式二：npm / pnpm

\`\`\`bash
npm install -g openclaw@latest
# or: pnpm add -g openclaw@latest
openclaw onboard --install-daemon
\`\`\`

- 这种方式适合你想手动掌控安装步骤。
- \`openclaw onboard --install-daemon\` 会继续安装和初始化 Gateway / daemon。

## 安装方式三：源码安装

\`\`\`bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
pnpm link --global
openclaw onboard --install-daemon
\`\`\`

- 官方仓库 README 和 Installation 文档都给出了源码安装路径。
- 如果你要二次开发、调试或自定义构建，建议走这一条。

## 安装完成后如何验证

\`\`\`bash
openclaw --version
openclaw doctor
openclaw status
openclaw dashboard
\`\`\`

- \`openclaw --version\` 用来确认 CLI 已正常安装。
- \`openclaw doctor\` 会检查 Node.js、依赖和环境状态。
- \`openclaw status\` 可以确认服务状态。
- \`openclaw dashboard\` 会打开 Web 控制台，是最直观的验证方式。

## 常见安装问题

- 如果 \`node: command not found\`，先检查 Node.js 是否装好并且已加入 PATH。
- 如果全局安装权限不足，优先调整 npm prefix，不建议直接长期使用 \`sudo npm\`。
- 如果构建过程内存不足，可临时增加 \`NODE_OPTIONS="--max-old-space-size=4096"\`。
- 如果 WSL 中缺少 \`curl\`，先执行 \`sudo apt update && sudo apt install -y curl\`。
- 如果 3000 端口被占用，按官方配置文档修改 \`server.port\` 或环境变量后再启动。

## 下一步

- 完成安装后继续阅读 [Configuration](https://openclawdoc.com/docs/getting-started/configuration/) 配置提供商、模型和管理员信息。
- 首次进入后台前，建议立即修改默认管理员密码。
- 如果你要深入接入频道、技能和源码能力，继续查看 [官方 GitHub 仓库](https://github.com/openclaw/openclaw) 和官方命令文档。

## 备注

- 本文内容已于 2026-04-09 对照官方公开文档核对。
- 如官方安装命令或系统要求更新，应以官方文档为准。`
  },
  {
    slug: "lobster-usage-guide",
    title: "OpenClaw（龙虾）使用指南：配置、首聊、频道与排障",
    excerpt: "按官方文档整理 OpenClaw 的配置方法、首次对话、频道接入和排障命令。",
    content: `# OpenClaw（龙虾）使用指南：配置、首聊、频道与排障

本文根据 OpenClaw 官方 Configuration、First Conversation、Channels、Commands 和 FAQ 文档整理，重点解决“装完之后怎么真正用起来”。

## 官方来源

- [官方主页](https://openclawdoc.com/)
- [Configuration](https://openclawdoc.com/docs/getting-started/configuration/)
- [Your First Conversation](https://openclawdoc.com/docs/getting-started/first-conversation/)
- [Channels Overview](https://openclawdoc.com/docs/channels/overview/)
- [Setup & Initialization](https://www.openclawdoc.com/commands/setup)
- [官方 FAQ](https://openclawdoc.com/en/faq/)
- [官方 GitHub 仓库](https://github.com/openclaw/openclaw)

## OpenClaw 是什么

- 官方把 OpenClaw定义为开源、自托管、privacy-first 的 AI agent platform。
- 官方主页强调它支持 50+ communication channels。
- 官方主页和 What is OpenClaw 文档都提到 ClawHub 已有 5700+ 技能。
- 官方明确支持多模型提供商，包括 OpenAI、Anthropic、Google、Ollama 和 OpenAI-compatible endpoints。

## 配置文件与默认后台

- 核心配置文件是 \`openclaw.yaml\`。
- FAQ 还列出了 \`~/.openclaw/openclaw.json\`、\`~/.clawdbot/moltbot.json\`、\`~/.config/openclaw/config.json\` 等常见路径。
- 可以使用 \`openclaw config path\` 查看当前实例的配置文件位置。
- 官方示例里 dashboard 默认管理员是 \`admin / changeme123\`，正式使用前应立即修改密码。

## 模型与提供商配置

- OpenAI 示例常见模型为 \`gpt-4o\`。
- Anthropic 示例常见模型为 \`claude-sonnet-4.6\`。
- Google（Gemini）示例常见模型为 \`gemini-2.0-flash\`。
- 如果你走本地模型路线，官方也支持 Ollama。

## 首次启动与第一轮对话

\`\`\`bash
openclaw start
# 后台运行
openclaw start --daemon
\`\`\`

- 官方 First Conversation 文档默认在浏览器打开 \`http://localhost:3000\`。
- 首次登录进入 dashboard 后，先确认模型可用、会话可创建、界面可正常响应。
- 官方建议先发送一条简单消息，例如 “Hello, OpenClaw! What can you do?”，确认文本响应和技能链路正常。
- 完成首聊后，可以继续在 dashboard 查看 conversation log 和 agent actions。

## 常用命令

\`\`\`bash
openclaw onboard
openclaw onboard --install-daemon
openclaw configure
openclaw doctor
openclaw dashboard
openclaw tui
\`\`\`

- \`openclaw onboard\` 适合初始化或补做首次配置。
- \`openclaw configure\` 用于补充和修改模型、提供商等配置。
- \`openclaw doctor\` 用于排查环境问题。
- \`openclaw dashboard\` 用于打开 Web 控制台。
- \`openclaw tui\` 适合 SSH 或终端环境下使用。

## 频道接入怎么选

- 官方 Channels Overview 按难度列出了不同渠道。
- Telegram、Discord、WebChat 适合作为 easy 入口。
- Slack、Feishu、Google Chat 更接近 medium 难度。
- WeChat、Teams、iMessage 等通常更复杂，适合作为后续扩展。
- 如果你只是想先验证 channel 流程，优先从 Telegram 或 Discord 开始。

## 排障检查

\`\`\`bash
openclaw config validate
openclaw doctor
openclaw dashboard
openclaw channels list
\`\`\`

- 配置改完后，先执行 \`openclaw config validate\` 检查 YAML 和逻辑问题。
- 如果遇到 401、404、429 或 Base URL 异常，优先回到官方 FAQ 对照提供商配置。
- 在 Docker 或容器环境里，FAQ 还特别提醒 \`localhost\` 可能需要换成 \`host.docker.internal\`。
- 官方 FAQ 也单独提到 macOS 场景下的权限问题，例如 Screen Recording、Accessibility 和 Full Disk Access。

## 使用建议

- 如果你要长期自托管，优先把管理员密码、端口和 provider key 管理好。
- 如果你要接多渠道，建议先把一个 channel 跑通，再复制配置到其他渠道。
- 如果你要做技能扩展或深度集成，建议直接对照官方 GitHub 仓库和文档继续推进。

## 备注

- 本文内容已于 2026-04-09 对照官方公开文档核对。
- 如官方配置字段、默认模型或频道支持列表更新，应以官方文档为准。`
  }
];

export default openClawPosts;
