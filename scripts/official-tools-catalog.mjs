const basePublishedAt = new Date("2026-04-09T00:00:00.000Z");
const baseViews = 268000;
const viewStep = 4200;

function buildTool(tool, index) {
  const views = Math.max(36000, baseViews - index * viewStep);
  const clickRate = tool.isSponsored ? 0.34 : tool.apiAvailable ? 0.31 : 0.27;

  return {
    sponsorPlan: null,
    isSponsored: false,
    apiAvailable: false,
    priceModel: "freemium",
    ...tool,
    publishedAt:
      tool.publishedAt ??
      new Date(basePublishedAt.getTime() - index * 6 * 60 * 60 * 1000).toISOString(),
    views: tool.views ?? views,
    clicks: tool.clicks ?? Math.max(4600, Math.round(views * clickRate))
  };
}

const baseTools = [
  {
    market: "global",
    name: "ChatGPT",
    slug: "chatgpt",
    websiteUrl: "https://chatgpt.com",
    categorySlug: "ai-productivity",
    description: "通用型 AI 助手，适合问答、写作、分析和日常工作流。",
    detailedIntro:
      "ChatGPT 是 OpenAI 的通用助手产品，常用于搜索替代、内容起草、数据分析和多步骤工作协作。",
    tags: ["通用助手", "知识问答", "工作流"],
    features: ["多轮对话", "文档分析", "多场景协作"],
    apiAvailable: true,
    isSponsored: true,
    sponsorPlan: "homepage"
  },
  {
    market: "global",
    name: "Claude",
    slug: "claude",
    websiteUrl: "https://claude.ai",
    categorySlug: "ai-writing",
    description: "擅长长文本理解与结构化写作的 AI 助手。",
    detailedIntro:
      "Claude 由 Anthropic 推出，常用于长文总结、策略备忘录、品牌文案和复杂说明文档编写。",
    tags: ["长文总结", "结构写作", "文档处理"],
    features: ["长上下文", "写作辅助", "资料归纳"],
    apiAvailable: true
  },
  {
    market: "global",
    name: "Gemini",
    slug: "gemini",
    websiteUrl: "https://gemini.google.com",
    categorySlug: "ai-productivity",
    description: "Google 旗下的多模态 AI 助手，适合检索、总结和办公协作。",
    detailedIntro:
      "Gemini 面向搜索、文档处理、图文问答和 Google 生态协作，是高频的综合型办公入口。",
    tags: ["多模态", "Google生态", "办公助手"],
    features: ["图文理解", "搜索整合", "多模态问答"],
    apiAvailable: true
  },
  {
    market: "global",
    name: "Microsoft Copilot",
    slug: "microsoft-copilot",
    websiteUrl: "https://copilot.microsoft.com",
    categorySlug: "ai-productivity",
    description: "微软生态里的 AI 助手，适合搜索、办公和工作总结。",
    detailedIntro:
      "Microsoft Copilot 面向搜索问答、Office 场景和企业办公流程，适合作为微软用户的统一入口。",
    tags: ["微软生态", "搜索助手", "办公协作"],
    features: ["工作总结", "搜索问答", "Office协作"]
  },
  {
    market: "global",
    name: "Perplexity",
    slug: "perplexity",
    websiteUrl: "https://www.perplexity.ai",
    categorySlug: "ai-productivity",
    description: "以搜索和研究为核心的 AI 答案引擎。",
    detailedIntro:
      "Perplexity 适合快速查资料、梳理竞品信息和生成带来源的研究摘要，是研究型工作流常用入口。",
    tags: ["AI搜索", "研究分析", "来源引用"],
    features: ["AI搜索", "研究摘要", "来源引用"],
    isSponsored: true,
    sponsorPlan: "featured"
  },
  {
    market: "global",
    name: "Notion AI",
    slug: "notion-ai",
    websiteUrl: "https://www.notion.com/product/ai",
    categorySlug: "ai-productivity",
    description: "嵌入知识库与协作空间的 AI 办公助手。",
    detailedIntro:
      "Notion AI 适合会议纪要、知识库整理、任务拆解和团队文档协作，是效率办公场景里的高频入口。",
    tags: ["知识管理", "会议纪要", "团队协作"],
    features: ["知识库协作", "会议纪要", "文档整理"]
  },
  {
    market: "global",
    name: "Fireflies.ai",
    slug: "fireflies-ai",
    websiteUrl: "https://fireflies.ai",
    categorySlug: "ai-productivity",
    description: "AI 会议记录与会后摘要工具，适合销售和协作团队。",
    detailedIntro:
      "Fireflies.ai 主要解决会议录音、自动转写、行动项提取和 CRM 跟进记录等协作问题。",
    tags: ["会议记录", "自动转写", "销售协作"],
    features: ["会议纪要", "行动项提取", "会后总结"],
    apiAvailable: true
  },
  {
    market: "global",
    name: "Otter.ai",
    slug: "otter-ai",
    websiteUrl: "https://otter.ai",
    categorySlug: "ai-productivity",
    description: "面向会议、访谈和课堂记录的 AI 转写助手。",
    detailedIntro:
      "Otter.ai 适合线上会议、采访、课堂笔记和访谈内容整理，是音频转文字的老牌工具。",
    tags: ["语音转写", "会议总结", "访谈记录"],
    features: ["实时转写", "摘要提炼", "协作分享"]
  },
  {
    market: "global",
    name: "Grammarly",
    slug: "grammarly",
    websiteUrl: "https://www.grammarly.com/ai",
    categorySlug: "ai-writing",
    description: "英文写作与语气优化工具，适合邮件、报告和商务沟通。",
    detailedIntro:
      "Grammarly 除了语法纠错，也强化了 AI 写作、改写和语气建议，适合日常英文办公场景。",
    tags: ["英文写作", "语气优化", "邮件沟通"],
    features: ["改写润色", "语法纠错", "语气建议"]
  },
  {
    market: "global",
    name: "Jasper",
    slug: "jasper",
    websiteUrl: "https://www.jasper.ai",
    categorySlug: "ai-writing",
    description: "面向营销团队的 AI 文案与 Campaign 生成工具。",
    detailedIntro:
      "Jasper 适合广告文案、邮件营销、品牌内容和多渠道 Campaign 素材生成。",
    tags: ["广告文案", "Campaign", "品牌内容"],
    features: ["营销文案", "Campaign生成", "品牌内容"],
    apiAvailable: true,
    isSponsored: true,
    sponsorPlan: "featured"
  },
  {
    market: "global",
    name: "Elicit",
    slug: "elicit",
    websiteUrl: "https://elicit.com",
    categorySlug: "ai-education",
    description: "面向研究和学术场景的 AI 文献助手。",
    detailedIntro:
      "Elicit 适合文献检索、研究问题拆解和论文摘要整理，常被用于学术和行业研究流程。",
    tags: ["文献检索", "研究辅助", "学术写作"],
    features: ["论文检索", "研究总结", "问题拆解"]
  },
  {
    market: "global",
    name: "Gamma",
    slug: "gamma",
    websiteUrl: "https://gamma.app",
    categorySlug: "ai-design",
    description: "一键生成演示文稿、网页和轻量视觉内容的 AI 工具。",
    detailedIntro:
      "Gamma 适合做商业方案、分享页、报告和演示稿，强调内容生成与版式自动排布。",
    tags: ["演示文稿", "网页生成", "自动排版"],
    features: ["PPT生成", "网页提案", "内容排版"]
  },
  {
    market: "global",
    name: "Cursor",
    slug: "cursor",
    websiteUrl: "https://cursor.com",
    categorySlug: "ai-coding",
    description: "面向工程团队的 AI 编辑器，聚焦真实代码上下文。",
    detailedIntro:
      "Cursor 提供代码补全、项目问答、重构建议和跨文件上下文理解能力，适合真实工程协作。",
    tags: ["代码补全", "项目问答", "重构"],
    features: ["AI编辑器", "项目理解", "跨文件重构"]
  },
  {
    market: "global",
    name: "GitHub Copilot",
    slug: "github-copilot",
    websiteUrl: "https://github.com/features/copilot",
    categorySlug: "ai-coding",
    description: "集成在开发流程中的 AI 编程助手。",
    detailedIntro:
      "GitHub Copilot 适合在 IDE 中完成代码补全、测试生成和代码解释等工程任务。",
    tags: ["IDE集成", "代码建议", "测试生成"],
    features: ["代码补全", "测试辅助", "开发协作"]
  },
  {
    market: "global",
    name: "Windsurf",
    slug: "windsurf",
    websiteUrl: "https://windsurf.com",
    categorySlug: "ai-coding",
    description: "强调 Agent 式开发体验的 AI 编程工具。",
    detailedIntro:
      "Windsurf 聚焦从提示到代码、预览、调试和插件协作的一体化开发流程，适合快速原型和 Agent 编程。",
    tags: ["Agent编程", "代码生成", "开发预览"],
    features: ["项目生成", "Agent协作", "开发预览"]
  },
  {
    market: "global",
    name: "Replit",
    slug: "replit",
    websiteUrl: "https://replit.com",
    categorySlug: "ai-coding",
    description: "云端开发平台，结合 AI 辅助编码和在线部署能力。",
    detailedIntro:
      "Replit 适合在线开发、教学演示、快速原型和多人协作，配合 AI 功能可加速从想法到可运行项目。",
    tags: ["在线IDE", "快速原型", "部署一体化"],
    features: ["云端开发", "多人协作", "一键运行"]
  },
  {
    market: "global",
    name: "Bolt.new",
    slug: "bolt-new",
    websiteUrl: "https://bolt.new",
    categorySlug: "ai-coding",
    description: "通过对话生成网站、应用和原型的 AI Builder。",
    detailedIntro:
      "Bolt.new 擅长从提示直接生成前端原型和可部署项目，适合产品经理、设计师和开发者做快速落地。",
    tags: ["应用生成", "网站原型", "对话建站"],
    features: ["全栈生成", "原型搭建", "即时预览"]
  },
  {
    market: "global",
    name: "Midjourney",
    slug: "midjourney",
    websiteUrl: "https://www.midjourney.com",
    categorySlug: "ai-drawing",
    description: "高表现力图像生成工具，适合视觉概念探索。",
    detailedIntro:
      "Midjourney 适合设计师和内容团队快速生成风格化视觉、概念海报和灵感草图。",
    tags: ["视觉创意", "海报灵感", "品牌风格"],
    features: ["图像生成", "风格探索", "创意打样"],
    priceModel: "paid",
    isSponsored: true,
    sponsorPlan: "featured"
  },
  {
    market: "global",
    name: "Leonardo AI",
    slug: "leonardo-ai",
    websiteUrl: "https://leonardo.ai",
    categorySlug: "ai-drawing",
    description: "面向素材、电商和游戏美术的 AI 图像生成平台。",
    detailedIntro:
      "Leonardo AI 常用于角色、产品图、素材图和品牌视觉生成，适合商业设计与资产制作场景。",
    tags: ["素材生成", "角色设计", "商用视觉"],
    features: ["图像生成", "素材制作", "风格控制"],
    apiAvailable: true
  },
  {
    market: "global",
    name: "Canva Magic Design",
    slug: "canva-magic-design",
    websiteUrl: "https://www.canva.com/magic-design/",
    categorySlug: "ai-design",
    description: "适合非设计团队快速生成图文素材与演示视觉。",
    detailedIntro:
      "Canva Magic Design 可快速产出社媒图、演示稿视觉和多尺寸营销素材，适合轻量设计场景。",
    tags: ["社媒素材", "演示视觉", "轻量设计"],
    features: ["设计生成", "演示视觉", "多尺寸素材"]
  },
  {
    market: "global",
    name: "Figma AI",
    slug: "figma-ai",
    websiteUrl: "https://www.figma.com/ai/",
    categorySlug: "ai-design",
    description: "Figma 里的 AI 设计助手，适合原型、文案和视觉迭代。",
    detailedIntro:
      "Figma AI 适合设计团队在原型、命名、文案生成和界面改稿阶段做协同提效。",
    tags: ["设计协作", "原型迭代", "界面生成"],
    features: ["界面改稿", "文案生成", "设计协作"]
  },
  {
    market: "global",
    name: "Runway",
    slug: "runway",
    websiteUrl: "https://runwayml.com",
    categorySlug: "ai-video",
    description: "AI 视频生成与编辑平台，适合营销内容打样。",
    detailedIntro:
      "Runway 可用于视频生成、镜头延展、素材处理和广告创意演示，适合内容与增长团队。",
    tags: ["视频生成", "镜头延展", "广告素材"],
    features: ["文生视频", "视频编辑", "创意打样"],
    priceModel: "paid",
    apiAvailable: true,
    isSponsored: true,
    sponsorPlan: "featured"
  },
  {
    market: "global",
    name: "Pika",
    slug: "pika",
    websiteUrl: "https://pika.art",
    categorySlug: "ai-video",
    description: "适合短视频、社媒素材和创意实验的视频生成工具。",
    detailedIntro:
      "Pika 主要服务于短视频创作者和营销团队，强调创意速度、易用性和特效式生成体验。",
    tags: ["短视频", "创意实验", "特效生成"],
    features: ["视频生成", "创意特效", "短内容打样"]
  },
  {
    market: "global",
    name: "Synthesia",
    slug: "synthesia",
    websiteUrl: "https://www.synthesia.io",
    categorySlug: "ai-video",
    description: "面向培训和企业传播的 AI 数字人视频工具。",
    detailedIntro:
      "Synthesia 适合企业培训、产品解说、内部传播和多语言讲解视频制作。",
    tags: ["数字人", "培训视频", "企业传播"],
    features: ["数字人视频", "多语言配音", "企业培训"],
    apiAvailable: true
  },
  {
    market: "global",
    name: "HeyGen",
    slug: "heygen",
    websiteUrl: "https://www.heygen.com",
    categorySlug: "ai-video",
    description: "数字人视频与口播生成工具，适合营销和销售内容。",
    detailedIntro:
      "HeyGen 擅长数字人口播、营销讲解、多语言人物视频和企业宣传内容制作。",
    tags: ["数字人口播", "营销视频", "多语言"],
    features: ["口播视频", "数字人", "营销内容"],
    apiAvailable: true
  },
  {
    market: "global",
    name: "ElevenLabs",
    slug: "elevenlabs",
    websiteUrl: "https://elevenlabs.io",
    categorySlug: "ai-audio",
    description: "高拟真语音合成与角色配音工具。",
    detailedIntro:
      "ElevenLabs 适合课程配音、播客旁白、多语言语音生成和角色声音设计。",
    tags: ["配音", "语音克隆", "多语言"],
    features: ["语音合成", "语音克隆", "多语言配音"],
    apiAvailable: true
  },
  {
    market: "global",
    name: "Suno",
    slug: "suno",
    websiteUrl: "https://suno.com",
    categorySlug: "ai-audio",
    description: "一句话生成完整歌曲，适合创意灵感和传播实验。",
    detailedIntro:
      "Suno 帮助团队快速生成歌曲 demo、短视频配乐和轻量音乐创意方案。",
    tags: ["音乐生成", "短视频配乐", "创意实验"],
    features: ["AI作曲", "歌曲生成", "创意配乐"]
  },
  {
    market: "global",
    name: "Udio",
    slug: "udio",
    websiteUrl: "https://www.udio.com",
    categorySlug: "ai-audio",
    description: "AI 音乐生成工具，适合旋律创作、配乐和歌曲实验。",
    detailedIntro:
      "Udio 面向歌曲创作和音乐灵感生成，适合内容创作者、音乐爱好者和短视频团队使用。",
    tags: ["音乐生成", "歌曲创作", "旋律实验"],
    features: ["音乐生成", "配乐创作", "人声旋律"]
  },
  {
    market: "china",
    name: "DeepSeek",
    slug: "deepseek",
    websiteUrl: "https://chat.deepseek.com/",
    categorySlug: "ai-productivity",
    description: "国内高热度通用大模型助手，适合推理、写作和编程问答。",
    detailedIntro:
      "DeepSeek 以通用问答、推理分析和代码问题处理见长，是当前国内高频使用的 AI 助手之一。",
    tags: ["推理问答", "通用助手", "代码问答"],
    features: ["深度推理", "多轮对话", "问题分析"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "豆包",
    slug: "doubao",
    websiteUrl: "https://www.doubao.com/",
    categorySlug: "ai-productivity",
    description: "字节跳动旗下通用 AI 助手，覆盖聊天、写作和图像等多场景。",
    detailedIntro:
      "豆包面向大众和办公用户，整合了聊天问答、写作、图像和多种日常使用能力。",
    tags: ["通用助手", "字节系", "多场景"],
    features: ["聊天问答", "内容创作", "多能力整合"]
  },
  {
    market: "china",
    name: "Kimi",
    slug: "kimi",
    websiteUrl: "https://kimi.moonshot.cn/",
    categorySlug: "ai-productivity",
    description: "长文本处理能力突出的国内 AI 助手。",
    detailedIntro:
      "Kimi 以超长上下文和资料阅读能力见长，适合研报、文档、论文和信息密集型工作流。",
    tags: ["长上下文", "资料阅读", "研究助手"],
    features: ["长文总结", "资料问答", "信息整理"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "通义千问",
    slug: "tongyi-qianwen",
    websiteUrl: "https://www.qianwen.com/",
    categorySlug: "ai-productivity",
    description: "阿里系通用 AI 助手，覆盖问答、办公和多模态能力。",
    detailedIntro:
      "通义千问适合通用问答、办公处理、图文理解和阿里云生态下的协作场景。",
    tags: ["阿里系", "多模态", "办公助手"],
    features: ["问答总结", "图文理解", "工作协作"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "腾讯元宝",
    slug: "tencent-yuanbao",
    websiteUrl: "https://yuanbao.tencent.com/",
    categorySlug: "ai-productivity",
    description: "腾讯推出的通用 AI 助手，适合搜索、写作和内容处理。",
    detailedIntro:
      "腾讯元宝面向大众搜索、内容总结和办公效率场景，是腾讯通用 AI 助手的主入口。",
    tags: ["腾讯系", "内容总结", "通用助手"],
    features: ["搜索问答", "内容整理", "多轮对话"]
  },
  {
    market: "china",
    name: "智谱清言",
    slug: "zhipu-qingyan",
    websiteUrl: "https://chatglm.cn/",
    categorySlug: "ai-productivity",
    description: "基于 GLM 模型的通用 AI 助手，适合写作、问答和办公。",
    detailedIntro:
      "智谱清言是智谱面向终端用户的 AI 助手产品，适合通用问答、写作和行业资料整理。",
    tags: ["GLM", "通用问答", "办公助手"],
    features: ["内容生成", "多轮问答", "资料整理"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "讯飞星火",
    slug: "xinghuo",
    websiteUrl: "https://xinghuo.xfyun.cn/",
    categorySlug: "ai-productivity",
    description: "讯飞旗下大模型助手，覆盖对话、写作和教育办公场景。",
    detailedIntro:
      "讯飞星火强调对话、写作、知识问答和语音能力结合，适合办公与教育类内容场景。",
    tags: ["讯飞系", "语音能力", "知识问答"],
    features: ["通用问答", "内容生成", "语音结合"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "天工AI",
    slug: "tiangong-ai",
    websiteUrl: "https://www.tiangong.cn/",
    categorySlug: "ai-productivity",
    description: "面向搜索、问答和工具调用场景的国内 AI 助手。",
    detailedIntro:
      "天工AI 适合通用问答、联网检索和日常办公辅助，是国内综合型 AI 产品之一。",
    tags: ["联网搜索", "通用助手", "办公效率"],
    features: ["联网问答", "信息整理", "日常办公"]
  },
  {
    market: "china",
    name: "秘塔AI搜索",
    slug: "metaso",
    websiteUrl: "https://metaso.cn/",
    categorySlug: "ai-productivity",
    description: "主打无广告直达结果的 AI 搜索工具。",
    detailedIntro:
      "秘塔AI搜索适合研究、知识检索、文件问答和快速获取结构化答案，是国内 AI 搜索代表产品之一。",
    tags: ["AI搜索", "结果直达", "文件问答"],
    features: ["联网搜索", "文件理解", "结构化答案"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "文心一言",
    slug: "wenxin-yiyan",
    websiteUrl: "https://yiyan.baidu.com/",
    categorySlug: "ai-productivity",
    description: "百度推出的通用 AI 助手，覆盖问答、创作与办公场景。",
    detailedIntro:
      "文心一言是百度面向终端用户的对话产品，适合搜索增强、内容生成和通用办公场景。",
    tags: ["百度系", "通用对话", "内容生成"],
    features: ["问答总结", "内容创作", "办公辅助"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "腾讯混元",
    slug: "tencent-hunyuan",
    websiteUrl: "https://hunyuan.tencent.com/",
    categorySlug: "ai-productivity",
    description: "腾讯混元大模型入口，适合企业接入和多模态能力体验。",
    detailedIntro:
      "腾讯混元面向开发者和企业用户，覆盖文本、图像、视频等模型能力与解决方案场景。",
    tags: ["大模型平台", "企业接入", "多模态"],
    features: ["模型体验", "企业能力", "多模态方案"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "Monica",
    slug: "monica",
    websiteUrl: "https://monica.im/",
    categorySlug: "ai-productivity",
    description: "聚合多模型的全能 AI 助手，支持网页、桌面和移动端。",
    detailedIntro:
      "Monica 强调多模型整合、网页侧边栏、总结、写作和搜索增强，适合高频办公用户。",
    tags: ["多模型聚合", "浏览器助手", "AI搜索"],
    features: ["多模型聊天", "网页总结", "写作增强"]
  },
  {
    market: "china",
    name: "Manus",
    slug: "manus",
    websiteUrl: "https://manus.im/",
    categorySlug: "ai-productivity",
    description: "面向任务执行和结果交付的 AI Agent 产品。",
    detailedIntro:
      "Manus 主打 Hands On AI，强调生成网页、幻灯片、设计和执行复杂任务的 Agent 化体验。",
    tags: ["AI Agent", "任务执行", "结果交付"],
    features: ["任务代理", "网页生成", "幻灯片生成"],
    apiAvailable: true
  },
  {
    market: "china",
    name: "即梦AI",
    slug: "jimeng-ai",
    websiteUrl: "https://jimeng.jianying.com/",
    categorySlug: "ai-video",
    description: "字节系 AI 创作工具，覆盖视频和图像生成。",
    detailedIntro:
      "即梦AI 适合短视频创作者和营销团队做视频生成、图像生成和创意表达。",
    tags: ["字节系", "视频生成", "图像创作"],
    features: ["视频生成", "图片生成", "创意表达"]
  },
  {
    market: "china",
    name: "可灵AI",
    slug: "kling-ai",
    websiteUrl: "https://klingai.kuaishou.com/",
    categorySlug: "ai-video",
    description: "快手推出的 AI 视频生成平台。",
    detailedIntro:
      "可灵AI 适合文生视频、图生视频和镜头创意生成，是国内视频生成赛道的代表产品之一。",
    tags: ["快手系", "文生视频", "图生视频"],
    features: ["视频生成", "镜头创作", "创意表达"]
  },
  {
    market: "china",
    name: "海螺AI",
    slug: "hailuo-ai",
    websiteUrl: "https://hailuoai.com/",
    categorySlug: "ai-video",
    description: "面向视频、图片和音频创作的一体化 AI 创作空间。",
    detailedIntro:
      "海螺AI 覆盖视频、图片和音频工具，适合内容创作者、电商和营销场景进行视觉生产。",
    tags: ["AI视频", "图片创作", "创作者工具"],
    features: ["视频生成", "图片生成", "创作广场"]
  },
  {
    market: "china",
    name: "通义灵码",
    slug: "tongyi-lingma",
    websiteUrl: "https://lingma.aliyun.com/",
    categorySlug: "ai-coding",
    description: "阿里推出的 AI 编码助手，适合 IDE 内代码生成和解释。",
    detailedIntro:
      "通义灵码面向开发者提供代码补全、解释、测试和项目协作能力，是国内常见 AI 编程工具之一。",
    tags: ["阿里系", "IDE助手", "代码生成"],
    features: ["代码补全", "代码解释", "测试生成"]
  },
  {
    market: "china",
    name: "Trae",
    slug: "trae",
    websiteUrl: "https://www.trae.ai/",
    categorySlug: "ai-coding",
    description: "面向开发者的 AI 编程工作台，强调从想法到应用的生成流程。",
    detailedIntro:
      "Trae 聚焦 AI 编程与应用生成，适合原型开发、代码生成和开发流程提效。",
    tags: ["AI编程", "应用生成", "开发工作台"],
    features: ["代码生成", "原型搭建", "开发提效"]
  },
  {
    market: "china",
    name: "腾讯智影",
    slug: "tencent-zhiying",
    websiteUrl: "https://zenvideo.qq.com/",
    categorySlug: "ai-video",
    description: "腾讯推出的智能视频创作平台，适合口播和营销视频制作。",
    detailedIntro:
      "腾讯智影适合数字人口播、字幕、配音和企业宣传视频生产，是国内视频创作工具的重要入口。",
    tags: ["视频创作", "数字人", "字幕配音"],
    features: ["口播视频", "字幕生成", "配音制作"]
  },
  {
    market: "china",
    name: "AiPPT",
    slug: "aippt",
    websiteUrl: "https://www.aippt.cn/",
    categorySlug: "ai-design",
    description: "一句话生成 PPT 的 AI 演示工具，适合汇报和提案场景。",
    detailedIntro:
      "AiPPT 强调一键生成演示文稿、自动润色和智能排版，适合职场汇报和方案输出。",
    tags: ["PPT生成", "智能排版", "方案汇报"],
    features: ["PPT生成", "内容润色", "自动排版"]
  },
  {
    market: "china",
    name: "通义听悟",
    slug: "tongyi-tingwu",
    websiteUrl: "https://tingwu.aliyun.com/",
    categorySlug: "ai-productivity",
    description: "阿里系音视频转写与会议总结工具。",
    detailedIntro:
      "通义听悟适合会议纪要、访谈转写、课程记录和音视频内容整理，是典型的办公效率工具。",
    tags: ["会议纪要", "音视频转写", "内容整理"],
    features: ["实时转写", "会议总结", "内容提炼"]
  },
  {
    market: "china",
    name: "WHEE",
    slug: "whee",
    websiteUrl: "https://www.whee.com/",
    categorySlug: "ai-drawing",
    description: "美图推出的 AI 视觉创作工具。",
    detailedIntro:
      "WHEE 面向图片生成和视觉创意表达，适合海报、电商图和轻量设计类内容生产。",
    tags: ["AI绘图", "视觉创作", "美图系"],
    features: ["图片生成", "视觉风格", "创意出图"]
  }
];

export const officialTools = baseTools.map(buildTool);

export default officialTools;
