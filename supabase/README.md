# Supabase Setup

## 1. 在 Supabase 创建项目

1. 打开 `https://supabase.com/dashboard`
2. 点击 `New project`
3. 选择 Organization
4. 填写：
   - Project name：`ai-tools-navigator`
   - Database Password：设置一个强密码并保存
   - Region：选离用户最近的区域
5. 等待项目初始化完成

## 2. 获取项目 URL 和公开 Key

进入项目后：

1. 打开 `Project Settings`
2. 进入 `API`
3. 记录以下值：
   - `Project URL`
   - `anon public key`

本项目使用：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

如果后续要做服务端管理员操作，再额外配置：

- `SUPABASE_SERVICE_ROLE_KEY`

## 3. 配置环境变量

1. 复制 `.env.example` 为 `.env.local`
2. 填入你自己的 Supabase 配置

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. 初始化数据库

在 Supabase 控制台中：

1. 打开 `SQL Editor`
2. 执行 `supabase/schema.sql`
3. 确认建表、索引、RLS 和策略创建成功
4. 再执行 `supabase/seed.sql`

## 5. 当前代码中的 Supabase 文件

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/types/supabase.ts`

## 6. 说明

- 当前 `server.ts` 使用的是官方现行推荐的 `@supabase/ssr`
- 如果后续接入 Supabase Auth，需要再补 `middleware.ts` 来刷新 session
- 现在这套初始化已经足够支持公开查询、文章读取、工具读取和提交工具记录插入
