# GStack 实战指南 | 第6期 - 完整实战：用 GStack 从零开发一个 AI 日报生成器

> 🎯 前五篇文章讲完了 GStack 的所有核心技能，现在是时候真刀真枪地演示一遍了。本期我们将完整走通 GStack 的全流程，从零开发一个 **AI 日报生成器**——一个能自动聚合 RSS 新闻、用 AI 生成中文摘要并排版的实用小工具。

---

## 项目简介

**AI 日报生成器（Daily Digest）** 是一个 Web 应用，核心功能：

1. 用户配置几个关注的 RSS 源（如 Hacker News、V2EX、掘金）
2. 系统定时抓取 RSS 内容
3. 调用 OpenAI API 将英文标题翻译为中文，并生成精炼摘要
4. 生成一份排版精美的日报页面，支持分享

**技术栈**：Next.js 14 + Tailwind CSS + Supabase + OpenAI API

> 这个项目麻雀虽小五脏俱全：有前端页面、有后端 API、有数据库、有第三方集成——非常适合展示 GStack 全链路工作流。

---

## Phase 1：CEO 评审（`/plan-ceo-review`）

### 输入

```bash
/plan-ceo-review
我打算做一个 AI 日报生成器，帮用户聚合 RSS 新闻并用 AI 生成中文摘要。
计划支持以下功能：
1. 用户注册登录
2. 自定义 RSS 源管理（增删改查）
3. 定时抓取 RSS 内容
4. AI 翻译标题 + 生成摘要
5. 日报排版页面
6. 邮件推送日报
7. 微信公众号推送
8. 支持暗黑模式
9. 多语言切换（中/英/日）
10. 日报分享到社交媒体
```

### CEO 评审结果

```markdown
## CEO 评审报告

### 核心判定：9 个功能中砍掉 5 个

✅ **通过**：
- RSS 源管理（核心功能）
- 定时抓取 RSS 内容（核心功能）
- AI 翻译 + 摘要（核心差异化功能）
- 日报排版页面（核心展示层）

❌ **拒绝**：
- 用户注册登录 → MVP 阶段不需要，先做单用户版本
- 邮件推送 → 增加服务器成本和 SMTP 配置复杂度，后续迭代
- 微信公众号推送 → 需要公众号资质审核，周期太长
- 多语言切换 → 目标用户是中文开发者，无需支持日语
- 日报分享 → 生成静态 URL 即可，不需要社交媒体集成

⚠️ **有条件通过**：
- 暗黑模式 → Tailwind 原生支持 dark:，零成本，但优先级最低

### MVP 功能边界

用一句话描述你的 MVP：
> "一个单用户的 RSS 聚合工具，能自动抓取新闻，用 AI 生成中文摘要，
>  展示为一份排版精美的每日日报。"
```

> **复盘**：10 个功能被砍到 4+1 个。如果没有这道评审，你可能花两周搞用户系统和微信推送，核心的 AI 摘要功能反而没时间做好。

---

## Phase 2：架构评审（`/plan-eng-review`）

### 输入

```bash
/plan-eng-review
根据 CEO 评审通过的 MVP 需求（RSS 源管理、定时抓取、AI 摘要、日报页面），
请规划技术架构。技术栈：Next.js 14 + Tailwind CSS + Supabase + OpenAI API。
```

### Tech Lead 架构方案

```markdown
## 技术架构方案

### 项目结构

daily-digest/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页（今日日报）
│   │   ├── sources/
│   │   │   └── page.tsx          # RSS 源管理页
│   │   └── api/
│   │       ├── sources/
│   │       │   └── route.ts      # RSS 源 CRUD API
│   │       ├── fetch/
│   │       │   └── route.ts      # 手动触发抓取
│   │       └── cron/
│   │           └── route.ts      # 定时抓取（Vercel Cron）
│   ├── components/
│   │   ├── DigestCard.tsx        # 单条日报卡片
│   │   ├── SourceForm.tsx        # RSS 源表单
│   │   └── SourceList.tsx        # RSS 源列表
│   ├── lib/
│   │   ├── supabase.ts           # 数据库客户端
│   │   ├── rss.ts                # RSS 解析逻辑
│   │   └── ai.ts                 # OpenAI 摘要生成
│   └── types/
│       └── index.ts              # 类型定义
├── supabase/
│   └── migrations/
│       └── 001_init.sql          # 数据库迁移
└── vercel.json                   # Cron 配置

### 数据库设计

CREATE TABLE sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  url         TEXT NOT NULL UNIQUE,
  category    TEXT DEFAULT 'general',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id       UUID REFERENCES sources(id),
  original_title  TEXT NOT NULL,
  translated_title TEXT,
  original_url    TEXT NOT NULL UNIQUE,
  summary         TEXT,
  published_at    TIMESTAMPTZ,
  fetched_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_articles_date ON articles(published_at DESC);

### API 接口定义

| 接口 | 方法 | 入参 | 出参 |
|------|------|------|------|
| /api/sources | GET | - | Source[] |
| /api/sources | POST | { name, url, category } | Source |
| /api/sources/[id] | DELETE | - | { success: true } |
| /api/fetch | POST | { sourceId? } | { count: number } |
| /api/cron | GET | vercel-cron-secret | { ok: true } |

### ⚠️ 防坑警告

1. **RSS 解析**：使用 `rss-parser` 库，注意部分 RSS 源返回的是 Atom
   格式而非 RSS 2.0，需要兼容处理
2. **OpenAI 调用**：必须设置 30s timeout，且失败时 fallback 为原始标题
3. **去重逻辑**：用 `original_url` 的 UNIQUE 约束做幂等，
   INSERT ... ON CONFLICT DO NOTHING
4. **Cron 安全**：Vercel Cron 的回调需要验证
   `CRON_SECRET` header 防止被恶意触发
```

---

## Phase 3：编码实现

有了 CEO 砍好的需求边界和 Tech Lead 的架构蓝图，现在开始让 Claude 写代码。这里展示几段核心代码：

### 核心模块一：RSS 解析器

```typescript
// src/lib/rss.ts
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,  // 10s 超时，防止卡死
  headers: {
    'User-Agent': 'DailyDigest/1.0',  // 部分 RSS 源要求 UA
  },
});

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
}

export async function fetchRSSFeed(url: string): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: item.contentSnippet?.slice(0, 500),
    }));
  } catch (error) {
    console.error(`Failed to fetch RSS from ${url}:`, error);
    return [];  // 失败时返回空数组，不中断整体流程
  }
}
```

### 核心模块二：AI 摘要生成

```typescript
// src/lib/ai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,  // ⚠️ Tech Lead 要求：30s 超时
});

export async function generateSummary(
  title: string,
  content?: string
): Promise<{ translatedTitle: string; summary: string }> {
  try {
    const prompt = `
你是一个技术新闻编辑。请完成以下任务：
1. 将英文标题翻译为自然流畅的中文
2. 根据标题和内容片段，生成一句话中文摘要（不超过 80 字）

原始标题：${title}
${content ? `内容片段：${content}` : ''}

请以 JSON 格式返回：
{
  "translatedTitle": "中文标题",
  "summary": "一句话摘要"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  // 性价比最高的模型
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,  // 低温度 = 更准确的翻译
    });

    const result = JSON.parse(
      response.choices[0]?.message?.content || '{}'
    );
    return {
      translatedTitle: result.translatedTitle || title,
      summary: result.summary || '暂无摘要',
    };
  } catch (error) {
    // ⚠️ Tech Lead 要求：失败时 fallback 为原始标题
    console.error('AI summary generation failed:', error);
    return {
      translatedTitle: title,
      summary: '摘要生成失败，请查看原文',
    };
  }
}
```

### 核心模块三：日报卡片组件

```tsx
// src/components/DigestCard.tsx
interface DigestCardProps {
  translatedTitle: string;
  summary: string;
  originalUrl: string;
  sourceName: string;
  publishedAt: string;
}

export function DigestCard({
  translatedTitle,
  summary,
  originalUrl,
  sourceName,
  publishedAt,
}: DigestCardProps) {
  return (
    <a
      href={originalUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="digest-card"
      className="block p-6 rounded-2xl bg-white dark:bg-zinc-800
                 border border-zinc-200 dark:border-zinc-700
                 hover:shadow-lg hover:border-blue-300
                 transition-all duration-200 group"
    >
      {/* 来源标签 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 text-xs font-medium rounded-full
                         bg-blue-100 text-blue-700
                         dark:bg-blue-900 dark:text-blue-300">
          {sourceName}
        </span>
        <span className="text-xs text-zinc-400">
          {new Date(publishedAt).toLocaleDateString('zh-CN')}
        </span>
      </div>

      {/* 标题 */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100
                      group-hover:text-blue-600 dark:group-hover:text-blue-400
                      transition-colors line-clamp-2 mb-2">
        {translatedTitle}
      </h3>

      {/* 摘要 */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
        {summary}
      </p>

      {/* 阅读原文 */}
      <span className="mt-3 inline-flex items-center text-sm text-blue-500
                        group-hover:translate-x-1 transition-transform">
        阅读原文 →
      </span>
    </a>
  );
}
```

---

## Phase 4：代码审查（`/review`）

```bash
/review 请检查刚才实现的 RSS 解析器、AI 摘要生成器和日报卡片组件。
```

**审计报告摘录：**

```markdown
## 审计结果：1 个警告，2 条建议

### ⚠️ [WARN-01] AI 调用缺少重试机制
📍 位置：ai.ts:15

OpenAI API 偶尔会返回 429（限流）或 500 错误。
当前直接 fallback 为原始标题，体验不佳。

建议：添加指数退避重试（最多 3 次），只有最终失败才 fallback。

### 💡 [INFO-01] RSS 超时可配置化
建议将 timeout 从硬编码 10000 改为环境变量 RSS_FETCH_TIMEOUT。

### 💡 [INFO-02] DigestCard 缺少 aria-label
<a> 标签建议添加 aria-label={`阅读文章：${translatedTitle}`}。
```

修复后继续下一阶段。

---

## Phase 5：QA 验收（`/qa`）

```bash
/qa 打开 http://localhost:3000，执行以下测试：
1. 进入首页检查日报列表是否正常渲染
2. 点击 "管理源" 导航到 /sources 页面
3. 在表单中输入 RSS 源名称 "Hacker News"，
   URL 填 "https://hnrss.org/frontpage"
4. 点击"添加"按钮
5. 验证列表中是否出现了刚添加的源
6. 返回首页点击"手动抓取"按钮
7. 等待 10 秒后刷新，检查是否出现了新的日报卡片
8. 点击任意一张卡片，验证是否在新标签页打开了原文链接
```

**QA 报告：**

```markdown
## QA 测试报告：✅ 全部通过

| 步骤 | 操作 | 状态 |
|:---:|:---|:---:|
| 1 | 首页日报列表正常渲染 | ✅ |
| 2 | 导航到 /sources | ✅ |
| 3 | 填写 RSS 源表单 | ✅ |
| 4 | 点击添加按钮 | ✅ |
| 5 | 列表显示新源 | ✅ |
| 6 | 点击手动抓取 | ✅ |
| 7 | 刷新后出现日报卡片 | ✅ |
| 8 | 卡片链接正常跳转 | ✅ |

📊 8/8 测试通过，零错误，零控制台异常。
```

---

## Phase 6：一键发版（`/ship`）

```bash
/ship AI 日报生成器 MVP 开发完毕，请提交并创建 PR。
```

**自动生成的 Commit：**

```
feat(digest): implement AI-powered daily news digest generator

- Add RSS feed parser with timeout and error handling
- Add OpenAI-powered title translation and summary generation
- Add DigestCard component with dark mode support
- Add RSS source CRUD management page
- Add manual fetch trigger and Vercel Cron integration
- Configure Supabase schema with deduplication constraints
```

**PR 自动创建成功** ✅

---

## 六阶工作流总结

| 阶段 | 命令 | 耗时 | 产出 |
|:---:|:---:|:---:|:---|
| 产品评审 | `/plan-ceo-review` | 5 min | 10 → 5 个功能 |
| 架构规划 | `/plan-eng-review` | 10 min | 项目结构 + 数据库 + API |
| 编码实现 | 正常 Prompt | 2 h | 3 个核心模块 + 3 个组件 |
| 代码审查 | `/review` | 5 min | 1 警告 + 2 建议 |
| QA 验收 | `/qa` | 10 min | 8/8 测试通过 |
| 发版部署 | `/ship` | 3 min | 规范 Commit + PR |
| **总计** | | **~2.5 h** | **完整可用的 MVP** |

从需求到上线，一个人，2.5 小时。这就是 GStack 赋予独立开发者的超能力。

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：GStack实战指南系列 ｜ 更新日期：2025-04-18*
