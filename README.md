# AI Tools Navigator

AI 工具导航站，基于 Next.js 14、TypeScript、Tailwind CSS、Supabase 和 Vercel。

## 当前状态

- 前台站点已接入真实 Supabase 数据
- 提交工具表单会写入 `tool_submissions`
- 后台支持审核投稿、编辑工具
- 新增了“后台直接创建工具”录入流程

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

参考 [.env.example](/D:/WXKFZ/DM/AI导航网站/.env.example)，在项目根目录创建 `.env.local`

3. 启动开发环境

```bash
npm run dev
```

4. 生产构建检查

```bash
npm run build
```

## 关键文档

- 架构说明：[docs/ARCHITECTURE.md](/D:/WXKFZ/DM/AI导航网站/docs/ARCHITECTURE.md)
- 运维与发布：[docs/OPERATIONS.md](/D:/WXKFZ/DM/AI导航网站/docs/OPERATIONS.md)
- 内容录入流程：[docs/CONTENT_WORKFLOW.md](/D:/WXKFZ/DM/AI导航网站/docs/CONTENT_WORKFLOW.md)

## 运营入口

- 前台首页：`/`
- 工具总览：`/tools`
- 投稿页面：`/submit`
- 后台审核：`/admin`
- 后台工具管理：`/admin/tools`
- 后台新建工具：`/admin/tools/new`

