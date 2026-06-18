import type { IconName } from "@/lib/mock/icon-map";

export type PriceModel = "Free" | "Freemium" | "Paid";
export type MockBadgeTone = "free" | "paid" | "api" | "plugin" | "new";

export interface MockToolFeature {
  title: string;
  description: string;
  icon: IconName;
}

export interface MockToolFaq {
  question: string;
  answer: string;
}

export interface MockToolDetailContent {
  overview: string[];
  features: MockToolFeature[];
  scenarios: string[];
  faqs: MockToolFaq[];
}

export interface MockTool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: IconName;
  category: string;
  tags: string[];
  priceModel: PriceModel;
  apiAvailable: boolean;
  isSponsored: boolean;
  website: string;
  developer: string;
  launchedAt: string;
  createdAt: string;
  rating: number;
  saves: number;
  viewCount: number;
  clickCount: number;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  icon: IconName;
  count: number;
  description: string;
  accent: string;
  focus: string;
  surface: string;
}

export type MockPostContentBlock =
  | {
      type: "heading";
      level?: 2 | 3;
      content: string;
    }
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "list";
      style?: "unordered" | "ordered";
      items: string[];
    }
  | {
      type: "quote";
      content: string;
    }
  | {
      type: "code";
      language: string;
      code: string;
    };

export interface MockPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  category: string;
  categorySlug: string;
  author: string;
  authorRole: string;
  readTime: string;
  viewCount: number;
  relatedToolIds: string[];
  content: MockPostContentBlock[];
}

export interface MockPostCategory {
  slug: string;
  name: string;
  count: number;
}

export interface ToolCardData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: IconName;
  logoUrl?: string | null;
  website: string;
  categorySlug: string;
  pricing: PriceModel;
  badges: Array<{
    label: string;
    tone: MockBadgeTone;
  }>;
  featured: boolean;
  rating?: number;
  saves?: number;
  updatedAt: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  useCases: string[];
  highlights: string[];
}

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  cover: string;
  viewCount: number;
  author: {
    name: string;
    role: string;
  };
}

const categorySeeds = [
  {
    id: "chatbots",
    name: "AI 对话",
    slug: "ai-chat",
    icon: "Bot" as IconName,
    description: "适合问答、研究、总结和通用工作流协作的智能助手工具。",
    accent: "from-brand/18 via-accent-coral/14 to-transparent",
    focus: "快速建立问答、总结和研究入口",
    surface: "from-brand/10 via-white to-accent-coral/10"
  },
  {
    id: "writing",
    name: "AI 文案",
    slug: "ai-copywriting",
    icon: "PenSquare" as IconName,
    description: "覆盖品牌文案、长文整理、脚本撰写和内容策划的写作工具。",
    accent: "from-accent-coral/18 via-brand/12 to-transparent",
    focus: "提升内容输出的一致性与效率",
    surface: "from-accent-coral/10 via-white to-brand/10"
  },
  {
    id: "image",
    name: "AI 绘画",
    slug: "ai-drawing",
    icon: "ImageIcon" as IconName,
    description: "面向视觉灵感、海报创意、图像生成和设计探索的工具集合。",
    accent: "from-accent-gold/24 via-brand-soft/16 to-transparent",
    focus: "缩短视觉灵感到设计落地的距离",
    surface: "from-accent-gold/12 via-white to-brand-soft/10"
  },
  {
    id: "video",
    name: "AI 视频",
    slug: "ai-video",
    icon: "Film" as IconName,
    description: "帮助团队完成视频生成、剪辑增强、镜头打样和内容生产。",
    accent: "from-accent-coral/16 via-accent-gold/14 to-transparent",
    focus: "更快验证视频创意和镜头表达",
    surface: "from-accent-coral/10 via-white to-accent-gold/10"
  },
  {
    id: "coding",
    name: "AI 编程",
    slug: "ai-coding",
    icon: "Code2" as IconName,
    description: "面向开发者的代码补全、项目问答、调试和重构类工具。",
    accent: "from-accent-mint/20 via-brand/12 to-transparent",
    focus: "在真实工程上下文中提升交付速度",
    surface: "from-accent-mint/10 via-white to-brand/10"
  },
  {
    id: "audio",
    name: "AI 音频",
    slug: "ai-audio",
    icon: "Mic2" as IconName,
    description: "适用于语音合成、声音设计、配音和音乐生成的创作工具。",
    accent: "from-brand-soft/24 via-accent-coral/14 to-transparent",
    focus: "让声音内容更自然可用、更便于传播",
    surface: "from-brand-soft/12 via-white to-accent-coral/10"
  },
  {
    id: "office",
    name: "效率办公",
    slug: "productivity",
    icon: "Workflow" as IconName,
    description: "用于知识整理、团队协作、研究归档和办公提效的 AI 工具。",
    accent: "from-brand/18 via-white to-transparent",
    focus: "把信息整理、搜索和协作串起来",
    surface: "from-brand/10 via-white to-white"
  },
  {
    id: "marketing",
    name: "营销增长",
    slug: "marketing",
    icon: "Globe2" as IconName,
    description: "服务于广告投放、内容营销、品牌传播和增长实验的工具。",
    accent: "from-accent-gold/20 via-accent-coral/14 to-transparent",
    focus: "服务增长、投放和品牌传播场景",
    surface: "from-accent-gold/10 via-white to-accent-coral/10"
  }
];

export const mockTools: MockTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    tagline: "全能型 AI 助手，适合问答、写作、分析和工作流整理",
    description: "适合内容创作、问题分析、方案草拟和团队知识整理，是最常见的 AI 工作入口之一。",
    logo: "Bot",
    category: "ai-chat",
    tags: ["工作流", "知识问答", "多场景"],
    priceModel: "Freemium",
    apiAvailable: true,
    isSponsored: true,
    website: "https://chatgpt.com",
    developer: "OpenAI",
    launchedAt: "2022-11-30",
    createdAt: "2026-03-16",
    rating: 4.9,
    saves: 25680,
    viewCount: 198400,
    clickCount: 56120
  },
  {
    id: "claude",
    name: "Claude",
    tagline: "擅长长文本理解与结构化写作的 AI 助手",
    description: "适合 PRD、访谈纪要、研究报告和品牌文案等高信息密度文本任务。",
    logo: "BrainCircuit",
    category: "ai-copywriting",
    tags: ["长文总结", "策略写作", "语气稳定"],
    priceModel: "Freemium",
    apiAvailable: true,
    isSponsored: false,
    website: "https://claude.ai",
    developer: "Anthropic",
    launchedAt: "2023-03-14",
    createdAt: "2026-03-14",
    rating: 4.8,
    saves: 19830,
    viewCount: 174800,
    clickCount: 48650
  },
  {
    id: "midjourney",
    name: "Midjourney",
    tagline: "高表现力图像生成工具，适合视觉概念探索",
    description: "适合设计师和内容团队快速生成风格化视觉、概念海报和灵感草图。",
    logo: "ImageIcon",
    category: "ai-drawing",
    tags: ["视觉创意", "海报灵感", "品牌风格"],
    priceModel: "Paid",
    apiAvailable: false,
    isSponsored: true,
    website: "https://www.midjourney.com",
    developer: "Midjourney",
    launchedAt: "2022-07-12",
    createdAt: "2026-03-15",
    rating: 4.7,
    saves: 17640,
    viewCount: 186200,
    clickCount: 51910
  },
  {
    id: "runway",
    name: "Runway",
    tagline: "AI 视频生成与编辑平台，适合营销内容打样",
    description: "可用于视频生成、镜头延展、素材处理和广告创意演示，适合内容与增长团队。",
    logo: "Film",
    category: "ai-video",
    tags: ["视频生成", "镜头延展", "广告素材"],
    priceModel: "Paid",
    apiAvailable: true,
    isSponsored: true,
    website: "https://runwayml.com",
    developer: "Runway",
    launchedAt: "2023-06-15",
    createdAt: "2026-03-11",
    rating: 4.6,
    saves: 12890,
    viewCount: 140600,
    clickCount: 39820
  },
  {
    id: "cursor",
    name: "Cursor",
    tagline: "面向工程团队的 AI 编辑器，聚焦真实代码上下文",
    description: "提供代码补全、项目问答、重构建议和跨文件上下文理解能力。",
    logo: "Code2",
    category: "ai-coding",
    tags: ["代码补全", "项目问答", "重构"],
    priceModel: "Freemium",
    apiAvailable: false,
    isSponsored: false,
    website: "https://www.cursor.com",
    developer: "Anysphere",
    launchedAt: "2023-03-10",
    createdAt: "2026-03-17",
    rating: 4.8,
    saves: 16420,
    viewCount: 162700,
    clickCount: 47240
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    tagline: "集成在开发流程中的 AI 编程助手",
    description: "适合在 IDE 中完成代码补全、测试生成和代码解释等工程任务。",
    logo: "Code2",
    category: "ai-coding",
    tags: ["IDE 集成", "代码建议", "测试生成"],
    priceModel: "Paid",
    apiAvailable: false,
    isSponsored: false,
    website: "https://github.com/features/copilot",
    developer: "GitHub",
    launchedAt: "2021-06-29",
    createdAt: "2026-03-09",
    rating: 4.5,
    saves: 14270,
    viewCount: 133200,
    clickCount: 36570
  },
  {
    id: "roblox-gui-maker",
    name: "Roblox GUI Maker",
    tagline: "用提示词生成 Roblox Studio GUI 与 Lua 起步代码",
    description: "适合设计 Roblox 菜单、HUD、商店、库存界面和移动端预览，并快速导出可继续调整的 Lua Starter Code。",
    logo: "Code2",
    category: "ai-coding",
    tags: ["Roblox GUI", "Lua 代码", "游戏 UI"],
    priceModel: "Free",
    apiAvailable: false,
    isSponsored: false,
    website: "https://robloxguimaker.dev/",
    developer: "Roblox GUI Maker",
    launchedAt: "2026-06-01",
    createdAt: "2026-06-18",
    rating: 4.3,
    saves: 6240,
    viewCount: 58400,
    clickCount: 12960
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    tagline: "高拟真语音合成与角色配音工具",
    description: "适合课程配音、播客旁白、多语言语音生成和角色声音设计。",
    logo: "Mic2",
    category: "ai-audio",
    tags: ["配音", "语音克隆", "多语言"],
    priceModel: "Freemium",
    apiAvailable: true,
    isSponsored: false,
    website: "https://elevenlabs.io",
    developer: "ElevenLabs",
    launchedAt: "2023-01-23",
    createdAt: "2026-03-13",
    rating: 4.6,
    saves: 11990,
    viewCount: 128900,
    clickCount: 34110
  },
  {
    id: "suno",
    name: "Suno",
    tagline: "一句话生成完整歌曲，适合创意灵感和传播实验",
    description: "帮助团队快速生成歌曲 demo、短视频配乐和轻量音乐创意方案。",
    logo: "Sparkles",
    category: "ai-audio",
    tags: ["音乐生成", "短视频配乐", "创意实验"],
    priceModel: "Freemium",
    apiAvailable: false,
    isSponsored: false,
    website: "https://suno.com",
    developer: "Suno",
    launchedAt: "2023-12-20",
    createdAt: "2026-03-08",
    rating: 4.4,
    saves: 9630,
    viewCount: 98700,
    clickCount: 25520
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    tagline: "嵌入知识库与协作空间的 AI 办公助手",
    description: "适合会议纪要、知识库整理、任务拆解和团队文档协作。",
    logo: "Workflow",
    category: "productivity",
    tags: ["知识管理", "会议纪要", "团队协作"],
    priceModel: "Paid",
    apiAvailable: false,
    isSponsored: false,
    website: "https://www.notion.so/product/ai",
    developer: "Notion",
    launchedAt: "2023-02-22",
    createdAt: "2026-03-12",
    rating: 4.5,
    saves: 13240,
    viewCount: 121400,
    clickCount: 29630
  },
  {
    id: "perplexity",
    name: "Perplexity",
    tagline: "以搜索和研究为核心的 AI 答案引擎",
    description: "适合快速查资料、梳理竞品信息和生成带来源的研究摘要。",
    logo: "Search",
    category: "productivity",
    tags: ["AI 搜索", "研究分析", "来源引用"],
    priceModel: "Freemium",
    apiAvailable: false,
    isSponsored: true,
    website: "https://www.perplexity.ai",
    developer: "Perplexity",
    launchedAt: "2022-12-07",
    createdAt: "2026-03-18",
    rating: 4.7,
    saves: 17160,
    viewCount: 176300,
    clickCount: 49380
  },
  {
    id: "jasper",
    name: "Jasper",
    tagline: "面向营销团队的 AI 文案与 Campaign 生成工具",
    description: "适合广告文案、邮件营销、品牌内容和多渠道 Campaign 素材生成。",
    logo: "Globe2",
    category: "marketing",
    tags: ["广告文案", "Campaign", "品牌内容"],
    priceModel: "Paid",
    apiAvailable: true,
    isSponsored: true,
    website: "https://www.jasper.ai",
    developer: "Jasper",
    launchedAt: "2021-02-01",
    createdAt: "2026-03-10",
    rating: 4.5,
    saves: 10860,
    viewCount: 117500,
    clickCount: 31220
  },
  {
    id: "canva-magic-design",
    name: "Canva Magic Design",
    tagline: "适合非设计团队快速生成图文素材与演示视觉",
    description: "可快速产出社媒图、演示稿视觉和多尺寸营销素材，适合轻量设计场景。",
    logo: "Compass",
    category: "ai-drawing",
    tags: ["社媒素材", "演示视觉", "轻量设计"],
    priceModel: "Freemium",
    apiAvailable: false,
    isSponsored: false,
    website: "https://www.canva.com/magic-design/",
    developer: "Canva",
    launchedAt: "2023-09-21",
    createdAt: "2026-03-07",
    rating: 4.3,
    saves: 9260,
    viewCount: 89500,
    clickCount: 21780
  }
];

export const mockCategories: MockCategory[] = categorySeeds.map((category) => ({
  ...category,
  count: mockTools.filter((tool) => tool.category === category.slug).length
}));

function createPostContent(input: {
  introduction: string[];
  checklist: string[];
  quote: string;
  code?: {
    language: string;
    code: string;
  };
  closing: string[];
}): MockPostContentBlock[] {
  return [
    { type: "heading", level: 2, content: "问题背景" },
    ...input.introduction.map((item) => ({ type: "paragraph", content: item } as const)),
    { type: "heading", level: 2, content: "实操清单" },
    { type: "list", style: "unordered", items: input.checklist },
    { type: "quote", content: input.quote },
    ...(input.code
      ? [
          { type: "heading", level: 2, content: "示例片段" } as const,
          { type: "code", language: input.code.language, code: input.code.code } as const
        ]
      : []),
    { type: "heading", level: 2, content: "落地建议" },
    ...input.closing.map((item) => ({ type: "paragraph", content: item } as const))
  ];
}

export const mockPosts: MockPost[] = [
  {
    id: "post-1",
    slug: "ai-tools-stack-2026",
    title: "AI 工具栈怎么搭，才不会越用越乱？",
    excerpt: "从对话、搜索、写作到设计和编程，拆出一套适合团队落地的 AI 工具栈思路。",
    coverImage: "from-brand/25 via-accent-gold/20 to-transparent",
    date: "2026-03-12",
    category: "工具策略",
    categorySlug: "tool-strategy",
    author: "Nova Lin",
    authorRole: "内容策略顾问",
    readTime: "8 分钟",
    viewCount: 18420,
    relatedToolIds: ["chatgpt", "claude", "perplexity"],
    content: createPostContent({
      introduction: [
        "团队搭建 AI 工具栈时，最大的问题通常不是工具不够，而是入口太多、角色边界太模糊。ChatGPT 适合做通用入口，Perplexity 更适合做搜索与研究，Claude 则适合长文本整理。",
        "如果所有成员都在不同平台里重复做相似事情，知识会迅速碎片化。更合理的方式是先确定核心场景，再决定由哪个工具承担主入口。"
      ],
      checklist: [
        "先定义团队里最高频的三类任务，再分别选择主力工具。",
        "把搜索、写作、设计、开发分成不同工作段，而不是让一个工具覆盖全部。",
        "为通用提示词、资料来源和输出模板建立统一规范。"
      ],
      quote:
        "真正有效的 AI 工具栈不是工具数量最多，而是协作切换成本最低。",
      code: {
        language: "bash",
        code: "research -> Perplexity\noutline -> ChatGPT\nrefine-long-form -> Claude\npublish -> Notion AI"
      },
      closing: [
        "实际落地时，可以先从一个团队先行试点，再把成熟流程逐步复制到其他角色。",
        "判断工具是否应该继续保留，关键不是新不新，而是它能否稳定进入日常流程。"
      ]
    })
  },
  {
    id: "post-2",
    slug: "best-ai-writing-tools",
    title: "AI 文案工具怎么选：速度、质量和协作体验的平衡",
    excerpt: "如果你做内容、运营或咨询，这篇文章会帮你更快判断哪类写作工具适合自己的工作节奏。",
    coverImage: "from-accent-coral/25 via-brand/15 to-transparent",
    date: "2026-03-10",
    category: "AI 文案",
    categorySlug: "ai-copywriting",
    author: "Mika Zhou",
    authorRole: "内容编辑",
    readTime: "6 分钟",
    viewCount: 14260,
    relatedToolIds: ["claude", "chatgpt", "jasper"],
    content: createPostContent({
      introduction: [
        "很多团队选择 AI 文案工具时，只看出稿速度。但在真实协作里，最关键的是结构稳定性、改稿成本和多人协作时的风格一致性。",
        "Claude 适合处理长文结构和复杂上下文，ChatGPT 适合大多数日常文案场景，Jasper 则更贴近营销 Campaign 和品牌语气管理。"
      ],
      checklist: [
        "把“写得快”与“改得少”分开评估。",
        "用同一份 brief 对多个工具进行盲测，比较输出稳定性。",
        "为团队建立统一提示词模板，避免每个人都从零开始。"
      ],
      quote: "协作体验好的文案工具，最终节省的是编辑时间，而不是首稿生成时间。",
      code: {
        language: "markdown",
        code: "## Brief\n- Audience: SaaS growth team\n- Goal: drive demo sign-ups\n- Tone: concise, practical, credible"
      },
      closing: [
        "如果团队内容类型比较杂，建议先用通用能力强的工具，再为营销场景补充专项工具。",
        "越早把提示词模板沉淀成团队资产，后续的输出质量越稳定。"
      ]
    })
  },
  {
    id: "post-3",
    slug: "designers-ai-image-playbook",
    title: "设计师如何把 AI 绘画工具真正用进工作流",
    excerpt: "AI 图像工具最适合概念探索与方向验证，而不是简单代替完整设计流程。",
    coverImage: "from-accent-gold/30 via-brand-soft/20 to-transparent",
    date: "2026-03-07",
    category: "AI 绘画",
    categorySlug: "ai-drawing",
    author: "Rico Han",
    authorRole: "视觉策划",
    readTime: "7 分钟",
    viewCount: 12810,
    relatedToolIds: ["midjourney", "canva-magic-design"],
    content: createPostContent({
      introduction: [
        "Midjourney 这类工具最适合做风格探索和概念验证，而 Canva Magic Design 更适合把视觉方向快速扩展成可用素材。",
        "如果直接把 AI 图像输出当成最终成品，很容易陷入细节不可控的问题。更稳妥的方式，是把它作为前期灵感加速器。"
      ],
      checklist: [
        "先明确风格、构图、色调三个变量，再让工具去组合变化。",
        "建立自己的提示词模板库，减少每次从零试错。",
        "将最终输出带回设计软件里继续精修，而不是停在 AI 初稿。"
      ],
      quote: "AI 绘画最有价值的地方，不是替代设计，而是放大试错速度。",
      code: {
        language: "text",
        code: "prompt = cinematic poster, warm contrast, editorial layout, premium SaaS brand"
      },
      closing: [
        "团队如果需要稳定交付，最好把 AI 工具放在前期探索和素材延展阶段。",
        "对于品牌项目，仍然需要人工把控最终风格和细节统一性。"
      ]
    })
  },
  {
    id: "post-4",
    slug: "coding-with-ai-workflow",
    title: "AI 编程工作流实战：从补全到重构的高效配合方式",
    excerpt: "把 AI 编程工具接入真实工程时，最重要的不是速度，而是上下文理解与协作边界。",
    coverImage: "from-brand-soft/30 via-brand/15 to-transparent",
    date: "2026-03-04",
    category: "AI 编程",
    categorySlug: "ai-coding",
    author: "Ethan Wu",
    authorRole: "工程效率负责人",
    readTime: "9 分钟",
    viewCount: 16900,
    relatedToolIds: ["cursor", "github-copilot", "chatgpt"],
    content: createPostContent({
      introduction: [
        "Cursor 适合项目级理解与重构，GitHub Copilot 适合在 IDE 内做持续补全，ChatGPT 更适合离线分析复杂方案和错误日志。",
        "只把 AI 当成补全工具，会浪费它在解释代码、整理上下文和制定重构方案上的价值。"
      ],
      checklist: [
        "补全、解释、重构和代码审查分别交给最合适的工具。",
        "为 AI 提供尽可能明确的模块边界、接口约束和测试目标。",
        "所有自动生成代码都必须回到测试和 review 流程中验证。"
      ],
      quote: "AI 编程的瓶颈不在生成速度，而在是否理解项目上下文和工程约束。",
      code: {
        language: "ts",
        code: "const plan = {\n  task: 'refactor auth module',\n  constraints: ['keep API stable', 'add tests'],\n  files: ['src/auth/*']\n};"
      },
      closing: [
        "在团队内部，最好给 AI 工具设定清晰的使用边界，例如只生成测试、只辅助重构、或只做探索性实现。",
        "工具之间的配合方式比单个工具的能力上限更重要。"
      ]
    })
  },
  {
    id: "post-5",
    slug: "ai-video-production-playbook",
    title: "AI 视频工具怎么接进内容生产：从脚本到镜头打样",
    excerpt: "把 AI 视频工具放在脚本验证和镜头打样阶段，通常比直接追求成片更有效。",
    coverImage: "from-accent-coral/20 via-accent-gold/18 to-transparent",
    date: "2026-03-02",
    category: "AI 视频",
    categorySlug: "ai-video",
    author: "Livia Chen",
    authorRole: "视频增长经理",
    readTime: "7 分钟",
    viewCount: 11360,
    relatedToolIds: ["runway", "chatgpt"],
    content: createPostContent({
      introduction: [
        "Runway 这类工具最适合做镜头节奏验证、场景打样和素材补足，而不是一开始就承诺替代完整视频制作链路。",
        "如果把 AI 视频放在创意验证前端，营销团队能更快判断一个脚本是否值得投入正式拍摄。"
      ],
      checklist: [
        "先用 ChatGPT 生成脚本和镜头拆解，再进入 Runway 打样。",
        "把 AI 视频输出当成可视化草稿，而不是最终成片。",
        "对需要品牌质感和真人表现的内容，保留人工后期。"
      ],
      quote: "AI 视频真正节省的，是创意试错成本，而不是所有制作成本。",
      code: {
        language: "json",
        code: "{\n  \"goal\": \"launch teaser\",\n  \"shots\": 5,\n  \"tone\": \"clean, premium, energetic\"\n}"
      },
      closing: [
        "如果团队现在还没有稳定的视频流程，建议先用 AI 做预演和提案，而不是直接承担交付。",
        "当镜头语言和节奏稳定后，再决定是否加深自动化。"
      ]
    })
  },
  {
    id: "post-6",
    slug: "notion-ai-team-knowledge-base",
    title: "用 Notion AI 搭团队知识库，避免资料越来越散",
    excerpt: "知识库不是把资料堆进去，而是让搜索、总结和协作都能在一个地方发生。",
    coverImage: "from-brand/20 via-white to-accent-mint/12",
    date: "2026-02-28",
    category: "效率办公",
    categorySlug: "productivity",
    author: "Dennis Xu",
    authorRole: "知识管理顾问",
    readTime: "6 分钟",
    viewCount: 9480,
    relatedToolIds: ["notion-ai", "perplexity"],
    content: createPostContent({
      introduction: [
        "Notion AI 的优势不在于单次写作，而在于它和知识库本身是绑定的。团队会议纪要、项目文档、标准流程都能在同一个空间被查询和复用。",
        "Perplexity 更适合外部研究，Notion AI 更适合内部沉淀。把两者配合起来，能把“搜索”变成“沉淀”。"
      ],
      checklist: [
        "先统一文档命名和目录结构，再启用 AI 总结能力。",
        "高频模板如会议纪要、周报、项目复盘要固定下来。",
        "明确哪些信息来自内部知识库，哪些来自外部研究。"
      ],
      quote: "知识库真正的价值，不是保存资料，而是让资料持续被找到和复用。",
      closing: [
        "知识管理类工具最怕一开始设计得太复杂，结果没有人愿意维护。",
        "先把团队最常用的三类文档做稳定，再逐步扩展到更多场景。"
      ]
    })
  },
  {
    id: "post-7",
    slug: "perplexity-research-workflow",
    title: "Perplexity 研究流怎么搭：把搜索结果变成可执行结论",
    excerpt: "研究效率的关键不是搜到更多链接，而是更快提炼出下一步行动。",
    coverImage: "from-brand-soft/18 via-white to-brand/18",
    date: "2026-02-25",
    category: "工具策略",
    categorySlug: "tool-strategy",
    author: "Lena Gu",
    authorRole: "行业研究员",
    readTime: "5 分钟",
    viewCount: 8760,
    relatedToolIds: ["perplexity", "chatgpt"],
    content: createPostContent({
      introduction: [
        "Perplexity 的价值在于缩短信息收集到结构化结论之间的距离。它比传统搜索更适合快速梳理竞品、趋势和基础判断。",
        "如果后续还需要二次提炼，可以把 Perplexity 的输出交给 ChatGPT 继续做总结、对比或表达优化。"
      ],
      checklist: [
        "先把研究问题写成明确的判断题，而不是宽泛主题。",
        "区分“找事实”与“做结论”两个阶段。",
        "把可引用来源和需要人工复核的信息分开标记。"
      ],
      quote: "研究提速的重点，不是减少阅读，而是减少无效阅读。",
      code: {
        language: "text",
        code: "Question -> Source scan -> Evidence notes -> Summary -> Action list"
      },
      closing: [
        "对于管理层汇报或业务判断，最后一轮结论仍然建议人工确认。",
        "把研究过程模板化之后，团队内部的研究效率会明显提升。"
      ]
    })
  },
  {
    id: "post-8",
    slug: "ai-audio-brand-storytelling",
    title: "AI 音频怎么用于品牌内容：从配音到声音资产",
    excerpt: "音频类 AI 工具最适合帮助团队搭建可复用的声音表达，而不是只做一次性配音。",
    coverImage: "from-accent-coral/18 via-brand-soft/18 to-transparent",
    date: "2026-02-21",
    category: "AI 音频",
    categorySlug: "ai-audio",
    author: "Ivy Shen",
    authorRole: "内容制作人",
    readTime: "6 分钟",
    viewCount: 8140,
    relatedToolIds: ["elevenlabs", "suno"],
    content: createPostContent({
      introduction: [
        "ElevenLabs 更适合稳定配音和多语言版本输出，Suno 更适合做旋律草稿和传播性强的声音实验。",
        "如果品牌开始重视播客、短视频旁白或课程内容，音频工具的价值会比想象中更高。"
      ],
      checklist: [
        "先定义品牌语气、语速和使用场景。",
        "把常用旁白、片头片尾和 CTA 做成固定模板。",
        "音乐生成适合做灵感和试验，不一定适合作为最终商用版本。"
      ],
      quote: "声音一旦标准化，就能成为品牌识别的一部分，而不仅仅是内容附属品。",
      closing: [
        "和视觉一样，音频风格也值得建立可复用模板库。",
        "如果要进入正式商用，版权和授权边界必须提前确认。"
      ]
    })
  },
  {
    id: "post-9",
    slug: "marketing-team-jasper-playbook",
    title: "营销团队如何用 Jasper 做活动物料批量化生产",
    excerpt: "当投放素材和多渠道文案开始成倍增长，专项营销工具会比通用助手更稳定。",
    coverImage: "from-accent-gold/18 via-accent-coral/18 to-transparent",
    date: "2026-02-18",
    category: "营销增长",
    categorySlug: "marketing",
    author: "Cathy Wu",
    authorRole: "增长运营经理",
    readTime: "6 分钟",
    viewCount: 7920,
    relatedToolIds: ["jasper", "chatgpt", "canva-magic-design"],
    content: createPostContent({
      introduction: [
        "如果团队日常要处理广告文案、邮件标题、落地页摘要和多平台 campaign 变体，Jasper 这类工具会比通用助手更适合营销生产线。",
        "通用助手适合策略讨论和方向探索，Jasper 更适合把营销语言稳定地复制到多个渠道。"
      ],
      checklist: [
        "先沉淀品牌语气和核心卖点，再开始批量生成。",
        "把素材结构拆成标题、主文案、CTA、变体四层。",
        "设计团队可以用 Canva Magic Design 快速配合输出视觉变体。"
      ],
      quote: "专项营销工具的优势不在写得多，而在写得像同一个品牌。",
      closing: [
        "如果增长团队已经有成熟投放节奏，专项营销工具会明显降低物料准备压力。",
        "但品牌底层表达仍然需要由人来校准和拍板。"
      ]
    })
  },
  {
    id: "post-10",
    slug: "compare-chatgpt-vs-claude-for-product-teams",
    title: "产品团队该选 ChatGPT 还是 Claude？先看任务结构",
    excerpt: "同样是通用型 AI 助手，两者更适合的任务并不完全一样，关键在于你的工作结构。",
    coverImage: "from-brand/16 via-accent-coral/16 to-transparent",
    date: "2026-02-14",
    category: "工具策略",
    categorySlug: "tool-strategy",
    author: "Aria Tang",
    authorRole: "产品运营",
    readTime: "5 分钟",
    viewCount: 7550,
    relatedToolIds: ["chatgpt", "claude"],
    content: createPostContent({
      introduction: [
        "如果你的主要工作是头脑风暴、拆问题、做方案草稿，ChatGPT 通常更灵活。若你经常处理访谈纪要、PRD、方案整合，Claude 往往更稳。",
        "产品团队不一定要二选一，而是先把高频任务拆开，再决定谁做主入口、谁做补位工具。"
      ],
      checklist: [
        "头脑风暴和快速问答优先测试 ChatGPT。",
        "长文整理和复杂上下文优先测试 Claude。",
        "不要用一次体验决定长期协作工具。"
      ],
      quote: "选择 AI 助手时，任务结构比口碑更重要。",
      closing: [
        "对于产品团队来说，工具稳定性和协作效率比单次惊艳输出更关键。",
        "先围绕最常见的文档和会议流试用，判断成本最低。"
      ]
    })
  }
];

const postCategorySeed = [
  { slug: "tool-strategy", name: "工具策略" },
  { slug: "ai-copywriting", name: "AI 文案" },
  { slug: "ai-drawing", name: "AI 绘画" },
  { slug: "ai-coding", name: "AI 编程" },
  { slug: "ai-video", name: "AI 视频" },
  { slug: "productivity", name: "效率办公" },
  { slug: "ai-audio", name: "AI 音频" },
  { slug: "marketing", name: "营销增长" }
];

export const mockPostCategories: MockPostCategory[] = postCategorySeed
  .map((category) => ({
    ...category,
    count: mockPosts.filter((post) => post.categorySlug === category.slug).length
  }))
  .filter((category) => category.count > 0)
  .sort((a, b) => b.count - a.count);

export const hotSearchKeywords = ["AI绘画", "AI文案", "AI视频", "AI编程"];

export const featuredMockTools = [...mockTools]
  .sort((a, b) => Number(b.isSponsored) - Number(a.isSponsored) || b.rating - a.rating)
  .slice(0, 8);

export const latestMockTools = [...mockTools]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 8);

export const latestMockPosts = [...mockPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const popularMockTools = [...mockTools]
  .sort((a, b) => b.clickCount - a.clickCount)
  .slice(0, 5);

export function getMockToolById(id: string) {
  return mockTools.find((tool) => tool.id === id);
}

export function getMockCategoryBySlug(slug: string) {
  return mockCategories.find((category) => category.slug === slug);
}

export function getMockCategoryById(slug: string) {
  return mockCategories.find((category) => category.slug === slug);
}

export function getMockToolsByCategorySlug(slug: string) {
  return mockTools.filter((tool) => tool.category === slug);
}

export function getMockPostBySlug(slug: string) {
  return mockPosts.find((post) => post.slug === slug);
}

export function getMockPostsByCategorySlug(slug: string) {
  return latestMockPosts.filter((post) => post.categorySlug === slug);
}

export function getMockPostsByToolId(toolId: string) {
  return latestMockPosts.filter((post) => post.relatedToolIds.includes(toolId));
}

export function getMockRelatedPosts(currentPost: MockPost, limit = 4) {
  const sameCategory = latestMockPosts.filter(
    (post) => post.slug !== currentPost.slug && post.categorySlug === currentPost.categorySlug
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const fallback = latestMockPosts.filter(
    (post) =>
      post.slug !== currentPost.slug &&
      post.categorySlug !== currentPost.categorySlug &&
      !sameCategory.some((item) => item.slug === post.slug)
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}

export function getMockPostNeighbors(slug: string) {
  const currentIndex = latestMockPosts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return {
      previousPost: undefined,
      nextPost: undefined
    };
  }

  return {
    previousPost: latestMockPosts[currentIndex - 1],
    nextPost: latestMockPosts[currentIndex + 1]
  };
}

export function getCategoryTheme(slug: string) {
  const category = getMockCategoryBySlug(slug);

  return {
    accent: category?.accent ?? "from-brand/14 via-white to-transparent",
    surface: category?.surface ?? "from-brand/8 via-white to-transparent"
  };
}

/**
 * 将 mock 工具数据转换为 ToolCard 所需的展示结构。
 */
export function mapMockToolToCard(tool: MockTool): ToolCardData {
  return {
    id: tool.id,
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    icon: tool.logo,
    website: tool.website,
    categorySlug: tool.category,
    pricing: tool.priceModel,
    badges: [
      {
        label: tool.priceModel === "Freemium" ? "免费试用" : tool.priceModel === "Free" ? "免费" : "付费",
        tone: tool.priceModel === "Paid" ? "paid" : "free"
      },
      ...(tool.apiAvailable ? [{ label: "API", tone: "api" as const }] : []),
      ...tool.tags.slice(0, 2).map((tag) => ({
        label: tag,
        tone: "plugin" as const
      })),
      ...(tool.isSponsored ? [{ label: "推荐", tone: "new" as const }] : [])
    ],
    featured: tool.isSponsored,
    rating: tool.rating,
    saves: tool.saves,
    updatedAt: tool.createdAt,
    useCases: tool.tags,
    highlights: tool.tags
  };
}

/**
 * 将 mock 文章数据转换为 PostCard 所需的展示结构。
 */
export function mapMockPostToCard(post: MockPost): PostCardData {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.date,
    readTime: post.readTime,
    cover: post.coverImage,
    viewCount: post.viewCount,
    author: {
      name: post.author,
      role: post.authorRole
    }
  };
}

/**
 * 生成工具详情页展示所需的介绍、特点、场景和 FAQ。
 */
export function getMockToolDetailContent(
  tool: MockTool,
  categoryName?: string
): MockToolDetailContent {
  const primaryTag = tool.tags[0] ?? "效率提升";
  const secondaryTag = tool.tags[1] ?? "团队协作";
  const tertiaryTag = tool.tags[2] ?? "业务落地";

  return {
    overview: [
      `${tool.name} 是一款面向 ${categoryName ?? "AI 工具"} 场景的产品，核心价值在于帮助用户把 ${primaryTag} 这类高频任务做得更快、更稳定。它适合个人创作者、业务团队，以及希望快速验证想法的产品或运营角色。`,
      `从上手门槛来看，${tool.name} 的体验更偏向“先产出，再细调”。你可以先用它完成初稿、灵感探索或信息整理，再把结果带回正式工作流里继续加工。`,
      `如果你在意的是 ${secondaryTag} 与 ${tertiaryTag} 之间的平衡，那么这类工具通常比单点工具更灵活。当前详情页使用 mock 数据，后续可以接入真实评测、截图、版本记录和用户反馈。`
    ],
    features: [
      {
        title: `围绕 ${primaryTag} 的高频能力`,
        description: `${tool.name} 会优先覆盖 ${primaryTag} 相关任务，适合处理用户最常重复的工作，并在较短时间内给出可继续编辑的结果。`,
        icon: "Sparkles"
      },
      {
        title: `适合 ${categoryName ?? "当前分类"} 工作流`,
        description: "相比孤立的小工具，它更适合嵌入完整工作流中使用，尤其是需要同时兼顾效率、质量和协作衔接的场景。",
        icon: "Workflow"
      },
      {
        title: tool.apiAvailable ? "支持 API 扩展" : "更适合轻量上手",
        description: tool.apiAvailable
          ? "如果后续要接入自动化、知识库或业务系统，这个工具具备进一步扩展的空间。"
          : "即使不写代码，也能比较快把它纳入日常使用流程，适合先验证价值再决定是否深入。",
        icon: tool.apiAvailable ? "Code2" : "Compass"
      }
    ],
    scenarios: [
      `当你需要快速完成 ${primaryTag} 相关任务，但又不希望从零准备素材时，可以优先尝试 ${tool.name}。`,
      `如果团队正在搭建 ${categoryName ?? "当前分类"} 工具栈，${tool.name} 更适合作为高频入口或关键补位工具。`,
      `在需要兼顾输出速度、基础质量和后续协作的情况下，${tool.name} 会比一次性工具更容易沉淀成稳定流程。`
    ],
    faqs: [
      {
        question: `${tool.name} 更适合什么类型的用户？`,
        answer:
          "它比较适合需要高频使用 AI 的个人创作者、运营、产品、市场和轻技术团队。重点不只是“能不能用”，而是能否持续融入真实工作流。"
      },
      {
        question: `${tool.name} 值得作为主力工具吗？`,
        answer: `如果你的主要需求和 ${primaryTag}、${secondaryTag} 高度相关，而且希望在效率和灵活性之间取得平衡，那么它很适合作为主力之一。`
      },
      {
        question: "后续如果接入真实数据，详情页还能扩展什么？",
        answer:
          "可以继续增加版本更新记录、用户评价、截图画廊、优缺点分析、相似工具对比，以及收藏和点击行为统计。"
      }
    ]
  };
}
