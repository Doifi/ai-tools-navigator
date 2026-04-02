# 架构说明

## 技术栈

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## 目录重点

- `src/app`
  - 页面、API 路由、后台入口
- `src/components`
  - 前台和后台 UI 组件
- `src/lib`
  - Supabase 客户端、fetcher、mock fallback、工具函数
- `src/types`
  - Supabase 类型定义
- `supabase`
  - 数据库结构和初始化 SQL

## 数据流

### 前台页面

前台页面通过 `/api/*` 读取数据。

- 首页：读取分类、工具、文章
- 工具列表页：读取工具分页和筛选结果
- 工具详情页：读取单个工具和相关文章
- 投稿页：写入 `tool_submissions`

### 后台页面

后台页面通过 Supabase 管理端客户端直接读取，写操作走 `/api/admin/*`

- `/admin`
  - 审核用户投稿
- `/admin/tools`
  - 编辑已有工具
- `/admin/tools/new`
  - 直接创建并发布工具

## 数据库核心表

- `categories`
  - 工具分类
- `tools`
  - 正式上线的工具
- `posts`
  - 文章和教程
- `tool_submissions`
  - 用户投稿待审核记录

## 首页和工具页依赖字段

为了让工具能正确出现在首页和工具页，至少要保证这些字段正确：

- `name`
- `slug`
- `description`
- `website_url`
- `category_id`
- `price_model`
- `api_available`
- `status`

这些字段会影响不同区域：

- 首页精选工具
  - `is_sponsored = true` 时会优先展示
- 首页最新收录
  - 主要看 `published_at`
- 工具列表页筛选
  - 依赖 `category_id`、`price_model`、`api_available`
- 工具详情页
  - 依赖 `slug`、`description`、`detailed_intro`、`tags`、`features`

