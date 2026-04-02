# 运维与发布

## 环境变量

本地和 Vercel 需要保持一致：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

## 本地开发流程

1. 拉取最新代码
2. 检查 `.env.local`
3. 运行 `npm run dev`
4. 改动完成后运行 `npm run build`
5. 提交 Git
6. 推送到 `main`

## 线上发布流程

当前已接入 GitHub + Vercel 自动部署。

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

