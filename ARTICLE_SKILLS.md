# 文章 Skills 使用指南

本项目使用三个职责分离的文章 Skill，分别处理内容规划、技术文章写作和微信公众号交付。项目根目录的 `AGENTS.md` 是最高规则，Skill 的具体流程不得覆盖其中的角色、封面、日期及其他专项约束。

## 快速选择

```text
文章相关需求
├── 只做选题、系列规划或大纲
│   └── article-writing
└── 写作、改写或审校正文
    ├── 明确要求微信公众号内容或发布
    │   └── wechat-article-writer
    └── 普通技术文章、博客或教程
        └── tech-article-expert
```

| 需求 | 使用 Skill |
|------|------------|
| 推荐下一篇选题、规划系列、评估选题、设计大纲 | `article-writing` |
| 写技术博客、教程、架构文章、安全分析或项目复盘 | `tech-article-expert` |
| 审稿、改写、润色、去 AI 语气 | `tech-article-expert` |
| 写公众号文章、微信推文、公众号版本或发布到草稿箱 | `wechat-article-writer` |

Skill 通常根据请求内容自动触发。需要明确指定时，直接在请求中写出 Skill 名称和目标即可。

## 1. article-writing

### 职责

负责正文写作之前的内容决策：

- 盘点现有文章和系列进度
- 推荐和评估候选选题
- 规划系列篇目与知识梯度
- 明确目标读者、核心问题和内容边界
- 输出文章大纲及素材准备清单

它不负责完整正文、文章排版和最终润色。

### 使用示例

```text
使用 article-writing 扫描现有 Flutter 工具系列，推荐接下来最值得写的 3 个选题。
```

```text
评估“Flutter Impeller 渲染原理”这个选题是否适合当前目录，并给出文章大纲。
```

```text
为 Node.js 性能优化规划一个 6 篇系列，说明每篇的目标、边界和前后关系。
```

## 2. tech-article-expert

### 职责

负责面向中文开发者的技术文章成稿与审校，包括：

- 深度技术解析、架构说明、安全分析和方案对比
- 分步教程、插件指南、功能实现和系列教学
- 文章重构、局部改写、技术审校和语言润色
- 事实、版本、代码、命令、链接和系列一致性检查

该 Skill 会按任务读取对应参考文件：

- 深度文章：`references/deep-article-patterns.md`
- 教程文章：`references/tutorial-patterns.md`

表格、Emoji、流程图、固定开场和固定结语均按内容需要选择，不作为强制模板。

### 使用示例

```text
使用 tech-article-expert 写一篇 NestJS 依赖注入原理文章，面向有 Node.js 基础的开发者。先给结构，确认后再写正文。
```

```text
把这份项目记录整理成一篇可复现的 Flutter 教程，代码必须标明文件位置和验证方式。
```

```text
审校这篇文章，重点检查 API 版本、示例代码、AI 套话和无依据的性能结论。
```

## 3. wechat-article-writer

### 职责

负责微信公众号场景下的完整交付：

- 将素材、博客或项目记录改写为公众号文章
- 适配手机阅读、标题、摘要、转发文案和 CTA
- 在公众号系列中维护术语、坑点和篇目衔接
- 按需生成封面及正文配图
- 在凭证与环境满足要求时发布到公众号草稿箱

只有请求明确出现公众号、微信推文、推送、公众号版本、发布到公众号等语义，或已存在对应公众号系列状态时，才应触发该 Skill。普通技术系列文章使用 `tech-article-expert`。

### 使用示例

```text
使用 wechat-article-writer 把这篇技术博客改成微信公众号版本，保留核心代码，优化手机阅读节奏。
```

```text
根据项目复盘材料写一篇公众号文章，不能编造效率数据或使用时长。
```

```text
将确认后的文章和封面发布到公众号草稿箱，发布前先检查凭证和一级标题。
```

## 常用组合

### 从选题到技术文章

1. 使用 `article-writing` 盘点内容、评估选题并形成大纲。
2. 用户确认选题和大纲。
3. 使用 `tech-article-expert` 完成正文、验证和审校。
4. 按 `AGENTS.md` 检查文章日期、封面及发布要求。

### 从选题到公众号文章

1. 使用 `article-writing` 确定选题、读者和内容边界。
2. 用户确认后，使用 `wechat-article-writer` 完成公众号成稿、配图和发布前检查。

### 从技术博客到公众号版本

1. 使用 `tech-article-expert` 保证原始技术博客的深度和可验证性。
2. 使用 `wechat-article-writer` 将博客压缩为适合手机阅读的公众号版本。
3. 不在改写过程中新增未经核实的数据、案例或作者亲历。

## 全局约束

所有 Skill 都必须遵守 `AGENTS.md`：

1. 非琐碎任务先给出规划或结构，获得确认后再实施。
2. 不编造 API、版本、数据、引用、使用时长、测试结果或作者亲历。
3. 创建新文章时生成封面图，并在 Frontmatter 中添加 `cover`。
4. 创建或修改文章时扫描已有日期，保证日期不晚于当天、不重复且文章内两处日期一致。
5. 只修改与当前目标直接相关的内容，不擅自扩写或重构。

## 目录结构

```text
.agents/skills/
├── article-writing/
│   └── SKILL.md
├── tech-article-expert/
│   ├── SKILL.md
│   └── references/
│       ├── deep-article-patterns.md
│       ├── tutorial-patterns.md
│       ├── deep-article-example.md
│       └── tutorial-article-example.md
└── WeChat-Insight-Skill/
    ├── SKILL.md
    ├── references/
    ├── examples/
    └── tools/
```

## 维护规范

- 新增通用写作规则时，优先更新 `tech-article-expert`，不要重新创建功能相同的 Skill。
- 只有选题和内容规划规则放入 `article-writing`。
- 只有微信公众号特有的排版、配图、系列状态和发布规则放入 `WeChat-Insight-Skill`。
- 场景细则和长示例放入 `references/`，`SKILL.md` 只保留触发边界、核心流程和引用导航。
- 修改 Skill 后运行结构校验：

```bash
python3 /Users/shen/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/article-writing
python3 /Users/shen/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/tech-article-expert
python3 /Users/shen/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/WeChat-Insight-Skill
```

## 版本控制说明

当前 `.gitignore` 忽略了整个 `.agents/` 目录，因此 Skill 文件只在本地生效，不会自动进入 Git 提交。根目录的本使用指南不在忽略范围内，可以正常跟踪。需要将 Skills 纳入团队版本管理时，应先单独评估并调整 `.gitignore`，避免误提交凭证、缓存或个人配置。
