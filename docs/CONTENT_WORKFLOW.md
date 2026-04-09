# 内容录入流程

## 目标

让首页、工具列表页、工具详情页展示真实工具数据，而不是 mock。

## 录入方式 A：后台直接新建工具

适合站长自己录入官方工具或编辑精选内容。

入口：

- `/admin/tools/new`

流程：

1. 登录后台
2. 填写工具名称、Slug、官网、分类、价格模式
3. 填写简介、详细介绍、标签、功能点
4. 选择是否提供 API
5. 选择是否设为赞助工具
6. 设置发布状态
7. 保存

保存后：

- `status = published` 的工具会进入正式工具库
- 首页、分类页、工具详情页会读取到新工具
- 如果 `is_sponsored = true`，首页精选工具会优先展示

## 录入方式 A-2：批量同步官方工具

适合把站内内置的精选工具一次性写入真实数据库，避免前台长期依赖 mock fallback。

命令：

```bash
npm run sync:official-tools
```

当前脚本会同步一批常用工具的真实官网地址和基础资料，覆盖：

- 海外通用助手与搜索：ChatGPT、Claude、Gemini、Microsoft Copilot、Perplexity、Notion AI
- 海外编程工具：Cursor、GitHub Copilot、Windsurf、Replit、Bolt.new
- 海外设计 / 视频 / 音频：Midjourney、Leonardo AI、Canva Magic Design、Figma AI、Runway、Pika、Synthesia、HeyGen、ElevenLabs、Suno、Udio
- 国内通用助手与搜索：DeepSeek、豆包、Kimi、通义千问、腾讯元宝、智谱清言、讯飞星火、天工AI、秘塔AI搜索、文心一言、腾讯混元、Monica、Manus、通义听悟
- 国内视频 / 设计 / 编程：即梦AI、可灵AI、海螺AI、腾讯智影、AiPPT、WHEE、通义灵码、Trae

当前目录源文件位置：

- `scripts/official-tools-catalog.mjs`

当前内置目录覆盖：

- 50 个真实官网工具
- 海外工具 28 个
- 国内工具 22 个

## 录入方式 B：用户投稿后审核

适合开放投稿运营。

入口：

- 用户投稿：`/submit`
- 后台审核：`/admin`

流程：

1. 用户提交工具
2. 数据进入 `tool_submissions`
3. 后台审核通过
4. 系统转成正式 `tools` 数据

## 已发布工具的维护

入口：

- `/admin/tools`

可维护内容：

- 名称
- 描述
- 详细介绍
- 分类
- 标签
- 功能点
- 价格模式
- API 状态
- 赞助状态
- 发布状态

## 首页展示规则

### 精选工具

优先展示：

- `is_sponsored = true`

### 最新收录

优先按：

- `published_at` 倒序

### 分类数量

按 `tools` 表的真实发布数据统计
