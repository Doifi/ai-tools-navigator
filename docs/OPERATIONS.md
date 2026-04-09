# 运维与发布

## 环境变量

本地和 Vercel 需要保持一致：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

补充说明：

- Vercel 的 `preview` 环境也必须同步以上四个变量，不能只配 `production`
- 如果 `preview` 缺少 Supabase 变量，工具页、文章页和 OpenClaw 教程页会退回 mock 数据，严重时会直接出现 404
- 手动 `vercel deploy` 后如果发现预览页和生产页数据不一致，先检查 `preview` 环境变量是否齐全

## 本地开发流程

1. 拉取最新代码
2. 检查 `.env.local`
3. 运行 `npm run dev`
4. 改动完成后运行 `npm run build`
5. 提交 Git
6. 推送到 `main`

## 线上发布流程

当前已接入 GitHub + Vercel 自动部署。

### 当前部署记录

- Vercel 项目：`doifi's projects / ai-tools-navigator`
- 项目 ID：`prj_cC4fm6pCP80mzfM5s6A8w8PiEavv`
- 稳定线上地址：`https://ai-tools-navigator-doifis-projects.vercel.app`
- 备用线上别名：`https://ai-tools-navigator-navy.vercel.app`
- Git 主分支别名：`https://ai-tools-navigator-git-main-doifis-projects.vercel.app`

### 后台入口记录

- 后台首页：`/admin`
- 后台登录：`/admin/login`
- 工具管理：`/admin/tools`
- 新建工具：`/admin/tools/new`
- 文章管理：`/admin/posts`
- 新建文章：`/admin/posts/new`

### 后台口令记录

- 后台口令由环境变量 `ADMIN_PASSWORD` 控制
- 本地开发时以项目根目录 `.env.local` 为准
- 线上环境时以 Vercel Project Environment Variables 为准
- 如口令变更，需要同步更新本地 `.env.local` 和 Vercel 环境变量

### 最近一次已确认可用的生产部署

- 确认时间：2026-04-03
- 当前稳定别名指向的成功部署时间：2026-04-02 08:59:23（Asia/Shanghai）

标准发版流程：

1. 在本地完成功能开发
2. 运行 `npm run build`
3. 提交代码
4. 推送到 GitHub `main`
5. Vercel 自动生产部署

## 数据库变更流程

涉及数据库结构时：

1. 先修改 `supabase/schema.sql`
2. 如需兼容旧库，补 migration 文件
3. 更新 `src/types/supabase.ts`
4. 再改 API 和页面

## 回滚思路

### 代码回滚

- 回退到上一个 Git 提交
- 重新推送 `main`
- Vercel 会自动重新部署

### 数据回滚

- 优先用 Supabase Dashboard 手动修正
- 大变更前先导出数据库或关键表

## 后续功能开发建议

新增功能时优先保持这条顺序：

1. 先改数据结构
2. 再改 API
3. 再改页面
4. 最后补文档
